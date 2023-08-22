const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    eleventyConfig.addWatchTarget("./src/scss/");
    eleventyConfig.addWatchTarget("./src/js/");
    eleventyConfig.addWatchTarget("./docs/scss`/");
    eleventyConfig.addWatchTarget("./docs/js/");
    eleventyConfig.addPassthroughCopy({"./src/assets": "assets"});

    eleventyConfig.setBrowserSyncConfig({
        open: true,
    });

    // Return your Object options:
    return {
        dir: {
            input: "src/views",
            output: "docs",
            includes: "_includes",
            layouts: "_layouts",
        },
    };
};
