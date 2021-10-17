<p align="center">
  <a href="http://www.audallabs.com">
    <img alt="Audal Labs Logo" src="https://static.audallabs.com/logodark.png" width="90" />
  </a>
</p>

<h1 align="center">gatsby-plugin-yoast-sitemap</h1>

<h4 align="center">Grab the Yoast-generated sitemap from your existing WP install, reparse, and add to your Gatsby project.</h4>

<pre align="center">npm i gatsby-plugin-yoast-sitemap</pre>

#### Why should I use this?
If you have content editors/SEO people that work heavily with Yoast on WP, down to the sitemap level, then this plugin will save you from having to re-write Yoast's sitemap logic, which isn't similarly implemented by any other Gatsby sitemap plugins. This means any Geo or News style sitemap data that Yoast adds will be accessible via your Gatsby site - which is precisely the use case this was built for.

#### When should I use this/when should I not?
- Use if you know your Gatsby page creation logic mirror's WordPress' page creation logic
- Use if you have a legacy WordPress build you're just about to go headless with, and you want the sitemaps to be identical for Google's crawlers
- Use if you need Yoast context-aware sitemap data, such as geo-relevant data and Google News integration
- Probably don't use if you didn't say 'yes' to two or more of the above points (especially if your page creation/routing logic isn't identical - it'll hurt your SEO efforts more than it'll help)

#### Getting started
After installing, add the plugin to your `gatsby-config.js` file. You will need to add config options to setup the plugin.

#### Config/Options
| Option Name             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
|-----------------------------|-------------------------------------------------------------------------------------------------------------------
| baseUrl (required)       | The URL of your Wordpress Instance. Do not append the /graphql, if you're using gatsby-source-wordpress, etc.                          
| gatsbyUrl (required) | The URL where your site will live. This will be used to swap out links in your sitemap.                 
| auth (optional)     | If your Wordpress Instance is protected by Basic Auth, you can add your { username, password } here. Same syntax as gatsby-source-wordpress.                                                                                                                                                                                                                                                                                                                        
| publicPath (optional)     | This is the folder your re-parsed sitemap will be added to. Default is `./public`, just like Gatsby.                                                                                                                                                                                                                                                                                                   
