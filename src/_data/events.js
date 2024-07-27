const { DateTime } = require('luxon');

const url = `https://schedules.nbcolympics.com/api/v1/schedule?timeZone=America%2FLos_Angeles&startDate=${DateTime.now().toISODate()}&inPattern=true`;

module.exports = async function events() {
  let events;
  let currentEvents = [];
  
  try {
    const response = await fetch(url);
    events = await response.json()
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  
  events.data.forEach(event => {
    if ((event.singleEvent.endDate * 1000 > Date.now()) && (event.singleEvent.network != null) && (event.singleEvent.network != null) && (event.singleEvent.network.machineName != 'telemundo')) {
      currentEvents.push({
        startTime: DateTime.fromSeconds(event.singleEvent.startDate).setZone("America/Los_Angeles").toFormat('LLLL d, t'),
        endTime: event.singleEvent.endDate,
        img: event.singleEvent.thumbnail ? event.singleEvent.thumbnail.path : '',
        imgAlt: event.singleEvent.thumbnail ? event.singleEvent.thumbnail.altTitle : '',
        sport: event.sports.length ? event.sports.map(s => s.title).join(', ') : 'Non Sport',
        title: event.singleEvent.title,
        network: event.singleEvent.network.name,
        networkLogo: event.singleEvent.network.lightBackgroundLogo.path,
        summary: event.singleEvent.summary
      })
    }
  });

  return currentEvents
}