export const site = {
	name: 'Hogan and Crown Law',
	short: 'Hogan & Crown',
	tagline: 'US immigration counsel',
	url: 'https://hoganandcrownlaw.com',
	email: 'info@hoganandcrownlaw.com',
	phone_direct: '469-288-1606',
	phone_office: '469-309-7794',
	fax: '469-941-2026',
	whatsapp: '14692881606',
	booking: 'https://hoganandcrownlaw.com/appointment',
	address: {
		line1: '9330 Lyndon B. Johnson Fwy',
		line2: 'Lake Highland Towers, Suite 248',
		city: 'Dallas',
		region: 'TX',
		postal: '75243',
		country: 'US'
	},
	hours: 'Monday to Friday, 8:00am – 4:30pm CST',
	hours_note: 'In-person meetings by appointment only',
	counsel: {
		name: 'Queenette Hogan',
		role: 'Managing partner',
		bars: ['New York', 'Nigeria'],
		years: 14
	},
	social: [
		{ label: 'Instagram', url: 'https://www.instagram.com/hogan_and_crown_law/' },
		{ label: 'TikTok', url: 'https://www.tiktok.com/@lawyergirl505' },
		{ label: 'YouTube', url: 'https://www.youtube.com/@queenettehogan8559' },
		{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/queenettehoganprofile/' },
		{
			label: 'Facebook',
			url: 'https://www.facebook.com/profile.php?id=61558541197240'
		}
	]
} as const;

export const whatsapp_link = (msg = "Hello, I'd like to ask about my immigration case.") =>
	`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;

export const tel_link = (n: string) => `tel:+1${n.replace(/\D/g, '')}`;

export const nav_links = [
	{ href: '/services', label: 'Services', ref: '01' },
	{ href: '/answers', label: 'Answers', ref: '02' },
	{ href: '/about', label: 'About', ref: '03' },
	{ href: '/contact', label: 'Contact', ref: '04' }
] as const;
