import { site } from '#lib/site.js';

export const prerender = false;

const live_host = new URL(site.url).hostname;

export const GET = ({ url }: { url: URL }) => {
	const is_live = url.hostname === live_host || url.hostname === `www.${live_host}`;

	const body = is_live
		? `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`
		: `User-agent: *\nDisallow: /\n`;

	return new Response(body, {
		headers: { 'content-type': 'text/plain', 'cache-control': 'public, max-age=3600' }
	});
};
