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
    return DateTime.fromSeconds(input).setZone("America/New_York").toFormat('t')
  });

  return {
    dir: {
      input: "src",
      output: "public"
    }
  }
}