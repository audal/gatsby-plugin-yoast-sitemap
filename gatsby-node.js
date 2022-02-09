const url = require("url");
const path = require("path");
const axios = require("axios");
const fse = require("fs-extra");
const { extractUrls, extractXslUrl } = require("./parse-sitemap");

const withoutTrailingSlash = (path) => path === `/` ? path : path.replace(/\/$/, ``);

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (find, replace) {
    return this.split(find).join(replace);
  };
}

exports.createPages = async ({ actions, graphql }, options) => {
  const { createRedirect } = actions;

  let { baseUrl, gatsbyUrl, auth, publicPath } = options || {};

  if (!baseUrl) {
    throw new Error("gatsby-plugin-yoast-sitemap: You must define the url for your Wordpress Install. This should not contain /graphql, if using gatsby-source-wordpress.")
  }

  if (!gatsbyUrl) {
    throw new Error("gatsby-plugin-yoast-sitemap: You must define the URL for your Gatsby-hosted site. This may be localhost.")
  }

  if (!publicPath) publicPath = `./public`

  gatsbyUrl = gatsbyUrl.replace("https://", "");
  gatsbyUrl = gatsbyUrl.replace("http://", "");

  let siteMapIndex = await axios.get(
    `https://${withoutTrailingSlash(baseUrl)}/sitemap_index.xml`,
    {
      auth: auth
    }
  );

  const xslUrl = await extractXslUrl(siteMapIndex.data);
  const xslFile = await axios.get(`https://${xslUrl}`, { auth: auth });
  await fse.outputFile(path.join(publicPath, `sitemap.xsl`), xslFile.data);

  const downloadableXMLNodes = await extractUrls(siteMapIndex.data);
  siteMapIndex = siteMapIndex.data.replaceAll(
    xslUrl,
    `${gatsbyUrl}/sitemap.xsl`
  );
  siteMapIndex = siteMapIndex.replaceAll(baseUrl, gatsbyUrl);
  siteMapIndex = siteMapIndex.replaceAll(
    `http://${gatsbyUrl}`,
    `https://${gatsbyUrl}`
  );
  await fse.outputFile(
    path.join(publicPath, `sitemap_index.xml`),
    siteMapIndex
  );

  for (const node of downloadableXMLNodes) {
    let mapFromNode = await axios.get(node, {
      auth: auth,
    });
    mapFromNode = mapFromNode.data.replaceAll(
      xslUrl,
      `${gatsbyUrl}/sitemap.xsl`
    )
    mapFromNode = mapFromNode.replaceAll(baseUrl, gatsbyUrl);
    mapFromNode = mapFromNode.replaceAll(`https://${gatsbyUrl}`, `https://${gatsbyUrl}`);
    const url_parts = url.parse(node);
    await fse.outputFile(
      path.join(publicPath, url_parts.pathname),
      mapFromNode
    );
  }

  createRedirect({
    fromPath: `/sitemap.xml`,
    toPath: `/sitemap_index.xml`,
    isPermanent: false,
    redirectInBrowser: true,
    force: true,
  });
};
