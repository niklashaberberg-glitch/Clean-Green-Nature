/* =====================================================================
   TrimmoTrade – Help topics, English

   Kein Wörterbuch, sondern eine eigene Wissensbasis. Der Grund ist der
   Abgleich: Er läuft über Wortstämme und Muster, und ein deutscher Stamm
   wie „kuendig“ findet in „how do I cancel my subscription“ nichts.
   Titel, Beispielfragen, Schlagworte und Muster müssen deshalb englisch
   sein – und wenn ohnehin alles daneben steht, sind die Antworten in
   englischer Prosa besser als Satz für Satz übersetzte.

   Die Kennungen (id) sind dieselben wie in hilfe.js: Ein Verweis auf ein
   Thema funktioniert damit in beiden Sprachen.
   ===================================================================== */
(function (TT) {
  'use strict';

  const U = TT.util;

  const THEMEN_EN = [
    /* ---------------- Plans and money ---------------- */
    {
      id: 'kosten',
      titel: 'What does TrimmoTrade cost?',
      gruppe: 'Plans',
      fragen: ['what does it cost', 'is it free', 'prices', 'how expensive is plus', 'what does a subscription cost'],
      schlag: ['cost', 'price', 'expensive', 'free', 'fee', 'pay', 'subscription', 'euro', 'charge'],
      antwort: () => {
        const t = TT.plan.TARIFE.plus;
        return 'The search is completely free: every listing, the map, matching, the fraud check notice, '
          + 'the benchmark rent and all the calculators. Ads pay for it.\n\n'
          + 'TrimmoTrade Plus costs ' + U.eur2(t.preisMonat) + ' a month or ' + U.eur2(t.preisJahr)
          + ' a year and mainly takes manual work off your hands: several saved searches, batch '
          + 'applications, the full contract magnifier, swap chains across three and four households, '
          + 'and no ads.\n\n'
          + 'The first ' + U.num(TT.plan.GRUENDER.plaetze) + ' sign-ups get Plus free for twelve months '
          + '– with no subscription and no payment details.';
      },
      ziele: [['See plans', 'plus'], ['Claim a founder place', 'plus']]
    },
    {
      id: 'kuendigen',
      titel: 'How do I cancel?',
      gruppe: 'Plans',
      fragen: ['how do i cancel', 'end subscription', 'cancel contract', 'how do i get rid of plus'],
      schlag: ['cancel', 'end', 'stop', 'terminate', 'unsubscribe', 'contract', 'withdraw', 'subscription'],
      muster: [/\b(rid of|quit|stop)\b/, /no longer (want|pay|use)/],
      antwort: () => {
        const q = TT.plan.plusQuelle();
        if (q === 'gruender') {
          return 'On this device Plus runs on a founder place – that is not a subscription. It does not '
            + 'renew, nothing is charged, and there is nothing to cancel. After '
            + TT.plan.gruenderTageRest() + ' days it ends by itself.\n\n'
            + 'You can still hand the place back at any time.';
        }
        if (q === 'bezahlt') {
          return 'Through the “Cancel contracts” button – no sign-in, no questions asked, no detour via '
            + 'customer service. The cancellation takes effect at the end of the current term, and '
            + 'receipt is confirmed in text form.\n\nWithin the first fourteen days you can withdraw '
            + 'instead; that is usually better for you.';
        }
        return 'No paid contract is running on this device – the free plan does not need cancelling. '
          + 'If you do have one: the “Cancel contracts” button handles it without a sign-in and without '
          + 'any questions.';
      },
      ziele: [['Cancel contracts', 'recht/kuendigen'], ['Right of withdrawal', 'recht/widerruf']]
    },
    {
      id: 'werbung',
      titel: 'Are there ads on TrimmoTrade?',
      gruppe: 'Plans',
      fragen: ['are there ads', 'turn off ads', 'ads are annoying', 'do you get my data',
        'how is this financed'],
      schlag: ['ad', 'ads', 'advert', 'banner', 'tracking', 'marketing', 'free', 'financed'],
      antwort: '<b>No.</b> No advertising is shown – neither our own nor anyone else\'s. No ad network is '
        + 'embedded, and there is nothing that could be switched on: the application contains no code that '
        + 'could serve ads at all.\n\n'
        + 'The free plan is carried by the people who take Plus or promote a listing. Someone looking for an '
        + 'apartment often has little money right then – putting a paywall in front of the search at exactly '
        + 'that moment would be wrong. So everything that protects you or has to be calculated stays free.\n\n'
        + 'No data about you is passed on either. All that is counted is how often a view was opened on a '
        + 'given day in total – no identifier, no address. That is why there is no consent banner: there is '
        + 'nothing to consent to.',
      ziele: [['See plans', 'plus'], ['Privacy policy', 'recht/datenschutz']]
    },
    {
      id: 'hervorheben',
      titel: 'My listing is barely being seen',
      gruppe: 'Advertising',
      fragen: ['promote listing', 'how do i get to the top', 'top ad', 'nobody is getting in touch'],
      schlag: ['promote', 'top', 'visible', 'push', 'boost', 'stand out', 'seen', 'highlight'],
      muster: [/(listing|ad|offer|apartment).{0,24}(to the top|higher|stand out|visible)/,
        /(to the top|higher up).{0,24}(get|move|push|put)/],
      antwort: () => {
        const preise = TT.plan.HERVORHEBUNG.map((x) => U.t(x.name) + ' ' + U.eur2(x.preis)).join(', ');
        return 'Three options, for a fee: ' + preise + '. '
          + Math.round(TT.plan.PLUS_RABATT * 100) + ' % cheaper with Plus.\n\n'
          + 'Worth knowing: promoted listings sit in their own block above the results, labelled as paid '
          + '– never among them. The order below does not shift.\n\n'
          + 'Before that, the obvious things pay off: add photos, check the price against the benchmark '
          + 'rent, and make the description specific. That often does more than any promotion.';
      },
      ziele: [['Your listings', 'inserieren'], ['Plans and prices', 'plus']]
    },

    /* ---------------- Applying ---------------- */
    {
      id: 'bewerben',
      titel: 'How do I apply for an apartment?',
      gruppe: 'Applying',
      fragen: ['how do i apply', 'write a covering letter', 'how do i contact the landlord'],
      schlag: ['apply', 'application', 'letter', 'contact', 'message', 'enquiry', 'enquire', 'write'],
      antwort: 'Every listing page has “Write” (for a purchase: “Enquire”). TrimmoTrade drafts a suggestion '
        + 'from the details in your profile – the title, location and move-in date of that listing are '
        + 'already in it. You can change the text before sending.\n\n'
        + 'The letter only promises what you actually have. A covering letter that offers documents that '
        + 'do not exist comes apart at the viewing at the latest.',
      ziele: [['Fill in your profile', 'profil'], ['To the search', 'suche']]
    },
    {
      id: 'unterlagen',
      titel: 'Which documents do I need?',
      gruppe: 'Applying',
      fragen: ['which documents', 'what do i have to send', 'is a schufa report needed', 'self-disclosure'],
      schlag: ['document', 'documents', 'schufa', 'disclosure', 'payslip', 'proof', 'papers',
        'id', 'guarantee', 'credit'],
      antwort: 'The usual set is a tenant self-disclosure form, your last three payslips, a certificate '
        + 'of no rent arrears and – only later – a Schufa credit report.\n\n'
        + 'The order matters more than completeness: <b>a Schufa report and a copy of your ID do not '
        + 'belong in the first enquiry.</b> Only once the apartment is seriously in play, that is, after '
        + 'the viewing. Bank statements are not proof of income – they show every expense in your life.\n\n'
        + 'Questions about family planning, religion, origin, party membership or criminal record are not '
        + 'permitted and may be answered untruthfully.',
      ziele: [['Application folder in your profile', 'profil'], ['Document vault', 'tresor']]
    },
    {
      id: 'fragen-vermieter',
      titel: 'What may a landlord ask?',
      gruppe: 'Applying',
      fragen: ['may they ask about religion', 'unlawful questions self-disclosure',
        'do i have to say if i want children', 'may they ask about criminal record', 'pregnancy'],
      schlag: ['religion', 'family planning', 'children', 'pregnant', 'criminal', 'origin',
        'party', 'union', 'unlawful', 'allowed', 'illness', 'discriminat'],
      muster: [/(may|can) (they|he|she|the landlord|a landlord).{0,30}ask/],
      antwort: 'Permitted is whatever is relevant to the tenancy: your name, the number of people moving '
        + 'in, your occupation, secured income and whether you have rent arrears.\n\n'
        + '<b>Not permitted are questions about</b> family planning and pregnancy, religion, origin and '
        + 'nationality, party or union membership, illnesses, and – with few exceptions – criminal '
        + 'convictions. Such questions <b>may be answered untruthfully</b> without the tenancy agreement '
        + 'becoming challengeable or terminable as a result.\n\n'
        + 'Even the income question has limits: bank statements are not proof of income, and a Schufa '
        + 'report does not belong in a first enquiry.\n\n'
        + 'If something like that is in the listing itself and filters by origin, gender, disability or '
        + 'age, it breaches the German Equal Treatment Act (AGG) and can be reported.',
      ziele: [['Report content', 'recht/melden'], ['Application folder in your profile', 'profil']]
    },
    {
      id: 'tresor',
      titel: 'What is the document vault?',
      gruppe: 'Privacy',
      fragen: ['document vault', 'send documents securely', 'upload encrypted',
        'forgot vault password'],
      schlag: ['vault', 'encrypt', 'share', 'link', 'secure'],
      muster: [/(vault|document|papers).{0,24}(password|encrypt|share)/,
        /(password|passphrase).{0,24}(vault|document)/],
      antwort: 'You store your documents once, encrypted, and when you apply you send not an attachment '
        + 'but a link that expires after a set period and number of accesses – and which you can revoke '
        + 'at any time.\n\n'
        + 'Encryption happens in the browser with AES-GCM and 256 bits; the key is derived from your '
        + 'password and is stored nowhere. The file name is encrypted too.\n\n'
        + '<b>The password cannot be reset.</b> There is no server that knows it. If you forget it, all '
        + 'that remains is to empty the vault and fill it again.',
      ziele: [['To the document vault', 'tresor']]
    },
    {
      id: 'chancen',
      titel: 'I keep getting rejected',
      gruppe: 'Applying',
      fragen: ['only rejections', 'no reply', 'how do i improve my chances', 'nobody replies'],
      schlag: ['reject', 'rejection', 'reply', 'chance', 'chances', 'unsuccessful', 'ignore', 'hopeless'],
      antwort: 'Every listing page carries an honest estimate: how many interested parties there are, how '
        + 'quickly the advertiser replies and how your details stand against that. It is deliberately not '
        + 'flattering.\n\nWhat measurably helps: being fast (a saved search with instant alerts), having '
        + 'a complete application folder, a covering letter that visibly fits this particular apartment – '
        + 'and a realistic budget. If your search lets almost nothing through, TrimmoTrade shows below the '
        + 'results which relaxation brings how many additional apartments.',
      ziele: [['Create a saved search', 'agenten'], ['What can I afford?', 'leistbarkeit']]
    },

    /* ---------------- Search ---------------- */
    {
      id: 'sortierung',
      titel: 'How is the result order decided?',
      gruppe: 'Search',
      fragen: ['how is it sorted', 'why is that at the top', 'ranking', 'can you buy your way to the top'],
      schlag: ['sort', 'sorting', 'order', 'ranking', 'top', 'match', 'algorithm'],
      antwort: 'From your profile, and the score shows why: under every result it says which criteria fed '
        + 'in and with what share. You can change the weighting in your profile yourself – after which '
        + 'the order changes.\n\n'
        + 'Paid placements exist separately from that: they sit above the list, carry the heading '
        + '“Top ads” and move nothing in the list below.',
      ziele: [['Weighting in your profile', 'profil'], ['To the search', 'suche']]
    },
    {
      id: 'suchauftrag',
      titel: 'How do I create a saved search?',
      gruppe: 'Search',
      fragen: ['saved search', 'alerts for new apartments', 'set up an alert', 'notification'],
      schlag: ['saved search', 'alert', 'notify', 'notification', 'agent', 'inform'],
      antwort: () => 'Set your filters in the search, then save them under “Saved searches”. New results '
        + 'are marked as soon as they appear.\n\nThe free plan allows '
        + TT.plan.GRENZEN.frei.suchauftraege + ' saved search, Plus as many as you like. Anyone searching '
        + 'in several cities or price brackets notices the difference fastest.',
      ziele: [['Saved searches', 'agenten'], ['To the search', 'suche']]
    },
    {
      id: 'ringtausch',
      titel: 'What is a swap chain?',
      gruppe: 'Search',
      fragen: ['swap chain', 'apartment swap', 'how does swapping work', 'three-way swap'],
      schlag: ['swap', 'chain', 'exchange', 'three-way', 'four-way', 'circle'],
      antwort: 'In a direct swap two people have to want exactly the opposite of each other – which '
        + 'almost never happens. In a chain it is enough that each person wants the next one’s apartment: '
        + 'Anna moves into Ben’s place, Ben into Carla’s, Carla into Anna’s.\n\n'
        + 'TrimmoTrade searches every offer automatically for such closed chains. The “Swap chains” page '
        + 'explains it in four pictures.\n\n'
        + 'Legally it is not a swap but a new tenancy agreement for each apartment – old terms do not '
        + 'carry over, and every landlord has to agree.',
      ziele: [['See swap chains', 'tausch']]
    },
    {
      id: 'wg-gruenden',
      titel: 'Renting a flat together with strangers',
      gruppe: 'Searching',
      fragen: ['start a flatshare', 'rent together', 'flat with strangers', 'find flatmates',
        'apply together', 'share a big flat'],
      schlag: ['flatshare', 'together', 'flatmate', 'share', 'group', 'three of us', 'two of us'],
      antwort: 'A flat with three or more rooms is too big for one person and too expensive for many '
        + 'families – but easily affordable for three people together. If the advertiser has released '
        + 'a flat for this, the listing page shows the block “Released for founding a flatshare”. '
        + 'There you open a group or join one.\n\nWhoever founds decides who joins. Until then the '
        + 'other members do not see a request, and email addresses only become visible once both '
        + 'sides have accepted each other. Once the group is full it applies as a single application – '
        + 'for the landlord that is one complete household instead of three individuals.'
        + '\n\nBefore you commit: with a joint tenancy agreement you are jointly and severally liable '
        + '(§ 421 BGB) – if one person does not pay, the full rent can be demanded from any single one. '
        + 'The deposit is capped at three months’ net rent for the whole flat, not per person '
        + '(§ 551 Abs. 1 BGB). And moving out alone is not a notice: replacing one person needs the '
        + 'agreement of everybody and of the landlord.',
      ziele: [['Start a flatshare', 'wg'], ['Flats released for it', 'suche?wg=1']]
    },
    {
      id: 'inserieren',
      titel: 'How do I post a listing?',
      gruppe: 'Advertising',
      fragen: ['post a listing', 'offer an apartment', 'sell a house', 'advertise a plot',
        'how do i upload photos'],
      schlag: ['post', 'listing', 'advertise', 'offer', 'sell', 'let', 'rent out', 'plot', 'photo', 'image'],
      antwort: 'Under “Post a listing”, with six offer types: let an apartment, a flatshare room, swap an '
        + 'apartment, sell an apartment, sell a house, sell a plot. Which fields appear depends on the '
        + 'type.\n\nPhotos can be uploaded directly in the form, up to ten of them. They are scaled down '
        + 'in the browser and stay on your device. The first image is the cover image.\n\n'
        + 'What does not belong in a listing photo: people without their consent, number plates, name '
        + 'tags on the doorbell or letterbox. Interiors of an occupied apartment only with the tenant’s '
        + 'consent.',
      ziele: [['Post a listing', 'inserieren']]
    },

    /* ---------------- Law and protection ---------------- */
    {
      id: 'betrug',
      titel: 'Is this listing genuine?',
      gruppe: 'Protection',
      fragen: ['fraud', 'is this a fake', 'payment up front', 'landlord abroad', 'deposit in advance'],
      schlag: ['fraud', 'scam', 'fake', 'forged', 'advance', 'upfront', 'dodgy', 'suspicious', 'genuine'],
      muster: [/(deposit|money|payment|fee).{0,30}(in advance|up front|beforehand|without a viewing)/,
        /(in advance|up front|beforehand).{0,30}(pay|transfer|send)/,
        /(without|no) viewing/, /(abroad|western union)/],
      antwort: 'TrimmoTrade flags the usual patterns by itself: a conspicuously low price, a provider '
        + 'supposedly abroad, no viewing possible, payment before handover.\n\n'
        + '<b>The most important rule: nothing is paid before the viewing.</b> No deposit, no '
        + '“reservation fee”, no keys sent against advance payment. Anyone demanding that is defrauding '
        + 'you – without exception.\n\nEqually, a Schufa report, a copy of your ID or bank statements do '
        + 'not belong in a first enquiry.\n\n'
        + 'This check is included in the free plan and will stay that way. Putting fraud protection '
        + 'behind a paywall would be cynical.',
      ziele: [['Report content', 'recht/melden'], ['To the search', 'suche']]
    },
    {
      id: 'mietpreisbremse',
      titel: 'Is the rent too high?',
      gruppe: 'Protection',
      fragen: ['rent cap', 'too expensive', 'benchmark rent', 'is the rent lawful'],
      schlag: ['rent cap', 'mietpreisbremse', 'benchmark', 'mietspiegel', 'overpriced', 'lawful', 'excessive'],
      antwort: 'Every listing is set against the local benchmark rent (ortsübliche Vergleichsmiete), with '
        + 'the gap in per cent.\n\n'
        + 'In areas with a strained housing market the rent on a new tenancy may be at most 10 % above '
        + 'the local benchmark. TrimmoTrade shows where that might apply and how much would then be lawful. '
        + 'Exceptions apply among other things to new buildings from 2014 onwards and comprehensively '
        + 'modernised apartments; the landlord has to disclose that before the contract is signed.\n\n'
        + 'The benchmark in this demo is a computed figure, not an official rent index.',
      ziele: [['To the search', 'suche'], ['Check service charges', 'nebenkosten']]
    },
    {
      id: 'datenschutz',
      titel: 'What happens to my data?',
      gruppe: 'Privacy',
      fragen: ['privacy', 'is my data stored', 'gdpr', 'delete my data'],
      schlag: ['privacy', 'data', 'gdpr', 'dsgvo', 'store', 'delete', 'private', 'cookie'],
      antwort: 'TrimmoTrade computes entirely in your browser. Your profile, saved list, saved searches, '
        + 'messages and your own listings live in this device’s storage and do not leave it. There is no '
        + 'user account and no transfer to third parties.\n\n'
        + 'No analytics tools are used and no profiles are built about your behaviour. That is why no '
        + 'consent banner appears either.\n\n'
        + 'Under “My data” in the footer you can save everything as a file or delete it completely.',
      ziele: [['Privacy policy', 'recht/datenschutz'], ['Legal notice', 'recht/impressum']]
    },
    {
      id: 'kaution',
      titel: 'How high may the deposit be?',
      gruppe: 'Protection',
      fragen: ['deposit amount', 'three months rent', 'deposit in instalments', 'deposit back'],
      schlag: ['deposit', 'security', 'kaution', 'instalment', 'months rent'],
      antwort: 'At most <b>three months’ base rent</b> (§ 551 BGB). Anything above that is void – even if '
        + 'it is in the contract.\n\n'
        + 'You may pay in three equal monthly instalments; the first falls due when the tenancy starts. '
        + 'The landlord has to hold the deposit separately from their own assets and bearing interest.\n\n'
        + 'You get it back after the tenancy ends, once no claims remain open. A partial amount may be '
        + 'withheld for a limited time against the service-charge statement still to come.',
      ziele: [['Handover report', 'uebergabe'], ['Check service charges', 'nebenkosten']]
    },
    {
      id: 'wbs',
      titel: 'Do I need a housing entitlement certificate?',
      gruppe: 'Calculating',
      fragen: ['wbs', 'housing entitlement certificate', 'subsidised apartment', 'social housing'],
      schlag: ['wbs', 'entitlement', 'subsidised', 'social housing', 'income limit'],
      antwort: 'For subsidised apartments, yes. The calculator under “Tools” works out your relevant '
        + 'annual income with all the flat-rate deductions and sets it against the income limit – which '
        + 'you can set yourself, because every federal state has a different one.\n\n'
        + 'You apply for the certificate at your municipality’s housing office, usually for a small fee, '
        + 'and it is normally valid for a year.',
      ziele: [['Calculate WBS', 'wbs'], ['Check housing benefit', 'wohngeld']]
    },
    {
      id: 'nebenkosten',
      titel: 'My service-charge statement looks wrong',
      gruppe: 'Calculating',
      fragen: ['check service charges', 'operating costs', 'additional payment too high', 'statement wrong'],
      schlag: ['service charge', 'operating cost', 'statement', 'additional payment', 'heating cost', 'utilities'],
      antwort: 'The checker under “Tools” goes through the usual errors: which items may be passed on at '
        + 'all, whether the statement arrived in time, whether the heating costs were split correctly.\n\n'
        + 'Two deadlines are decisive: the statement has to reach you <b>within twelve months</b> of the '
        + 'end of the billing period, otherwise additional demands are excluded (§ 556 BGB). You can '
        + 'object within twelve months of receipt.\n\n'
        + 'Administration costs and maintenance may not be passed on – they still turn up often enough.',
      ziele: [['Check service charges', 'nebenkosten']]
    },

    /* ---------------- The app ---------------- */
    {
      id: 'konto',
      titel: 'How do I sign in?',
      gruppe: 'The app',
      fragen: ['register', 'create an account', 'sign in', 'forgot password', 'login',
        'what is a passkey', 'sign in with google'],
      schlag: ['account', 'password', 'sign in', 'signin', 'login', 'register', 'passkey', 'access'],
      muster: [/(password|passkey|access).{0,20}(forgot|lost|reset|change)/],
      antwort: 'Through one of the four routes on the start page: <b>a passkey</b> (Face ID, Windows '
        + 'Hello or a fingerprint), Google, Microsoft – or with your email address and a one-time '
        + 'code.\n\n'
        + 'None of the routes involves a password. With a passkey the key is created in your device’s '
        + 'security chip and never leaves it; on the email route you get a code valid for ten minutes. '
        + 'So there is nothing to forget and nothing anyone could phish.\n\n'
        + 'If you forget which route you used: the email route always works, as long as you can read the '
        + 'address.',
      ziele: [['See your account', 'konto'], ['Fill in your profile', 'profil']]
    },
    {
      id: 'stufen',
      titel: 'What does the trust level mean?',
      gruppe: 'Protection',
      fragen: ['trust level', 'what does provider unverified mean', 'id verified',
        'how do i raise my level'],
      schlag: ['trust', 'level', 'unverified', 'verified', 'verify', 'identity'],
      antwort: 'Five levels, 0 to 4: nothing verified, email verified, device or provider account '
        + 'verified, phone number verified, ID checked.\n\n'
        + 'It appears on every listing, because that is where it is useful: an account at level 0 or 1 is '
        + 'created in minutes – and recreated just as fast after a ban. That does not mean something is '
        + 'wrong; it means the usual rules apply with particular force.\n\n'
        + 'You raise your own level under “Account”: adding a passkey gets you to level 2, a verified '
        + 'phone number to level 3, an ID check to level 4. <b>You do not need a high level to search</b> '
        + '– it counts above all when you advertise yourself.',
      ziele: [['To your account', 'konto'], ['Report content', 'recht/melden']]
    },
    {
      id: 'daten-weg',
      titel: 'My data has disappeared',
      gruppe: 'The app',
      fragen: ['data gone', 'saved list empty', 'everything disappeared', 'different device'],
      schlag: ['gone', 'disappeared', 'lost', 'empty', 'device', 'restore', 'backup'],
      antwort: 'Everything lives in this browser’s storage – the sign-in included. It disappears when '
        + 'browser data is cleared, in private mode when the window closes – and on another device or in '
        + 'another browser it was never there in the first place. There you sign in afresh; your saved '
        + 'list and profile do not travel with you.\n\n'
        + 'You can guard against that under “My data” in the footer: save the current state as a file.\n\n'
        + 'The document vault sits separately from that and is deliberately not included – exporting '
        + 'encrypted files into a plain-text file would be the opposite of what it is for.',
      ziele: [['Privacy policy', 'recht/datenschutz']]
    },
    {
      id: 'melden',
      titel: 'I want to report a listing',
      gruppe: 'Protection',
      fragen: ['report a listing', 'complaint', 'unlawful', 'discrimination in a listing'],
      schlag: ['report', 'complain', 'complaint', 'unlawful', 'discriminat', 'breach', 'flag'],
      antwort: 'Through the reporting route under “Legal”. You can report invented listings, demands for '
        + 'payment before the viewing, offers made without the right to dispose of the property, and '
        + 'wording that filters by origin, religion, gender, disability or age.\n\n'
        + 'Receipt is confirmed, and a reasoned notice is issued about the decision.',
      ziele: [['Report content', 'recht/melden']]
    }
  ];

  TT.hilfe.themenEintragen('en', THEMEN_EN);
})(window.TT = window.TT || {});
