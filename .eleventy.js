const pkg = require('./package.json');
const CleanCSS = require("clean-css");

module.exports = function(eleventyConfig) {
  eleventyConfig.addFilter("cssmin", function (code) {
		return new CleanCSS({}).minify(code).styles;
	});

  eleventyConfig.addShortcode("version", () => pkg.version);

  return {
    dir: {
      input: "src",
      output: "public"
    }
  }
}