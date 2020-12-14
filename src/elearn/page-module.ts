import got from 'got';
import { transformHtml, transformUrl } from './content-presentation';
import UpdateQueryString from './update-query-string';

const client = got.extend();

export async function getPageHtml(url: string, token: string) {
  return transformHtml(await (await client(UpdateQueryString("token", token, url))).body, token);
}