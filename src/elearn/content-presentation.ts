import cheerio from 'cheerio';
import updateQueryString from './update-query-string';

/**
 * Transforms the HTML string. Injects tokens into img src attributes so that 
 * images actually display. 
 * 
 * @param html The HTML string to inject tokens into.
 * @param token Token string to inject into URLs as query strings.
 * @param changeBaseUrl Whether or not to change base URL from /pluginfile to /webservice/pluginfile.
 */
export function transformHtml(html: string, token: string, changeBaseUrl?: boolean) {
  const $ = cheerio.load(html);

  
  $('*').each(function() {
    // Overwrite all classes and styles
    $(this).attr("class", "");
    $(this).attr("style", "")

    // Check for video tags and set them up properly
    const data = $(this).data("setup-lazy");
    if (data) {
      if (data.techOrder && data.techOrder.indexOf('youtube') !== -1) {
        $(this).replaceWith(`
          <iframe width="953" height="536" src="https://www.youtube.com/embed/${data.sources[0].src.split("/").pop()}" frameborder="0"/>
        `)
      }
    }
    /*
    <iframe width="953" height="536" src="https://www.youtube.com/embed/r7jVkDfuTRY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    */
  });

  $('img').each(function() {
    const oldSrc = $(this).attr("src");
    const newSrc = updateQueryString("token", token, changeBaseUrl ? oldSrc.replace("pluginfile", "webservice/pluginfile") : oldSrc);
    $(this).attr("src", newSrc);

    const oldStyle = $(this).attr("style");
    const newStyle = `${oldStyle ? oldStyle : ''} max-width: 100% !important; height: auto; border-radius: 5px; margin: 5px;`;
    $(this).attr("style", newStyle);
  })

  return $.html();
}

/**
 * Transforms the URL string. Injects token into it as a query string. 
 * 
 * @param url URL to inject token into.
 * @param token Token string to inject into URL as a query string.
 */
export function transformUrl(url: string, token: string) {
  return updateQueryString("token", token, url.replace("pluginfile", "webservice/pluginfile"));
}

/**
 * Transforms the URL string without replacing pluginfile w/ webservice/pluginfile.
 * 
 * @param url URL to inject token into.
 * @param token Token string to inject into URL as a query string.
 */
export function transformUrlWithoutChangingBaseURL(url: string, token: string) {
  return updateQueryString("token", token, url);
}