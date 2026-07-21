/* ============================================================
   Single source of truth for pricing.
   Used by the homepage packages section AND /pricing, so the
   two can never drift apart. Change a number once, here.

   Prices are "from" anchors - every project is quoted exactly
   during the free Discord consultation.
   ============================================================ */

export interface Pkg {
  id: string;
  name: string;
  price: number;
  tagline: string;
  bestFor: string;
  features: string[];
  delivery: string;
  revisions: string;
  featured?: boolean;
}

export const packages: Pkg[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    tagline: 'The fundamentals, done properly.',
    bestFor: 'New and growing servers',
    delivery: '3-5 days',
    revisions: '1 round',
    features: [
      'Custom bot coded from scratch',
      'Slash commands & interactive embeds',
      'Moderation & auto-mod (spam, links, filters)',
      'Welcome flows & reaction roles',
      'Action and message logging',
      'Deployment help + full source code',
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 299,
    tagline: 'Systems that remember your members.',
    bestFor: 'Active communities',
    delivery: '1-2 weeks',
    revisions: '2 rounds',
    featured: true,
    features: [
      'Everything in Starter',
      'Database-backed persistence',
      'Ticket & support system',
      'Economy, XP & leveling',
      'Giveaways, events & mini-games',
      'External API integrations',
      'Complex multi-step workflows',
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 749,
    tagline: 'Your community, running as a business.',
    bestFor: 'Large servers & brands',
    delivery: '2-4 weeks',
    revisions: '3 rounds',
    features: [
      'Everything in Growth',
      'AI integration (chat, support agent, smart auto-mod)',
      'Web dashboard - configure without touching code',
      'Payments, subscriptions & monetization',
      'Multi-server deployment & sync',
      'Analytics & reporting',
      'Priority delivery & support',
    ],
  },
];

/* Recurring add-on, sold alongside any package */
export const carePlan = {
  name: 'Care Plan',
  price: 19,
  unit: '/mo',
  desc: 'Keep your bot online and current without lifting a finger.',
  features: [
    '24/7 managed cloud hosting',
    'Uptime monitoring & alerts',
    'Bug fixes on delivered features',
    'Discord API change updates',
  ],
};

/* Comparison matrix for /pricing.
   Values: true = included, false = not included, or a string. */
export const comparison: { group: string; rows: { label: string; starter: boolean | string; growth: boolean | string; scale: boolean | string }[] }[] = [
  {
    group: 'Core build',
    rows: [
      { label: 'Custom bot coded from scratch', starter: true, growth: true, scale: true },
      { label: 'Slash commands & interactive embeds', starter: true, growth: true, scale: true },
      { label: 'Moderation & auto-mod', starter: true, growth: true, scale: true },
      { label: 'Welcome flows & reaction roles', starter: true, growth: true, scale: true },
      { label: 'Action and message logging', starter: true, growth: true, scale: true },
      { label: 'Full source code ownership', starter: true, growth: true, scale: true },
    ],
  },
  {
    group: 'Data & systems',
    rows: [
      { label: 'Database-backed persistence', starter: false, growth: true, scale: true },
      { label: 'Ticket & support system', starter: false, growth: true, scale: true },
      { label: 'Economy, XP & leveling', starter: false, growth: true, scale: true },
      { label: 'Giveaways, events & mini-games', starter: false, growth: true, scale: true },
      { label: 'External API integrations', starter: false, growth: true, scale: true },
      { label: 'Complex multi-step workflows', starter: false, growth: true, scale: true },
    ],
  },
  {
    group: 'Advanced',
    rows: [
      { label: 'AI integration (chat & support agents)', starter: false, growth: false, scale: true },
      { label: 'Web dashboard', starter: false, growth: false, scale: true },
      { label: 'Payments, subscriptions & monetization', starter: false, growth: false, scale: true },
      { label: 'Multi-server deployment & sync', starter: false, growth: false, scale: true },
      { label: 'Analytics & reporting', starter: false, growth: false, scale: true },
    ],
  },
  {
    group: 'Delivery',
    rows: [
      { label: 'Typical delivery time', starter: '3-5 days', growth: '1-2 weeks', scale: '2-4 weeks' },
      { label: 'Revision rounds', starter: '1', growth: '2', scale: '3' },
      { label: 'Free bug fixes after delivery', starter: true, growth: true, scale: true },
      { label: 'Priority support', starter: false, growth: false, scale: true },
    ],
  },
];
