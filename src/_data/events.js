const { DateTime } = require('luxon');

const now = Date.now()/1000

async function loadEvents(date) {
  const url = `https://schedules.nbcolympics.com/api/v1/schedule?timeZone=America%2FLos_Angeles&startDate=${date}&inPattern=true`;

  let allEvents;
  let events = [];
  let tags = [];
  
  try {
    const response = await fetch(url);
    allEvents = await response.json()
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  
  allEvents.data.forEach(event => {
    if ((event.singleEvent.endDate * 1000 > Date.now()) && (event.singleEvent.network != null) && (event.singleEvent.network != null) && (event.singleEvent.language.includes('en')) && (event.singleEvent.network.machineName != 'gold-zone')) {
      
      let allTags = event.sports.length ? event.sports.map(s => s.title).join(', ') : '';
    
      if (allTags) {
        tags.push(...event.sports.map(s => s.title));
      }

      events.push({
        startTime: DateTime.fromSeconds(event.singleEvent.startDate).toFormat('t'),
        endTime: event.singleEvent.endDate,
        img: event.singleEvent.thumbnail.path,
        imgAlt: event.singleEvent.thumbnail.altTitle,
        sport: event.sports.length ? event.sports.map(s => s.title).join(', ') : 'Non Sport',
        title: event.singleEvent.title,
        summary: event.singleEvent.summary,
        network: event.singleEvent.network.name,
        networkLogo: event.singleEvent.network.lightBackgroundLogo.path,
        live: (event.singleEvent.startDate <= now && now < event.singleEvent.endDate), // status was unreliable
        medal: event.singleEvent.isMedalSession ? 'gold' : '',
        rundown: event.singleEvent.rundown.items ? event.singleEvent.rundown.items : null,
      })
    }
  });

  tags = [...new Set(tags)];

  return {events, tags}
}

module.exports = async function() {
  const today = await loadEvents(DateTime.now().toISODate())
  const tomorrow = await loadEvents(DateTime.now().plus({days: 1}).toISODate())

  return {
    today,
    tomorrow,
  }
}