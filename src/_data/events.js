const { DateTime } = require('luxon');

const url = `https://schedules.nbcolympics.com/api/v1/schedule?timeZone=America%2FLos_Angeles&startDate=${DateTime.now().toISODate()}&inPattern=true`;

module.exports = async function events() {
  let events;
  let currentEvents = [];
  let currentTags = [];
  
  try {
    const response = await fetch(url);
    events = await response.json()
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  
  events.data.forEach(event => {
    if ((event.singleEvent.endDate * 1000 > Date.now()) && (event.singleEvent.network != null) && (event.singleEvent.network != null) && (event.singleEvent.language.includes('en')) && (event.singleEvent.network.machineName != 'gold-zone')) {
      
      let tags = event.sports.length ? event.sports.map(s => s.title).join(', ') : '';
    
      if (tags) {
        currentTags.push(...event.sports.map(s => s.title));
      }

      currentEvents.push({
        startTime: DateTime.fromSeconds(event.singleEvent.startDate).toFormat('LLLL d, t'),
        endTime: event.singleEvent.endDate,
        img: event.singleEvent.thumbnail.path,
        imgAlt: event.singleEvent.thumbnail.altTitle,
        sport: event.sports.length ? event.sports.map(s => s.title).join(', ') : 'Non Sport',
        title: event.singleEvent.title,
        summary: event.singleEvent.summary,
        network: event.singleEvent.network.name,
        networkLogo: event.singleEvent.network.lightBackgroundLogo.path,
        live: (event.singleEvent.status == 'live'),
        rundown: event.singleEvent.rundown.items ? event.singleEvent.rundown.items : null,
      })
    }
  });

  currentTags = [...new Set(currentTags)];

  return {currentEvents, currentTags}
}