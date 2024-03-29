const cheerio = require("cheerio");
const axios = require("axios");

const urls = [];

async function extractSingleUrl(url) {
  if (url.slice(-4) === ".xml" || url.slice(-4) === ".kml") {
    urls.push(url);
    if (url.search(/\.xml$/)) {
      const siteMapIndex = await axios.get(url);
      await walkUrls(siteMapIndex.data);
    }
  }
}

async function walkUrls(xml, url) {
  const $ = cheerio.load(xml, { xmlMode: true });
  const locs = [];

  if ($("loc").length === 0) {
    // display warning but don't fail promise
    // console.error('WARNING: Empty sitemap (%s)', url);
  }
  // avoid cheerio objects and use std arrays
  $("loc").map(function () {
    locs.push($(this).text().trim());
    return true;
  });

  for (const loc of locs) {
    await extractSingleUrl(loc);
  }
}

async function extractUrls(xml, cliFlags) {
  const result = await walkUrls(xml);
  console.log(result);

  return urls;
}

async function extractXslUrl(xml) {
  const $ = cheerio.load(xml, { xmlMode: true });
  var preamble = $.root()[0].children.filter(x => x.type === "directive");
  var xslDirective = preamble.find(
    directive => directive.name === "?xml-stylesheet"
  );
  var xslUrl = xslDirective.data.match('href="//(.*?)"');
  return xslUrl[1];
}

exports.extractUrls = extractUrls;
exports.extractXslUrl = extractXslUrl;
