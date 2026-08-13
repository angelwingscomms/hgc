import { site } from '#lib/site.js';
import { services } from '#lib/content.js';

export const prerender = true;

const paths = ['', '/services', '/answers', '/about', '/contact'].concat(
	services.map((s) => `/services/${s.slug}`)
);

export const GET = () =>
	new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
	.map(
		(p) =>
			`\t<url><loc>${site.url}${p}</loc><changefreq>monthly</changefreq><priority>${p === '' ? '1.0' : '0.8'}</priority></url>`
	)
	.join('\n')}
</urlset>`,
		{ headers: { 'content-type': 'application/xml' } }
	);
