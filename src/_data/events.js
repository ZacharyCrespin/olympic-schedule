const { DateTime } = require('luxon');

const now = DateTime.now().toSeconds()

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
    if ((event.singleEvent.endDate > now) && (event.singleEvent.language.includes('en')) && (event.singleEvent.network?.machineName !== 'gold-zone') && (event.singleEvent.title !== 'Best of Milan Cortina')) {

    if (event.singleEvent.network == null) {
      event.singleEvent.network = {
        machineName: 'peacock',
        name: 'Peacock',
        lightBackgroundLogo: {
          path: '/peacock.png'
        }
      };
    }

      let allTags = event.sports.length ? event.sports.map(s => s.title).join(', ') : '';
    
      if (allTags) {
        tags.push(...event.sports.map(s => s.title));
      }

      function calcDuration(start, end) {
        if (!start || !end || end <= start) return '0h 0m';

        const startTime = DateTime.fromSeconds(start);
        const endTime = DateTime.fromSeconds(end);

        const totalMinutes = Math.max(0, endTime.diff(startTime, 'minutes').minutes);

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return `${((hours > 0) ? `${hours}h`: '')} ${String(minutes).padStart(2, '0')}m`;
      }

      if (event.singleEvent.rundown.items) {
        event.singleEvent.rundown.items.forEach(item => {
          const adjustedTime = DateTime.fromSeconds(item.date, { zone: "America/New_York" }).setZone("America/Los_Angeles").toSeconds()
          if (adjustedTime >= event.singleEvent.startDate) {
            item.displayTime = DateTime.fromSeconds(adjustedTime, { zone: "America/Los_Angeles" }).toFormat('t')
            event.singleEvent.rundown.timeAdjusted = true
            item.timeAdjusted = true
          } else {
            item.displayTime = DateTime.fromSeconds(adjustedTime, { zone: "America/New_York" }).toFormat('t')
            event.singleEvent.rundown.timeAdjusted = false
            item.timeAdjusted = false
          }
        });
      }

      events.push({
        startTime: event.singleEvent.startDate,
        endTime: event.singleEvent.endDate,
        time: DateTime.fromSeconds(event.singleEvent.startDate).toFormat('t'),
        duration: calcDuration(event.singleEvent.startDate, event.singleEvent.endDate),
        img: event.singleEvent.thumbnail.path,
        imgAlt: event.singleEvent.thumbnail.altTitle,
        sport: event.sports.length ? event.sports.map(s => s.title).join(', ') : 'Non Sport',
        title: event.singleEvent.title,
        summary: event.singleEvent.summary,
        network: event.singleEvent.network.name,
        networkLogo: event.singleEvent.network.lightBackgroundLogo.path,
        live: (event.singleEvent.startDate <= now && now < event.singleEvent.endDate), // status was unreliable
        medal: event.singleEvent.isMedalSession,
        rundown: event.singleEvent.rundown,
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