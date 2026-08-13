import { describe, it, expect } from 'vitest';
import { GET } from './+server.js';

const body_for = async (host: string) => {
	const res = GET({ url: new URL(`https://${host}/robots.txt`) });
	return await res.text();
};

describe('robots.txt', () => {
	it('allows crawling on the live domain', async () => {
		const body = await body_for('hoganandcrownlaw.com');
		expect(body).toContain('Allow: /');
		expect(body).not.toContain('Disallow');
		expect(body).toContain('https://hoganandcrownlaw.com/sitemap.xml');
	});

	it('allows crawling on the www live domain', async () => {
		expect(await body_for('www.hoganandcrownlaw.com')).toContain('Allow: /');
	});

	it('blocks crawling on the review domain', async () => {
		expect(await body_for('hoganandcrown.apexlinks.org')).toContain('Disallow: /');
	});

	it('blocks crawling on the workers.dev domain', async () => {
		expect(await body_for('hgc.apexlinks.workers.dev')).toContain('Disallow: /');
	});

	it('blocks a lookalike host', async () => {
		expect(await body_for('hoganandcrownlaw.com.evil.test')).toContain('Disallow: /');
	});
});
