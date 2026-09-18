export interface Flavor {
  id: string;
  name: string;
  subname: string;
  tagline: string;
  description: string;
  badge: string;
  color: string;
  accentColor: string;
  glowColor: string;
  bgColor: string;
  bgGradient: string;
  metrics: {
    sweetness: number;
    tartness: number;
    fizz: number;
    refreshment: number;
  };
  nutrition: {
    calories: number;
    sugar: string;
    realJuice: string;
    vitaminC: string;
  };
  ingredients: string[];
}

export const FLAVORS: Record<string, Flavor> = {
  lemon: {
    id: 'lemon',
    name: 'Lemon Lime Mint',
    subname: 'Blender Juice Original',
    tagline: '100% Cold-Pressed Citrus & Wild Mountain Mint',
    description:
      'The definitive crisp reviver. Crafted with sun-drenched Mediterranean lemons, zesty Persian limes, and bruised spearmint leaves infused into micro-effervescent alpine water.',
    badge: 'Flagship Edition',
    color: '#8ec53f',
    accentColor: '#b4f046',
    glowColor: 'rgba(168, 223, 70, 0.35)',
    bgColor: '#0e160a',
    bgGradient: 'radial-gradient(ellipse at 50% 35%, #2a4714 0%, #0c1409 60%, #050904 100%)',
    metrics: {
      sweetness: 25,
      tartness: 88,
      fizz: 92,
      refreshment: 98,
    },
    nutrition: {
      calories: 12,
      sugar: '0g Added',
      realJuice: '18% Real Juice',
      vitaminC: '120% DV',
    },
    ingredients: ['Carbonated Alpine Spring Water', 'Sicilian Lemon Juice', 'Persian Lime Extract', 'Organic Spearmint Infusion', 'Natural Flavors'],
  },
  'blood-orange': {
    id: 'blood-orange',
    name: 'Blood Orange Spark',
    subname: 'Sun-Drenched Ruby',
    tagline: 'Deep Volcanic Citrus with a Velvety Sparkle',
    description:
      'Pressed from handpicked Sicilian Moro blood oranges grown on mineral-rich volcanic soil. Bold, ruby-hued, and bursting with tangy floral sweetness.',
    badge: 'Crowd Favorite',
    color: '#f95738',
    accentColor: '#ff8a50',
    glowColor: 'rgba(249, 87, 56, 0.35)',
    bgColor: '#1a0b08',
    bgGradient: 'radial-gradient(ellipse at 50% 35%, #4a190f 0%, #170705 60%, #0a0302 100%)',
    metrics: {
      sweetness: 48,
      tartness: 72,
      fizz: 85,
      refreshment: 94,
    },
    nutrition: {
      calories: 16,
      sugar: '0g Added',
      realJuice: '22% Real Juice',
      vitaminC: '150% DV',
    },
    ingredients: ['Carbonated Alpine Spring Water', 'Moro Blood Orange Juice', 'Tangerine Zest Essence', 'Organic Rosemary Hint', 'Natural Flavors'],
  },
  'wild-berry': {
    id: 'wild-berry',
    name: 'Wild Berry Eclipse',
    subname: 'Forest Bramble & Açaí',
    tagline: 'Electric Blackberry, Cassis & Midnight Botanicals',
    description:
      'A nocturnal melody of crushed wild blackberries, ripe blackcurrant, and tart raspberry sparkling over icy mountain spring water.',
    badge: 'Antioxidant Rich',
    color: '#a855f7',
    accentColor: '#c084fc',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    bgColor: '#13081c',
    bgGradient: 'radial-gradient(ellipse at 50% 35%, #3b1057 0%, #12061c 60%, #08020d 100%)',
    metrics: {
      sweetness: 42,
      tartness: 68,
      fizz: 89,
      refreshment: 91,
    },
    nutrition: {
      calories: 14,
      sugar: '0g Added',
      realJuice: '20% Real Juice',
      vitaminC: '100% DV',
    },
    ingredients: ['Carbonated Spring Water', 'Wild Blackberry Puree', 'Blackcurrant Juice', 'Organic Acai Berry Extract', 'Natural Botanical Flavors'],
  },
  'midnight-citrus': {
    id: 'midnight-citrus',
    name: 'Black Yuzu Cola',
    subname: 'Craft Botanical Soda',
    tagline: 'Japanese Yuzu, Roasted Kola Nut & Spiced Lime',
    description:
      'The modern reinvention of cola. Japanese yuzu peel with roasted kola nut, cinnamon bark, Madagascar vanilla, and cold-pressed lime.',
    badge: 'Limited Edition',
    color: '#10b981',
    accentColor: '#34d399',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    bgColor: '#081310',
    bgGradient: 'radial-gradient(ellipse at 50% 35%, #0f362b 0%, #071713 60%, #030a08 100%)',
    metrics: {
      sweetness: 35,
      tartness: 76,
      fizz: 96,
      refreshment: 95,
    },
    nutrition: {
      calories: 15,
      sugar: '0g Added',
      realJuice: '15% Real Juice',
      vitaminC: '80% DV',
    },
    ingredients: ['Carbonated Spring Water', 'Japanese Yuzu Juice', 'Natural Kola Nut Extract', 'Cinnamon & Nutmeg Essence', 'Tahitian Lime Extract'],
  },
};

export const FLAVOR_KEYS = Object.keys(FLAVORS) as (keyof typeof FLAVORS)[];
