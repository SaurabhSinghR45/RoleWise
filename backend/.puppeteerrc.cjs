const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer to a local directory for cloud buildpacks
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
