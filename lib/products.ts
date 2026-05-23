export interface Product {
  _id?: string
  slug: string
  algo: string
  stock?: 'In Stock' | 'Coming Soon' | 'Sold Out'
  computedStatus?: 'In Stock' | 'Sold Out' | 'Coming Soon'
  quantity?: number
  tag: string
  name: string
  shortName: string   // for editorial hero card (e.g. "S19")
  subName: string     // italic part (e.g. "XP")
  tagline: string
  hashrate: string
  hashrateNum: string
  hashrateUnit: string
  power: string
  powerNum: string
  efficiency: string
  efficiencyNum: string
  noise: string
  noiseNum: string
  contract: string
  price: number       // INR integer
  priceDisplay: string
  silencerPrice: number
  available: boolean
  bestSeller?: boolean
  sku: string
  edition: string
  specs: {
    performance: [string, string][]
    power: [string, string][]
    physical: [string, string][]
    connectivity: [string, string][]
  }
  boxItems: { icon: string; label: string; sub: string }[]
  electricalReqs: [string, string][]
  relatedSlugs: string[]
}

export const PRODUCTS: Product[] = [
  {
    slug: 'antminer-s19-xp',
    algo: 'SHA-256',
    stock: 'In Stock',
    tag: 'BESTSELLER',
    name: 'Antminer S19 XP',
    shortName: 'S19',
    subName: 'XP',
    tagline: 'The flagship workhorse. Bitmain\'s most efficient SHA-256 ASIC, tuned, tested and shipped from our Delhi facility — with full GST invoice and 12-month local RMA.',
    hashrate: '140 TH/s',
    hashrateNum: '140',
    hashrateUnit: 'TH/s',
    power: '3010W',
    powerNum: '3010',
    efficiency: '21.5 J/TH',
    efficiencyNum: '21.5',
    noise: '75 dB',
    noiseNum: '75',
    contract: '12 months',
    price: 320000,
    priceDisplay: '₹3,20,000',
    silencerPrice: 8000,
    available: true,
    sku: 'BTM-S19XP-140',
    edition: 'Bitmain · 2024 ed.',
    specs: {
      performance: [
        ['Algorithm', 'SHA-256'],
        ['Hashrate', '140 TH/s ±3%'],
        ['Manufacturer', 'Bitmain Technologies'],
        ['Chip', '5nm Custom ASIC'],
      ],
      power: [
        ['Power Draw', '3010W ±5% @ 25°C'],
        ['Efficiency', '21.5 J/TH'],
        ['Voltage', '220–240V AC'],
        ['Connector', 'C19 IEC inlet'],
      ],
      physical: [
        ['Dimensions', '400 × 195 × 290 mm'],
        ['Weight', '13.5 kg'],
        ['Cooling', '4× high-speed fans'],
        ['Operating Temp', '5°C – 45°C'],
      ],
      connectivity: [
        ['Network', 'RJ45 Ethernet 10/100M'],
        ['Noise level', '75 dB'],
        ['Pool support', 'Stratum V1/V2'],
        ['Firmware', 'Bitmain stock + custom'],
      ],
    },
    boxItems: [
      { icon: '◼', label: 'Antminer S19 XP unit', sub: 'Sealed factory box, 24h tested' },
      { icon: '⏚', label: 'Power cable', sub: 'C19 IEC, India plug adapter included' },
      { icon: '⌥', label: '2× Ethernet cable', sub: 'Cat6, 2m each' },
      { icon: '📑', label: 'Quick setup guide', sub: 'English + Hindi · QR to video walkthrough' },
    ],
    electricalReqs: [
      ['AC Voltage', '220V – 240V AC'],
      ['Wiring', '2.5 mm² – 4 mm² copper'],
      ['Circuit', 'Dedicated, single-phase'],
      ['Breaker', '16A minimum (20A recommended)'],
      ['Ventilation', 'Hot-air exhaust required'],
      ['Earthing', 'Mandatory · ≤ 4 Ω resistance'],
    ],
    relatedSlugs: ['antminer-s19j-pro', 'antminer-s21-pro', 'iceriver-ks3m'],
  },
  {
    slug: 'antminer-s19j-pro',
    algo: 'SHA-256',
    stock: 'In Stock',
    tag: 'POPULAR',
    name: 'Antminer S19j Pro',
    shortName: 'S19j',
    subName: 'Pro',
    tagline: 'The reliable workhorse. Proven SHA-256 performance at an accessible price point — a favourite among Indian home miners.',
    hashrate: '104 TH/s',
    hashrateNum: '104',
    hashrateUnit: 'TH/s',
    power: '3068W',
    powerNum: '3068',
    efficiency: '29.5 J/TH',
    efficiencyNum: '29.5',
    noise: '75 dB',
    noiseNum: '75',
    contract: '12 months',
    price: 210000,
    priceDisplay: '₹2,10,000',
    silencerPrice: 8000,
    available: true,
    sku: 'BTM-S19JPRO-104',
    edition: 'Bitmain · 2023 ed.',
    specs: {
      performance: [
        ['Algorithm', 'SHA-256'],
        ['Hashrate', '104 TH/s ±3%'],
        ['Manufacturer', 'Bitmain Technologies'],
        ['Chip', '7nm Custom ASIC'],
      ],
      power: [
        ['Power Draw', '3068W ±5% @ 25°C'],
        ['Efficiency', '29.5 J/TH'],
        ['Voltage', '220–240V AC'],
        ['Connector', 'C19 IEC inlet'],
      ],
      physical: [
        ['Dimensions', '400 × 195 × 290 mm'],
        ['Weight', '13.2 kg'],
        ['Cooling', '4× high-speed fans'],
        ['Operating Temp', '5°C – 45°C'],
      ],
      connectivity: [
        ['Network', 'RJ45 Ethernet 10/100M'],
        ['Noise level', '75 dB'],
        ['Pool support', 'Stratum V1/V2'],
        ['Firmware', 'Bitmain stock + custom'],
      ],
    },
    boxItems: [
      { icon: '◼', label: 'Antminer S19j Pro unit', sub: 'Sealed factory box, 24h tested' },
      { icon: '⏚', label: 'Power cable', sub: 'C19 IEC, India plug adapter included' },
      { icon: '⌥', label: '2× Ethernet cable', sub: 'Cat6, 2m each' },
      { icon: '📑', label: 'Quick setup guide', sub: 'English + Hindi · QR to video walkthrough' },
    ],
    electricalReqs: [
      ['AC Voltage', '220V – 240V AC'],
      ['Wiring', '2.5 mm² – 4 mm² copper'],
      ['Circuit', 'Dedicated, single-phase'],
      ['Breaker', '16A minimum (20A recommended)'],
      ['Ventilation', 'Hot-air exhaust required'],
      ['Earthing', 'Mandatory · ≤ 4 Ω resistance'],
    ],
    relatedSlugs: ['antminer-s19-xp', 'antminer-s21-pro', 'jasminer-x4-q'],
  },
  {
    slug: 'jasminer-x4-q',
    algo: 'ETHASH',
    stock: 'In Stock',
    tag: 'GPU MINING',
    name: 'Jasminer X4-Q',
    shortName: 'X4',
    subName: 'Q',
    tagline: 'Ultra-quiet Ethash ASIC. Near-silent operation at 40 dB makes it the only miner you can run in an apartment.',
    hashrate: '1040 MH/s',
    hashrateNum: '1040',
    hashrateUnit: 'MH/s',
    power: '480W',
    powerNum: '480',
    efficiency: '0.46 J/MH',
    efficiencyNum: '0.46',
    noise: '40 dB',
    noiseNum: '40',
    contract: '6 months',
    price: 185000,
    priceDisplay: '₹1,85,000',
    silencerPrice: 0,
    available: true,
    sku: 'JAS-X4Q-1040',
    edition: 'Jasminer · 2023 ed.',
    specs: {
      performance: [
        ['Algorithm', 'Ethash / ETC'],
        ['Hashrate', '1040 MH/s ±5%'],
        ['Manufacturer', 'Jasminer'],
        ['Chip', 'Custom ASIC'],
      ],
      power: [
        ['Power Draw', '480W ±10%'],
        ['Efficiency', '0.46 J/MH'],
        ['Voltage', '220–240V AC'],
        ['Connector', 'Standard IEC'],
      ],
      physical: [
        ['Dimensions', '430 × 140 × 290 mm'],
        ['Weight', '9.5 kg'],
        ['Cooling', 'Semi-passive (40 dB)'],
        ['Operating Temp', '5°C – 35°C'],
      ],
      connectivity: [
        ['Network', 'RJ45 Ethernet 10/100M'],
        ['Noise level', '40 dB'],
        ['Pool support', 'Stratum V1'],
        ['Firmware', 'Jasminer stock'],
      ],
    },
    boxItems: [
      { icon: '◼', label: 'Jasminer X4-Q unit', sub: 'Sealed factory box, 24h tested' },
      { icon: '⏚', label: 'Power cable', sub: 'Standard IEC, India plug included' },
      { icon: '⌥', label: '1× Ethernet cable', sub: 'Cat5e, 2m' },
      { icon: '📑', label: 'Quick setup guide', sub: 'English · QR to video walkthrough' },
    ],
    electricalReqs: [
      ['AC Voltage', '220V – 240V AC'],
      ['Wiring', '1.5 mm² copper minimum'],
      ['Circuit', 'Standard 6A circuit'],
      ['Breaker', '10A minimum'],
      ['Ventilation', 'Minimal — near-silent unit'],
      ['Earthing', 'Standard earthing required'],
    ],
    relatedSlugs: ['antminer-l7', 'antminer-s19j-pro', 'iceriver-ks3m'],
  },
  {
    slug: 'antminer-l7',
    algo: 'SCRYPT',
    stock: 'In Stock',
    tag: 'LITECOIN',
    name: 'Antminer L7',
    shortName: 'L7',
    subName: '9500',
    tagline: 'The Scrypt king. Mine Litecoin and Dogecoin simultaneously with the most powerful SCRYPT ASIC on the market.',
    hashrate: '9500 MH/s',
    hashrateNum: '9500',
    hashrateUnit: 'MH/s',
    power: '3425W',
    powerNum: '3425',
    efficiency: '0.36 J/MH',
    efficiencyNum: '0.36',
    noise: '75 dB',
    noiseNum: '75',
    contract: '12 months',
    price: 275000,
    priceDisplay: '₹2,75,000',
    silencerPrice: 8000,
    available: true,
    sku: 'BTM-L7-9500',
    edition: 'Bitmain · 2023 ed.',
    specs: {
      performance: [
        ['Algorithm', 'Scrypt (LTC/DOGE)'],
        ['Hashrate', '9500 MH/s ±3%'],
        ['Manufacturer', 'Bitmain Technologies'],
        ['Chip', '7nm Scrypt ASIC'],
      ],
      power: [
        ['Power Draw', '3425W ±5% @ 25°C'],
        ['Efficiency', '0.36 J/MH'],
        ['Voltage', '220–240V AC'],
        ['Connector', 'C19 IEC inlet'],
      ],
      physical: [
        ['Dimensions', '400 × 195 × 290 mm'],
        ['Weight', '15.1 kg'],
        ['Cooling', '4× high-speed fans'],
        ['Operating Temp', '5°C – 45°C'],
      ],
      connectivity: [
        ['Network', 'RJ45 Ethernet 10/100M'],
        ['Noise level', '75 dB'],
        ['Pool support', 'Stratum V1/V2'],
        ['Firmware', 'Bitmain stock + custom'],
      ],
    },
    boxItems: [
      { icon: '◼', label: 'Antminer L7 unit', sub: 'Sealed factory box, 24h tested' },
      { icon: '⏚', label: 'Power cable', sub: 'C19 IEC, India plug adapter included' },
      { icon: '⌥', label: '2× Ethernet cable', sub: 'Cat6, 2m each' },
      { icon: '📑', label: 'Quick setup guide', sub: 'English + Hindi · QR to video walkthrough' },
    ],
    electricalReqs: [
      ['AC Voltage', '220V – 240V AC'],
      ['Wiring', '2.5 mm² – 4 mm² copper'],
      ['Circuit', 'Dedicated, single-phase'],
      ['Breaker', '16A minimum (20A recommended)'],
      ['Ventilation', 'Hot-air exhaust required'],
      ['Earthing', 'Mandatory · ≤ 4 Ω resistance'],
    ],
    relatedSlugs: ['antminer-s19-xp', 'iceriver-ks3m', 'antminer-s19j-pro'],
  },
  {
    slug: 'antminer-s21-pro',
    algo: 'SHA-256',
    stock: 'Coming Soon',
    tag: 'NEW',
    name: 'Antminer S21 Pro',
    shortName: 'S21',
    subName: 'Pro',
    tagline: 'Next-generation efficiency. Bitmain\'s 3nm flagship — the most efficient Bitcoin miner ever produced. Pre-order now.',
    hashrate: '234 TH/s',
    hashrateNum: '234',
    hashrateUnit: 'TH/s',
    power: '3531W',
    powerNum: '3531',
    efficiency: '15.1 J/TH',
    efficiencyNum: '15.1',
    noise: '72 dB',
    noiseNum: '72',
    contract: '12 months',
    price: 540000,
    priceDisplay: '₹5,40,000',
    silencerPrice: 8000,
    available: false,
    sku: 'BTM-S21PRO-234',
    edition: 'Bitmain · 2025 ed.',
    specs: {
      performance: [
        ['Algorithm', 'SHA-256'],
        ['Hashrate', '234 TH/s ±3%'],
        ['Manufacturer', 'Bitmain Technologies'],
        ['Chip', '3nm Custom ASIC'],
      ],
      power: [
        ['Power Draw', '3531W ±5% @ 25°C'],
        ['Efficiency', '15.1 J/TH'],
        ['Voltage', '220–240V AC'],
        ['Connector', 'C19 IEC inlet'],
      ],
      physical: [
        ['Dimensions', '400 × 195 × 290 mm'],
        ['Weight', '14.2 kg'],
        ['Cooling', '4× high-speed fans'],
        ['Operating Temp', '5°C – 45°C'],
      ],
      connectivity: [
        ['Network', 'RJ45 Ethernet 10/100M'],
        ['Noise level', '72 dB'],
        ['Pool support', 'Stratum V1/V2'],
        ['Firmware', 'Bitmain stock + custom'],
      ],
    },
    boxItems: [
      { icon: '◼', label: 'Antminer S21 Pro unit', sub: 'Sealed factory box, 24h tested' },
      { icon: '⏚', label: 'Power cable', sub: 'C19 IEC, India plug adapter included' },
      { icon: '⌥', label: '2× Ethernet cable', sub: 'Cat6, 2m each' },
      { icon: '📑', label: 'Quick setup guide', sub: 'English + Hindi · QR to video walkthrough' },
    ],
    electricalReqs: [
      ['AC Voltage', '220V – 240V AC'],
      ['Wiring', '2.5 mm² – 4 mm² copper'],
      ['Circuit', 'Dedicated, single-phase'],
      ['Breaker', '16A minimum (20A recommended)'],
      ['Ventilation', 'Hot-air exhaust required'],
      ['Earthing', 'Mandatory · ≤ 4 Ω resistance'],
    ],
    relatedSlugs: ['antminer-s19-xp', 'antminer-s19j-pro', 'iceriver-ks3m'],
  },
  {
    slug: 'iceriver-ks3m',
    algo: 'KASPA',
    stock: 'In Stock',
    tag: 'HIGH ROI',
    name: 'IceRiver KS3M',
    shortName: 'KS3',
    subName: 'M',
    tagline: 'Kaspa\'s champion. Mine KAS with the most powerful kHeavyHash ASIC available. Exceptional ROI in the current difficulty window.',
    hashrate: '6 TH/s',
    hashrateNum: '6',
    hashrateUnit: 'TH/s',
    power: '3400W',
    powerNum: '3400',
    efficiency: '566 J/TH',
    efficiencyNum: '566',
    noise: '75 dB',
    noiseNum: '75',
    contract: '6 months',
    price: 410000,
    priceDisplay: '₹4,10,000',
    silencerPrice: 8000,
    available: true,
    sku: 'ICR-KS3M-6000',
    edition: 'IceRiver · 2024 ed.',
    specs: {
      performance: [
        ['Algorithm', 'kHeavyHash (KAS)'],
        ['Hashrate', '6 TH/s ±5%'],
        ['Manufacturer', 'IceRiver'],
        ['Chip', 'Custom kHeavyHash ASIC'],
      ],
      power: [
        ['Power Draw', '3400W ±10%'],
        ['Efficiency', '566 J/TH'],
        ['Voltage', '220–240V AC'],
        ['Connector', 'C19 IEC inlet'],
      ],
      physical: [
        ['Dimensions', '370 × 195 × 290 mm'],
        ['Weight', '14.8 kg'],
        ['Cooling', '4× high-speed fans'],
        ['Operating Temp', '5°C – 40°C'],
      ],
      connectivity: [
        ['Network', 'RJ45 Ethernet 10/100M'],
        ['Noise level', '75 dB'],
        ['Pool support', 'Stratum V1'],
        ['Firmware', 'IceRiver stock'],
      ],
    },
    boxItems: [
      { icon: '◼', label: 'IceRiver KS3M unit', sub: 'Sealed factory box, 24h tested' },
      { icon: '⏚', label: 'Power cable', sub: 'C19 IEC, India plug adapter included' },
      { icon: '⌥', label: '2× Ethernet cable', sub: 'Cat6, 2m each' },
      { icon: '📑', label: 'Quick setup guide', sub: 'English · QR to video walkthrough' },
    ],
    electricalReqs: [
      ['AC Voltage', '220V – 240V AC'],
      ['Wiring', '2.5 mm² – 4 mm² copper'],
      ['Circuit', 'Dedicated, single-phase'],
      ['Breaker', '16A minimum (20A recommended)'],
      ['Ventilation', 'Hot-air exhaust required'],
      ['Earthing', 'Mandatory · ≤ 4 Ω resistance'],
    ],
    relatedSlugs: ['antminer-s19-xp', 'antminer-l7', 'antminer-s21-pro'],
  },
]

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}
