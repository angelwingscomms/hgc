// Every fact is published on the firm's own answers page. Nothing here is written from memory,
// and nothing is added without a source, because an attorney is liable for what these say.
export type Fact = {
	id: number;
	claim: string;
	detail: string;
	// The narrow version of the claim. Overstating any of these into the broad version is how a
	// true fact becomes a false one.
	careful: string;
};

export const FACTS: Fact[] = [
	{
		id: 3,
		claim: 'a notary is not a lawyer',
		detail:
			'In many countries a notary is a qualified legal professional. In the United States a notary public is licensed only to witness signatures, and cannot give legal advice or represent anyone before immigration.',
		careful: 'Only a licensed attorney or an accredited representative can represent you. Ask for a bar number.'
	},
	{
		id: 4,
		claim: 'the government will never phone you for money',
		detail:
			'Real notices arrive on paper with a case number you can check yourself. The government does not phone demanding immediate payment and does not take gift cards, wire transfers, or cryptocurrency.',
		careful: 'This is about payment demands by phone. It is not a claim that the government never calls at all.'
	},
	{
		id: 5,
		claim: 'the diversity visa lottery is free',
		detail:
			'Entry is free on the one official government site. Agents who charge are selling fifteen minutes of work, and many enter using their own contact details so they can hold the result hostage.',
		careful: 'Results are checked on the same free official site. Nobody emails to say you won.'
	},
	{
		id: 6,
		claim: 'you do not have to open the door',
		detail:
			'You do not have to open the door unless officers have a warrant signed by a judge, which is different from an administrative form signed by an immigration officer. You can ask them to slide it under the door.',
		careful: 'A judicial warrant does compel entry. The claim is about the administrative form, not all warrants.'
	},
	{
		id: 7,
		claim: 'leaving abandons a pending case',
		detail:
			'If an adjustment application is pending and you leave without advance parole, the application is treated as abandoned. Some categories have exceptions.',
		careful: 'Exceptions exist. The instruction is to ask before booking, every time, not that leaving is always fatal.'
	},
	{
		id: 8,
		claim: 'you must report a change of address',
		detail:
			'Most non-citizens must report a change of address to the government within a short deadline. Almost nobody does, and then a hearing notice goes to the old address and a removal order follows.',
		careful: 'State the obligation and the consequence. Do not state a specific deadline unless it is checked.'
	},
	{
		id: 9,
		claim: 'a bigger bank balance does not fix a 214(b)',
		detail:
			'A 214(b) refusal means the officer was not persuaded you will return home. Evidence of a life you are returning to does that: employment, property, a business, enrolment, dependants.',
		careful: 'A 214(b) refusal is not permanent and you can reapply. Never imply a guaranteed outcome.'
	},
	{
		id: 10,
		claim: 'a dismissed charge is not automatically a bar',
		detail:
			'A dismissed charge does not by itself stop naturalisation, but it still has to be disclosed and documented properly.',
		careful: 'Disclosure is still required. Never suggest anything can be left off a form.'
	}
];
