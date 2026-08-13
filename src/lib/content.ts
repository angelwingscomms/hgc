export type Service = {
	slug: string;
	ref: string;
	title: string;
	short: string;
	lede: string;
	body: string[];
	covers: string[];
	watch: { head: string; text: string };
	faqs: { q: string; a: string }[];
};

export const services: Service[] = [
	{
		slug: 'family-immigration',
		ref: '01',
		title: 'Family immigration',
		short: 'Bringing family to the United States',
		lede: 'Petitions for spouses, parents, children, and siblings — filed properly the first time.',
		body: [
			'Most people who move to the United States get there through a family member. The rules split families into two groups, and which group you land in decides almost everything about your wait.',
			'Immediate relatives — the spouse, parent, or unmarried child under 21 of a US citizen — have no annual limit. Everyone else sits in a preference category and waits for a priority date to become current. Nobody can make that queue move faster. What we can do is make sure your place in it is secured correctly and early, and that nothing in your file gives anyone a reason to send it back.'
		],
		covers: [
			'Spouse and fiancé petitions',
			'Parents and children of US citizens',
			'Preference petitions for siblings and adult children',
			'Affidavit of support and joint sponsors',
			'Consular processing and interview preparation',
			'Waivers for prior overstay or misrepresentation'
		],
		watch: {
			head: 'The mistake we see most',
			text: 'Filing while the beneficiary is inside the United States without checking their status history first. Departing the country after a long overstay can trigger a three or ten year bar that the petition cannot fix.'
		},
		faqs: [
			{
				q: 'How long does a family petition take?',
				a: 'It depends entirely on your category and, for preference categories, your priority date. Immediate relatives of US citizens have no queue. Everyone else does, and the wait is set by government demand, not by your lawyer. We will tell you the honest range for your category at the first call.'
			},
			{
				q: 'Can I petition for my family if I am a green card holder, not a citizen?',
				a: 'Yes, for a spouse and unmarried children, though the wait is generally longer than it would be for a US citizen. Green card holders cannot petition for parents or siblings.'
			},
			{
				q: 'My sponsor does not earn enough. Is that the end of it?',
				a: 'No. Assets can count toward the shortfall, a joint sponsor can step in and does not need to be a relative, and income from qualifying household members can be added. Being below the line is a problem to solve, not a wall.'
			}
		]
	},
	{
		slug: 'green-cards',
		ref: '02',
		title: 'Green cards',
		short: 'Permanent residency, inside or outside the US',
		lede: 'Adjustment of status and consular processing, including conditional residence and the interview.',
		body: [
			'There are two doors to a green card. If you are already in the United States and eligible, you adjust status without leaving. If you are abroad, or not eligible to adjust, you go through a consulate. The paperwork overlaps but the risk profile is completely different, and choosing the wrong door can cost you years.',
			'If your marriage was under two years old when residence was granted, you receive conditional residence and must file to remove those conditions in a set window. Missing that window is one of the fastest ways a settled family ends up in removal proceedings.'
		],
		covers: [
			'Adjustment of status inside the United States',
			'Consular processing through a US embassy',
			'Employment authorisation and advance parole while pending',
			'Removing conditions on a two-year card',
			'Interview preparation and evidence assembly',
			'Requests for evidence and denied case review'
		],
		watch: {
			head: 'The mistake we see most',
			text: 'International travel while an adjustment application is pending, without advance parole. The government treats the application as abandoned. The airline will not warn you and there is no appeal to the airport.'
		},
		faqs: [
			{
				q: 'Can I work while my green card application is pending?',
				a: 'Usually yes, but only after employment authorisation is granted, and that is a separate application you file alongside the main one. Working before it is approved is a status violation.'
			},
			{
				q: 'What actually happens at the marriage interview?',
				a: 'An officer checks that your marriage is real by testing whether the two of you built a shared life that leaves a paper trail — a joint lease, joint accounts with real activity, each other on insurance, photographs across time. It is a documents test, not a romance quiz.'
			},
			{
				q: 'I received a request for evidence. Is my case in trouble?',
				a: 'Not necessarily. It usually means one specific thing is missing or unclear. What matters is answering completely and on time. A thin or late response is what turns a request for evidence into a denial.'
			}
		]
	},
	{
		slug: 'citizenship',
		ref: '03',
		title: 'Citizenship',
		short: 'Naturalisation and the N-400',
		lede: 'Eligibility review, the application, the test, and the parts of your history that need handling first.',
		body: [
			'The usual rule is five years as a permanent resident, or three if you are married to and living with a US citizen. On top of that you need continuous residence, enough physical presence inside the country, good moral character over the relevant period, and the English and civics tests unless you qualify for an exemption.',
			'The application asks whether you have ever been arrested, cited, or detained. Ever, anywhere, including matters that were dismissed and matters that predate your green card. The background check at this stage goes deeper than the one at the green card stage. Old items are usually survivable. Undisclosed old items are what put your existing status at risk.'
		],
		covers: [
			'Eligibility and date counting',
			'Continuous residence and physical presence review',
			'Good moral character assessment before filing',
			'Disclosure of arrests, citations, and dismissed matters',
			'Test exemptions and disability accommodations',
			'Interview preparation and oath ceremony'
		],
		watch: {
			head: 'The mistake we see most',
			text: 'Filing before checking whether a long trip abroad broke continuous residence. People find out at the interview, after paying and waiting, that a clock they thought was finished had reset.'
		},
		faqs: [
			{
				q: 'When exactly can I apply?',
				a: 'You can generally file shortly before you reach the five or three year mark rather than waiting for the exact date. Many people sit on an extra year for no reason. Bring us your green card date and we will count it properly.'
			},
			{
				q: 'Does a dismissed charge stop me becoming a citizen?',
				a: 'Usually not, but it has to be disclosed and documented. The risk is almost never the old charge. The risk is answering "no" to a question the background check answers "yes".'
			},
			{
				q: 'Do I have to give up my other citizenship?',
				a: 'The United States does not require you to renounce another nationality. Whether your home country allows dual citizenship is a question for that country. Nigeria, for example, permits it for citizens by birth.'
			}
		]
	},
	{
		slug: 'deportation-defense',
		ref: '04',
		title: 'Deportation defence',
		short: 'Removal proceedings and immigration court',
		lede: 'If you have a notice to appear, you have a case to make. This is time-critical work.',
		body: [
			'A notice to appear is the start of a process, not the end of your life in the United States. The first hearing is short and mostly administrative. The hearing where you present your defence comes later, and there are real defences: cancellation of removal, asylum, adjustment through a family member, waivers, and more.',
			'Every one of them has to be raised properly and on time. The single thing that guarantees you lose is not showing up, because the court can order you removed in your absence. Go to every hearing. Then get counsel before the next one.'
		],
		covers: [
			'Master calendar and individual hearings',
			'Cancellation of removal',
			'Asylum, withholding, and protection under the Convention Against Torture',
			'Adjustment of status in court',
			'Bond hearings for detained clients',
			'Appeals to the Board of Immigration Appeals',
			'Motions to reopen an in-absentia order'
		],
		watch: {
			head: 'The mistake we see most',
			text: 'Signing a document at a detention facility because someone said it speeds things up. It is often a waiver of your right to see a judge. You can say: I am not signing anything until I speak with a lawyer.'
		},
		faqs: [
			{
				q: 'I missed a hearing. Is it over?',
				a: 'Not automatically. A motion to reopen an in-absentia removal order is possible in some circumstances, and the deadlines are short and strict. Contact us the day you find out, not the week after.'
			},
			{
				q: 'Do I have to open the door if immigration comes to my home?',
				a: 'Not unless they have a warrant signed by a judge. An administrative form signed by an immigration officer is not the same thing. You can ask them to slide it under the door, and you can say you do not consent to entry and want to speak to a lawyer.'
			},
			{
				q: 'A family member is detained. What is the first step?',
				a: 'Get the alien registration number and the facility name. With those two things we can locate them and assess whether a bond hearing is possible. Call us before you pay anyone who promises a fast release.'
			}
		]
	},
	{
		slug: 'asylum',
		ref: '05',
		title: 'Asylum and protection',
		short: 'Asylum, withholding, and refugee claims',
		lede: 'Claims based on a well-founded fear of persecution. The filing clock is one year.',
		body: [
			'Asylum is for people who cannot safely return home because of persecution based on race, religion, nationality, political opinion, or membership in a particular social group. In general you must file within one year of arriving in the United States. Exceptions exist for changed circumstances at home and extraordinary circumstances in your own life, but they are narrow and you have to prove them.',
			'A strong claim is built on evidence, not just testimony: country conditions, medical and psychological records, witness statements, documents from home. Cases fail far more often on preparation than on the underlying facts.'
		],
		covers: [
			'Affirmative applications filed with USCIS',
			'Defensive applications in immigration court',
			'Withholding of removal and Convention Against Torture claims',
			'Country conditions evidence and expert declarations',
			'Work authorisation while the claim is pending',
			'Bringing a spouse and children onto an approved claim'
		],
		watch: {
			head: 'The mistake we see most',
			text: 'Waiting past the one year mark while saving for a lawyer or hoping conditions at home improve. Filing something on time beats filing something perfect late.'
		},
		faqs: [
			{
				q: 'What if the one year deadline has already passed?',
				a: 'Come in anyway. There are recognised exceptions, and even where asylum is barred, withholding of removal and protection under the Convention Against Torture may still be available. Do not assume you have no options.'
			},
			{
				q: 'Can I work while my asylum case is pending?',
				a: 'Employment authorisation becomes available after your application has been pending for a set period, and there are rules about what pauses that clock. We will tell you where you stand.'
			},
			{
				q: 'Will my family at home be in danger if I apply?',
				a: 'Asylum applications are confidential and are not shared with your home government. We take this seriously and will explain exactly who sees what.'
			}
		]
	},
	{
		slug: 'business-immigration',
		ref: '06',
		title: 'Business immigration',
		short: 'Work visas and employer compliance',
		lede: 'Routes for talent and investors, plus the paperwork that keeps employers out of trouble.',
		body: [
			'The lottery is not the only door. Depending on the role, the person, and the country, there are routes for extraordinary ability, intracompany transfers, treaty investors and traders, and employment-based permanent residency. Several have no annual cap and no lottery at all.',
			'On the employer side, most problems are not exotic. They are ordinary record-keeping done carelessly for years. Employment eligibility verification forms kept inside personnel files turn a narrow audit into a wide one. Fixing that costs an afternoon, and it is worth far more than it sounds.'
		],
		covers: [
			'Extraordinary ability and outstanding researcher petitions',
			'Intracompany transfers',
			'Treaty investor and trader visas',
			'Employment-based permanent residency',
			'Employment eligibility verification audits and clean-up',
			'Onboarding policy for employers hiring foreign nationals'
		],
		watch: {
			head: 'The mistake we see most',
			text: 'Resigning before checking the timing. Work status is usually tied to a specific employer, and a clean Friday-to-Monday move can leave a gap where you had no status at all.'
		},
		faqs: [
			{
				q: 'My employer says they do not do sponsorship. Is that final?',
				a: 'Often they are picturing the most expensive route and assuming it is the only one. Bring them a specific option with a real cost and the conversation changes. We can tell you which options fit your role.'
			},
			{
				q: 'Do you advise on Texas business law?',
				a: 'Our practice is United States immigration law, which is federal and which we handle for clients in any state. For matters of state law we will refer you to the right Texas counsel rather than guess.'
			},
			{
				q: 'How do I prepare for an employment eligibility audit?',
				a: 'Start by keeping those forms in one separate binder, apart from personnel files, and by running an internal check before anyone else does. We do that review for employers as a fixed-scope engagement.'
			}
		]
	}
];

export const answers: { group: string; items: { q: string; a: string }[] }[] = [
	{
		group: 'Before you hire anyone',
		items: [
			{
				q: 'Is a notary the same as a lawyer?',
				a: 'No, and this difference costs immigrant families more money than almost anything else. In many countries a notary is a qualified legal professional. In the United States a notary public is licensed only to witness signatures. They cannot give legal advice or represent you before immigration. Only a licensed attorney or a specifically accredited representative can. Ask anyone who offers to help with your case for their bar number. A real lawyer gives it to you immediately.'
			},
			{
				q: 'Can a lawyer guarantee my case will be approved?',
				a: 'No. Anyone who guarantees an outcome is telling you something they cannot know, because a government officer decides, not your lawyer. What you should get instead is an honest read of where you stand, the options that actually apply, the risks of each said out loud, and a written fee agreement before any money moves.'
			},
			{
				q: 'You are licensed in New York. Can you represent me in another state?',
				a: 'Yes. United States immigration law is federal, so an immigration attorney admitted in any state can represent clients before USCIS, the immigration courts, and consulates nationwide. We work with clients across the country and abroad.'
			},
			{
				q: 'What does a first consultation cost?',
				a: 'The first fifteen minutes are free and there is no pitch at the end. If your matter needs a longer strategy session, we will tell you the fee before you book it, never after.'
			}
		]
	},
	{
		group: 'Scams and safety',
		items: [
			{
				q: 'Does the government ever call and ask for payment?',
				a: 'No. Real notices arrive by post, on paper, with a case number you can check yourself on the official government website. The government does not phone demanding immediate payment and does not accept gift cards, wire transfers to a person, or cryptocurrency. Any call threatening arrest unless you pay right now is a scam, and it targets immigrants specifically because the fear is real.'
			},
			{
				q: 'Is the diversity visa lottery free to enter?',
				a: 'Yes. Entry is free on the one official government site. Agents who charge a fee are selling you something that takes fifteen minutes to do yourself, and many enter using their own contact details so they can hold your result hostage later. Results are checked on the same free official site. Nobody emails you to say you won.'
			},
			{
				q: 'What should I do if immigration officers come to my door?',
				a: 'You do not have to open the door unless they have a warrant signed by a judge, which is different from an administrative form signed by an immigration officer. Ask them to slide it under the door and read the top. You can state through the closed door that you do not consent to entry and that you want to speak to a lawyer, then say nothing further. Silence is a right.'
			}
		]
	},
	{
		group: 'Timing and travel',
		items: [
			{
				q: 'Does leaving the United States trigger a bar?',
				a: 'It can, and this catches people who are trying to do the right thing. Unlawful presence of more than one hundred and eighty days can bring a three year bar, and more than one year can bring a ten year bar. The bar activates on departure, not while you are inside. People who go home to fix their papers properly sometimes lock themselves out for a decade. Speak to someone before you buy a ticket.'
			},
			{
				q: 'Can I travel while my case is pending?',
				a: 'Sometimes, and sometimes it destroys the case. If you have an adjustment application pending and you leave without advance parole, the application is treated as abandoned. Some categories have exceptions. Ask before you book, every time, even for a funeral.'
			},
			{
				q: 'I moved house. Do I need to tell anyone?',
				a: 'Yes. Most non-citizens have a legal obligation to report a change of address to the government within a short deadline. Almost nobody does it, and then a hearing notice goes to the old address and a removal order follows. It takes ten minutes online.'
			}
		]
	},
	{
		group: 'Denials and refusals',
		items: [
			{
				q: 'What does a 214(b) refusal actually mean?',
				a: 'It means the officer was not persuaded you will return home. The law tells them to assume every applicant for a temporary visa intends to stay, and your job is to overcome that. A larger bank balance does not do it. Evidence of a life you are returning to does: employment, property, a business, enrolment, dependants. A 214(b) refusal is not permanent and you can reapply.'
			},
			{
				q: 'I received a 221(g). Have I been denied?',
				a: 'No. Your case is paused, either because a document is missing or because it is in administrative processing. Those are different situations with different fixes. Do not start a fresh application, because you lose your place and your fee.'
			},
			{
				q: 'Should I hide a previous refusal on a new application?',
				a: 'Never. Every application is in the system and the officer sees your history before you sit down. A refusal is common and not permanent. A false statement is a different category of problem entirely and can follow you for life.'
			}
		]
	}
];

export const testimonials = [
	{
		quote:
			'Queenette possesses a deep understanding of immigration law that is truly impressive. She navigated the complexities of my case with ease, providing insightful advice and ensuring every aspect was handled meticulously.',
		who: 'Client review'
	}
];
