export type GuideSection = { heading: string; body: string[]; table?: { head: string[]; rows: string[][] } }
export type Guide = {
  slug: string
  title: string            // <title> + H1
  metaTitle: string        // SERP title (≤60 chars ideal)
  description: string      // meta description (≤155 chars)
  answer: string           // 2–3 sentence direct answer (GEO lead)
  updated: string          // ISO date
  sections: GuideSection[]
  faqs: { q: string; a: string }[]
  related: { label: string; href: string }[]  // deep links to products/pages
}

const UPDATED = '2026-06-18'

export const GUIDES: Guide[] = [
  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'is-bitcoin-mining-profitable-in-india-2026',
    title: 'Is Bitcoin mining profitable in India in 2026?',
    metaTitle: 'Is Bitcoin Mining Profitable in India 2026?',
    description:
      'A straight, dated answer: Bitcoin mining in India in 2026 is profitable only with an efficient miner and cheap power. Full worked example with real numbers.',
    answer:
      'As of June 2026, Bitcoin mining in India is profitable only if you run an efficient, current-generation miner (Antminer S21 class, ~15–18 J/TH) on electricity at roughly ₹7/kWh or less. Older S19-class rigs are at or below break-even at typical Indian commercial tariffs of ₹8–₹12 per unit. Profitability swings with the BTC price, network difficulty and your electricity rate, so always run the maths for your own tariff before buying.',
    updated: UPDATED,
    sections: [
      {
        heading: 'The short verdict',
        body: [
          'Mining is not "free money" in India in 2026 — margins are thin. After a roughly 15% Bitcoin price slide and a 10% downward difficulty adjustment in June 2026, hashprice (revenue per unit of hashrate) sits near $0.033 per TH/s per day. At an exchange rate of about ₹94.5 to the dollar, that is roughly ₹3.1 of gross revenue per TH/s per day.',
          'Whether you make money comes down to two levers you control at purchase: the efficiency of the miner (joules per terahash) and the price you pay for electricity. Get both right and you run a positive margin; get either wrong and you pay to mine.',
        ],
      },
      {
        heading: 'How Bitcoin mining profit is actually calculated',
        body: [
          'Daily profit = (hashrate × hashprice) − (power in kW × 24 hours × your ₹/kWh). Hashprice already bakes in the BTC price and network difficulty, so you only need three numbers: your machine’s hashrate, its power draw, and your electricity tariff.',
          'Note that hashprice changes daily and electricity in India is billed in slabs that vary by state and DISCOM. Treat every figure below as a dated estimate for June 2026, not a guarantee.',
        ],
      },
      {
        heading: 'Worked example at ₹8/kWh (June 2026)',
        body: [
          'Here is the same calculation for two real machines at a commercial tariff of ₹8 per unit, using a hashprice of ₹3.1 per TH/s per day. An efficient S21-class miner clears break-even; an older S19-class miner does not.',
        ],
        table: {
          head: ['Miner', 'Hashrate', 'Power', 'Gross/day', 'Power cost/day', 'Net/day'],
          rows: [
            ['Antminer S21 XP (270T)', '270 TH/s', '3500W', '₹837', '₹672', '≈ +₹165'],
            ['Antminer S19 K Pro', '120 TH/s', '3010W', '₹372', '₹578', '≈ −₹206'],
          ],
        },
      },
      {
        heading: 'What changes the maths',
        body: [
          'BTC price: revenue scales directly with it. A 20% price rise turns thin margins into healthy ones; a fall does the reverse.',
          'Network difficulty: as more miners join worldwide, each machine earns less. The 2024 halving and rising global hashrate are the long-term headwind.',
          'Electricity rate: the single biggest lever you control in India. Dropping from ₹10 to ₹6 per unit can be the difference between loss and profit. See our state-by-state electricity guide.',
          'Machine efficiency: a 15 J/TH miner produces far more profit per rupee of power than a 30 J/TH one. This is why new buyers should rarely buy old hardware.',
        ],
      },
      {
        heading: 'How to make mining profitable in India',
        body: [
          'Buy efficient: choose a current-generation S21-class SHA-256 miner rather than a discounted older unit, unless your power is genuinely very cheap.',
          'Secure cheap power: industrial/solar/captive power at ₹5–₹7 per unit transforms the economics. Many profitable Indian miners run on commercial-industrial connections or rooftop solar.',
          'Run the calculator with your real tariff and current BTC price before committing. Our profitability calculator does this for the machines we sell.',
        ],
      },
    ],
    faqs: [
      { q: 'Is Bitcoin mining legal in India?', a: 'Yes. Owning and operating mining hardware is legal in India. Crypto gains are taxed (a 30% tax on virtual digital asset income plus applicable TDS), so keep records and consult a tax professional.' },
      { q: 'How much can I earn mining Bitcoin in India?', a: 'As of June 2026, an efficient S21-class miner on ₹8/kWh power nets very roughly ₹4,000–₹6,000 per month per machine before depreciation. This changes daily with BTC price and difficulty.' },
      { q: 'What electricity rate do I need to mine profitably?', a: 'Broadly, ₹7 per unit or lower for current efficient miners. Above ₹10–₹12 per unit, only the most efficient hardware breaks even, and older miners run at a loss.' },
      { q: 'Is cloud mining a safer option?', a: 'Most "cloud mining" offers in India are high-risk or outright scams with no hardware behind them. Owning a real miner with a GST invoice and local warranty is the transparent route.' },
    ],
    related: [
      { label: 'Profitability calculator', href: '/profitability' },
      { label: 'ASIC miner electricity cost in India — by state', href: '/learn/asic-miner-electricity-cost-india-by-state' },
      { label: 'Best Bitcoin miners to buy in India (2026)', href: '/learn/best-bitcoin-miners-to-buy-in-india-2026' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'antminer-s19-vs-s21-vs-s21-pro',
    title: 'Antminer S19 XP vs S21 vs S21 Pro — full comparison',
    metaTitle: 'Antminer S19 XP vs S21 vs S21 Pro (2026)',
    description:
      'Side-by-side comparison of the Antminer S19 XP, S21 and S21 Pro: hashrate, power, efficiency and which one to buy in India in 2026.',
    answer:
      'For a new buyer in India in 2026, the Antminer S21 Pro is the best all-round SHA-256 miner — about 234 TH/s at ~15 J/TH, the strongest efficiency-to-price balance of the three. The S21 is the value pick, and the older S19 XP only makes sense if you find it heavily discounted and have cheap power. Efficiency (J/TH), not headline hashrate, decides long-term profit.',
    updated: UPDATED,
    sections: [
      {
        heading: 'Quick pick',
        body: [
          'Best overall: Antminer S21 Pro — best efficiency for the price, the safest 2026 buy.',
          'Best value: Antminer S21 — lower upfront cost, still efficient enough to profit at typical Indian tariffs.',
          'Only if discounted: Antminer S19 XP — last-generation; buy only with very cheap power or a steep discount.',
        ],
      },
      {
        heading: 'Specifications compared',
        body: [
          'These are the manufacturer reference specs for the air-cooled models. Efficiency (joules per terahash) is the number that matters most for running cost.',
        ],
        table: {
          head: ['Model', 'Hashrate', 'Power', 'Efficiency', 'Generation'],
          rows: [
            ['Antminer S19 XP', '140 TH/s', '3010W', '21.5 J/TH', '2022'],
            ['Antminer S21', '200 TH/s', '3500W', '17.5 J/TH', '2024'],
            ['Antminer S21 Pro', '234 TH/s', '3531W', '15.1 J/TH', '2024'],
          ],
        },
      },
      {
        heading: 'Efficiency vs upfront cost',
        body: [
          'The S19 XP is cheaper to buy but burns roughly 40% more power per terahash than the S21 Pro. Over a year of 24/7 running, that extra power cost usually dwarfs the upfront saving.',
          'Rule of thumb: the more expensive your electricity, the more it pays to buy the most efficient machine. With very cheap power (≤₹5/kWh), an older discounted miner can still make sense.',
        ],
      },
      {
        heading: 'Which to buy at your electricity rate',
        body: [
          'Up to ₹6/kWh: any of the three can profit; pick on budget. Even the S19 XP works.',
          '₹6–₹9/kWh: choose the S21 or S21 Pro. Avoid the S19 XP unless deeply discounted.',
          'Above ₹9/kWh: only the S21 Pro (or newer S21 XP) reliably clears break-even at June 2026 hashprice.',
        ],
      },
      {
        heading: 'The verdict',
        body: [
          'For most Indian buyers in 2026, the S21 Pro is the machine to own — it has the best margin per rupee of electricity and the longest useful life before difficulty erodes its profit. Step down to the S21 to save on upfront cost. Treat the S19 XP as a budget/clearance option only.',
        ],
      },
    ],
    faqs: [
      { q: 'Is the S21 Pro worth the extra money over the S21?', a: 'Usually yes if you run 24/7 on paid electricity — its better efficiency (≈15 vs 17.5 J/TH) lowers your largest ongoing cost and shortens payback.' },
      { q: 'Is the Antminer S19 XP still worth buying in 2026?', a: 'Only at a steep discount and with cheap power. At typical Indian commercial tariffs it sits near or below break-even at current hashprice.' },
      { q: 'Which Antminer is most efficient?', a: 'Of these three, the S21 Pro at about 15.1 J/TH. Newer hydro and S21 XP variants push efficiency even lower.' },
      { q: 'Do you sell these with warranty in India?', a: 'Yes — genuine units with a 12-month local RMA warranty, GST invoice and pan-India shipping from our Delhi facility.' },
    ],
    related: [
      { label: 'Buy Antminer S21 Pro (234T)', href: '/shop/antminer-s21-pro-234t' },
      { label: 'Buy Antminer S21 XP (270T)', href: '/shop/antminer-s21-xp-270t' },
      { label: 'Is Bitcoin mining profitable in India in 2026?', href: '/learn/is-bitcoin-mining-profitable-in-india-2026' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'asic-miner-electricity-cost-india-by-state',
    title: 'ASIC miner electricity cost in India — ₹/kWh by state',
    metaTitle: 'ASIC Miner Electricity Cost in India by State',
    description:
      'How much it costs to run an ASIC miner in India in 2026, with approximate commercial ₹/kWh by state and monthly running cost for a 3kW miner.',
    answer:
      'Running a single 3,000W ASIC miner 24/7 in India consumes about 2,160 units (kWh) a month. At commercial tariffs of roughly ₹8–₹12 per unit across most states, that is about ₹17,000–₹26,000 per month in electricity per machine. Your exact rate depends on your state, DISCOM, slab and connection type, so always confirm against your own bill.',
    updated: UPDATED,
    sections: [
      {
        heading: 'How much power does a miner use?',
        body: [
          'A typical SHA-256 ASIC draws about 3,000–3,500W. Running non-stop, a 3kW machine uses 3 × 24 = 72 units a day, or roughly 2,160 units a month. Hydro/immersion models can draw 4,500–5,000W and cost proportionally more.',
          'Electricity is almost always the largest ongoing cost of mining — typically far more than the hardware over its life — which is why your ₹/kWh decides whether you profit.',
        ],
      },
      {
        heading: 'Approximate commercial rates and monthly cost by state',
        body: [
          'The table below shows indicative commercial ₹/kWh and the resulting monthly cost for one 3kW miner (2,160 units). These are dated estimates for 2026 — commercial tariffs vary widely by DISCOM, slab, load factor, fixed charges and electricity duty.',
        ],
        table: {
          head: ['State', 'Approx. commercial ₹/kWh', 'Monthly cost (3kW, 24/7)'],
          rows: [
            ['Gujarat', '₹6–₹8', '₹13,000–₹17,300'],
            ['Rajasthan', '₹7–₹9', '₹15,100–₹19,400'],
            ['Punjab', '₹7–₹8', '₹15,100–₹17,300'],
            ['Delhi', '₹8–₹10', '₹17,300–₹21,600'],
            ['Karnataka', '₹8–₹9', '₹17,300–₹19,400'],
            ['Uttar Pradesh', '₹8–₹10', '₹17,300–₹21,600'],
            ['Tamil Nadu', '₹8–₹10', '₹17,300–₹21,600'],
            ['Maharashtra', '₹9–₹12', '₹19,400–₹25,900'],
            ['Telangana', '₹9–₹11', '₹19,400–₹23,800'],
          ],
        },
      },
      {
        heading: 'How to cut your electricity cost',
        body: [
          'Solar: rooftop or captive solar can push your effective rate to ₹3–₹5 per unit and is the single biggest profitability upgrade for Indian miners.',
          'Connection type: industrial and HT connections are often cheaper per unit than small commercial connections — worth checking with your DISCOM.',
          'Off-peak / open access: large setups may access cheaper open-access or time-of-day power. For home miners, the practical lever is solar plus an efficient machine.',
        ],
      },
      {
        heading: 'Putting it together',
        body: [
          'Pair your monthly electricity cost from the table with the revenue your miner produces (see our profitability guide). At June 2026 hashprice, an efficient S21-class miner roughly covers its power at ₹8/kWh and profits below that; older miners need cheaper power to break even.',
        ],
      },
    ],
    faqs: [
      { q: 'How many units does an ASIC miner use per month?', a: 'A 3,000W miner running 24/7 uses about 2,160 units (kWh) per month. A 5,000W hydro model uses around 3,600 units.' },
      { q: 'Which Indian state has the cheapest electricity for mining?', a: 'Industrial/commercial power tends to be cheaper in states like Gujarat, Punjab and Rajasthan, but the cheapest real-world option for most miners is rooftop or captive solar.' },
      { q: 'Do mining rigs need a special electricity connection?', a: 'A single home miner runs on a dedicated 15–20A, 220–240V circuit. Multiple machines need a commercial/industrial connection sized to the total load — plan this before buying.' },
      { q: 'Are these tariff figures exact?', a: 'No — they are 2026 estimates. Commercial tariffs change with each SERC tariff order and vary by DISCOM, slab and fixed charges. Always verify on your own electricity bill.' },
    ],
    related: [
      { label: 'Profitability calculator', href: '/profitability' },
      { label: 'Is Bitcoin mining profitable in India in 2026?', href: '/learn/is-bitcoin-mining-profitable-in-india-2026' },
      { label: 'How to set up an ASIC miner at home in India', href: '/learn/how-to-set-up-asic-miner-at-home-india' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'how-to-set-up-asic-miner-at-home-india',
    title: 'How to set up an ASIC miner at home in India',
    metaTitle: 'How to Set Up an ASIC Miner at Home in India',
    description:
      'Step-by-step guide to setting up an ASIC Bitcoin miner at home in India: power, cooling, network, first boot and pointing it at a mining pool.',
    answer:
      'To run an ASIC miner at home in India you need a dedicated 220–240V power circuit rated for the machine’s load, a way to manage heat and ~75 dB of noise, and a wired internet connection. After mounting and powering the unit, you access its web dashboard on your local network, point it at a mining pool with your wallet/worker details, and monitor temperature and hashrate. Most homes can run one machine; multiple miners need a commercial connection and proper ventilation.',
    updated: UPDATED,
    sections: [
      {
        heading: 'What you need before you start',
        body: [
          'Power: a dedicated 220–240V circuit on a 15–20A point for a single ~3kW machine. Do not share the circuit with other heavy appliances.',
          'Cooling and space: ASICs push a lot of hot air. You need an exhaust path (window/duct) and intake of cooler air. A small room with cross-ventilation or a balcony enclosure works for one unit.',
          'Noise control: air-cooled miners run around 75 dB — loud. Plan for a utility area, garage or a silencer/immersion option if living space is nearby.',
          'Network: a wired Ethernet connection to your router is strongly preferred over Wi‑Fi for stability.',
        ],
      },
      {
        heading: 'Electrical requirements',
        body: [
          'Confirm your machine’s plug/inlet (commonly a C19/C20 IEC connector) and use a correctly rated cable. A 3,000W miner draws around 13–14A at 230V, so the circuit, MCB and wiring must be sized for continuous load.',
          'If you are running more than one machine, total the wattage and have a licensed electrician provision a suitable commercial/industrial connection and distribution. Never daisy-chain miners off a domestic socket.',
        ],
      },
      {
        heading: 'Step-by-step first boot',
        body: [
          '1. Place the miner on a stable surface with clear airflow; connect the Ethernet cable to your router.',
          '2. Connect the power cable and switch on. The fans will spin up loudly — this is normal.',
          '3. Find the miner’s IP address from your router’s connected-devices list (or the manufacturer’s IP scanner tool).',
          '4. Open that IP in a browser and log into the miner’s dashboard (default credentials are in the manual — change them immediately).',
        ],
      },
      {
        heading: 'Pointing it at a mining pool',
        body: [
          'In the dashboard’s Pool/Miner Configuration, enter your chosen pool’s stratum URL, your worker name (usually yourname.worker1) and password (often "x").',
          'Use a reputable pool and your own payout wallet address. Save, let the miner restart, and within a few minutes you should see accepted shares and a stable hashrate.',
          'Monitor chip temperatures and hashrate for the first few hours. Sustained high temperatures mean you need better airflow or a cooler location.',
        ],
      },
      {
        heading: 'Noise, heat and when to use hosting',
        body: [
          'Many Indian homes cannot comfortably absorb the noise and heat of a 24/7 ASIC. Options: a silencer box, a hydro/immersion model, or hosting/co-location where a facility runs the machine for a monthly fee.',
          'If you want the returns without the noise, ask us about setup support and hosting options — we help buyers get configured and running.',
        ],
      },
    ],
    faqs: [
      { q: 'Can I run an ASIC miner in a normal Indian home?', a: 'One machine, yes — on a dedicated 220–240V circuit with good ventilation and noise management. Multiple machines need a commercial connection and a proper room or hosting.' },
      { q: 'How loud is an ASIC miner?', a: 'Air-cooled models run around 75 dB — similar to a loud vacuum cleaner, continuously. A silencer enclosure or a hydro model greatly reduces this.' },
      { q: 'Do you help with installation?', a: 'Yes. We provide on-site setup guidance, configuration support, and can advise on hosting if you cannot run the miner at home.' },
      { q: 'What internet speed do I need?', a: 'Very little — mining uses minimal bandwidth. A stable wired connection matters far more than speed.' },
    ],
    related: [
      { label: 'Request setup / service support', href: '/service-request' },
      { label: 'ASIC miner electricity cost in India — by state', href: '/learn/asic-miner-electricity-cost-india-by-state' },
      { label: 'Shop all miners', href: '/shop' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'best-bitcoin-miners-to-buy-in-india-2026',
    title: 'Best Bitcoin miners to buy in India (2026)',
    metaTitle: 'Best Bitcoin Miners to Buy in India (2026)',
    description:
      'The best ASIC Bitcoin miners to buy in India in 2026 by category — best overall, best value, best efficiency and best for cheap power — with prices.',
    answer:
      'In 2026, the best all-round Bitcoin miner to buy in India is the Antminer S21 Pro for its efficiency-to-price balance. For lower upfront cost the Antminer S21 is the value pick, hydro models like the S21e Hydro suit serious setups with cooling, and the Antminer S19 K Pro is the budget entry where power is cheap. All prices below are indicative and include GST invoice and 12-month local warranty.',
    updated: UPDATED,
    sections: [
      {
        heading: 'Best overall — Antminer S21 Pro',
        body: [
          'The S21 Pro (≈234 TH/s, ~15 J/TH) offers the strongest balance of efficiency, hashrate and price for an Indian buyer in 2026. It clears break-even at more electricity rates than any older model and has the longest useful life before difficulty erodes its margin.',
        ],
      },
      {
        heading: 'Best value — Antminer S21',
        body: [
          'The standard S21 keeps most of the efficiency advantage at a lower upfront price. If your budget is tighter but you still run on paid electricity, this is the sensible pick over any S19-class machine.',
        ],
      },
      {
        heading: 'Best for serious setups — S21e Hydro',
        body: [
          'Hydro/immersion models such as the S21e Hydro (≈310 TH/s) pack huge hashrate into one unit and run quieter, but need a cooling loop. They suit dedicated rooms, farms or hosted environments rather than a typical living room.',
        ],
      },
      {
        heading: 'Best budget / cheap-power pick — Antminer S19 K Pro',
        body: [
          'If you have genuinely cheap power (solar or ≤₹5/kWh), an efficient last-gen unit like the S19 K Pro lowers your entry cost. On expensive electricity, though, its higher J/TH eats the saving — buy efficient instead.',
        ],
      },
      {
        heading: 'Other algorithms — Kaspa and Litecoin/Dogecoin',
        body: [
          'Not everything is SHA-256 Bitcoin. The Antminer KS5 Pro mines Kaspa (kHeavyHash) and the Antminer L7/L9 mine Scrypt (Litecoin + merged Dogecoin). These can diversify a setup, but profitability depends on each coin’s price and difficulty — run the numbers before buying.',
        ],
      },
    ],
    faqs: [
      { q: 'What is the best Bitcoin miner for beginners in India?', a: 'The Antminer S21 (or S21 Pro) — efficient, well-supported, and easy to configure. Buy from a seller offering a GST invoice and local warranty.' },
      { q: 'Should I buy a used miner to save money?', a: 'Used miners carry no warranty and unknown wear. Genuine new units with a 12-month local RMA are far safer for the small price difference.' },
      { q: 'Are hydro miners better than air-cooled?', a: 'They offer more hashrate and lower noise but require a cooling loop and setup. They suit dedicated or hosted environments, not most homes.' },
      { q: 'Do you ship across India?', a: 'Yes — insured, tracked pan-India shipping from our Delhi facility, with GST invoice and 12-month warranty on every miner.' },
    ],
    related: [
      { label: 'Shop all miners', href: '/shop' },
      { label: 'Antminer S19 XP vs S21 vs S21 Pro', href: '/learn/antminer-s19-vs-s21-vs-s21-pro' },
      { label: 'Buy Antminer S21 Pro (234T)', href: '/shop/antminer-s21-pro-234t' },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────
  {
    slug: 'antminer-warranty-rma-india',
    title: 'Antminer warranty & RMA in India — what’s covered',
    metaTitle: 'Antminer Warranty & RMA in India — What’s Covered',
    description:
      'What an Antminer warranty covers in India, how local RMA works, what voids it, and why a 12-month India-handled warranty beats shipping units overseas.',
    answer:
      'A miner bought from us comes with a 12-month local RMA warranty handled entirely in India — faulty hardware is diagnosed, repaired or replaced from our Delhi service centre, with no need to ship units overseas. The warranty covers manufacturing and component defects under normal operation; it does not cover physical damage, water ingress on air-cooled units, unauthorised repairs or damage from improper power. Keep your GST invoice — it is your proof of cover.',
    updated: UPDATED,
    sections: [
      {
        heading: 'What the warranty covers',
        body: [
          'Manufacturing defects and hardware/component failures that occur under normal operating conditions within the 12-month period — for example hashboard or PSU faults that are not caused by misuse.',
          'Diagnosis and repair or replacement of the faulty part or unit, handled locally so you are not paying international freight or waiting months.',
        ],
      },
      {
        heading: 'What is not covered',
        body: [
          'Physical damage, liquid/water ingress on air-cooled machines, burn marks from incorrect voltage or unstable power, and damage from unauthorised opening or third-party repairs.',
          'Normal wear, consumables, and losses from downtime or changing mining profitability. Warranty covers the hardware, not your earnings.',
        ],
      },
      {
        heading: 'How to make an RMA claim',
        body: [
          '1. Contact us with your GST invoice and the miner’s serial number, and describe the fault (with the dashboard error or behaviour).',
          '2. We help you run basic diagnostics remotely first — many issues are configuration or power, not hardware.',
          '3. If it is a covered hardware fault, we arrange the return to our Delhi service centre, repair or replace the unit, and ship it back to you.',
        ],
      },
      {
        heading: 'Why local RMA beats an overseas warranty',
        body: [
          'Many cheap imports carry only a manufacturer warranty that requires shipping the unit abroad — costly, slow, and risky in transit. A warranty handled inside India means faster turnaround, no international freight, and a real point of contact who speaks your language.',
          'This is why buying from an India-based supplier with a GST invoice and local service is worth more than a marginally lower price from a grey-market seller.',
        ],
      },
    ],
    faqs: [
      { q: 'How long is the warranty on your miners?', a: '12 months from purchase, handled locally in India via our Delhi service centre.' },
      { q: 'Does the warranty cover the power supply (PSU)?', a: 'Yes — PSU and hashboard defects under normal operation are covered. Damage from incorrect voltage or unstable mains is not.' },
      { q: 'What voids the warranty?', a: 'Physical/liquid damage, unauthorised repairs, removing seals, and damage from improper power or environment.' },
      { q: 'Do I need the invoice to claim?', a: 'Yes. Keep your GST invoice and the serial number — they are your proof of purchase and warranty cover.' },
    ],
    related: [
      { label: 'Warranty details', href: '/warranty' },
      { label: 'Contact us / raise a request', href: '/contact' },
      { label: 'Shop all miners', href: '/shop' },
    ],
  },
]

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug)
export const allGuideSlugs = () => GUIDES.map((g) => g.slug)
