const pkg = require('./package.json');
const CleanCSS = require("clean-css");
const { DateTime } = require('luxon');

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("cssmin", function (code) {
		return new CleanCSS({}).minify(code).styles;
	});

  eleventyConfig.addShortcode("version", () => pkg.version);

  eleventyConfig.addFilter("itemTime", function (input) {
    if (!input) {
      return "Time TBD"
    }
    return DateTime.fromSeconds(input, {zone: "America/New_York"}).toFormat('t')
  });

  eleventyConfig.addFilter("boldSport", function (input) {
    const allSports = [
      'Archery',              'Artistic Swimming',     'Badminton',
      'Basketball',           'Basketball 3x3',        'Beach Volleyball',
      'Blind Soccer',         'Boccia',                'Boxing',
      'Breaking',             'Canoeing',              'Ceremony',
      'Ceremony',             'Cycling',               'Diving',
      'Equestrian',           'Fencing',               'Field Hockey',
      'Goalball',             'Golf',                  'Gymnastics',
      'Handball',             'Judo',                  'Modern Pentathlon',
      'Para Archery',         'Para Badminton',        'Para Canoe',
      'Para Cycling',         'Para Equestrian',       'Para Judo',
      'Para Powerlifting',    'Para Rowing',           'Para Swimming',
      'Para Table Tennis',    'Para Taekwondo',        'Para Track & Field',
      'Para Triathlon',       'Rhythmic Gymnastics',   'Rowing',
      'Rugby',                'Sailing',               'Shooting',
      'Shooting Para Sports', 'Sitting Volleyball',    'Skateboarding',
      'Soccer',               'Sport Climbing',        'Surfing',
      'Swimming',             'Table Tennis',          'Taekwondo',
      'Tennis',               'Track & Field',         'Trampoline',
      'Triathlon',            'Volleyball',            'Water Polo',
      'Weightlifting',        'Wheelchair Basketball', 'Wheelchair Fencing',
      'Wheelchair Rugby',     'Wheelchair Tennis',     'Wrestling'
    ]
    allSports.forEach(str => {
      const regex = new RegExp(`(${str})`, 'gi');
      input = input.replace(regex, '<b>$1</b>');
    });
    return input
  });

  return {
    dir: {
      input: "src",
      output: "public"
    }
  }
}