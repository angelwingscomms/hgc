import { error } from '@sveltejs/kit';
import { services } from '#lib/content.js';

export const prerender = true;

export const entries = () => services.map((x) => ({ slug: x.slug }));

export const load = ({ params }: { params: { slug: string } }) => {
	const s = services.find((x) => x.slug === params.slug);
	if (!s) error(404, 'No such file');
	return { s };
};
