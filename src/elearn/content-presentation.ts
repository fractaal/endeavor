import cheerio from 'cheerio';
import updateQueryString from './update-query-string';

/**
 * We need to inject the token onto any src attributes or file download URLs
 * in order for them to display at all in Endeavor. Also, add a styling that restrains img width to size of card.
 */

export function transformForPresentation(html: string, token: string) {
  const $ = cheerio.load(html);
  let dominantColor;

  $('img').each(function() {
    const oldSrc = $(this).attr("src");
    const newSrc = updateQueryString("token", token, oldSrc);
    $(this).attr("src", newSrc);

    const oldStyle = $(this).attr("style");
    const newStyle = `${oldStyle ? oldStyle : ''} max-width: 100% !important; height: auto; border-radius: 5px; margin: 5px;`;
    $(this).attr("style", newStyle);
  })

  return $.html();
}