export type RelationshipType =
  | 'partner'
  | 'best-friend'
  | 'friend'
  | 'sibling'
  | 'parent'
  | 'child'
  | 'enemy'
  | 'other';

export type Theme = 'gold' | 'blue' | 'purple' | 'green' | 'pink' | 'orange';

export interface Option {
  value: string;
  label: string;
  emoji?: string;
  allowCustomInput?: boolean;
}

export interface QuestionVariant {
  id: string;
  question: string;
  displayPrefix?: string;
  displaySuffix?: string;
  options?: Option[];
  hideInput?: boolean;
}

export interface WrappedData {
  recipientName: string;
  relationship: RelationshipType;
  creatorName?: string;
  accentTheme?: Theme;

  // Slide 3 - Main Character Era
  mainCharacterEra?: string;
  eraVariant?: string;

  // Slide 4 - Top Phrase
  topPhrase?: string;
  phraseVariant?: string;

  // Slide 5 - Most Used Emotions
  topEmotions?: string[];
  emotionsVariant?: string;

  // Slide 6 - Top 3 Obsessions
  obsessions?: string[];
  obsessionsVariant?: string;

  // Slide 7 - Favorites
  favorites?: string[];
  favoritesVariant?: string;

  // Slide 8 - Quiet Improvement
  quietImprovement?: string;
  quietImprovementNote?: string;
  improvementVariant?: string;

  // Slide 8 - A Moment Worth Keeping (Premium)
  memorableMoment?: string;

  // Slide 9 - Something You Overcame
  overcame?: string;

  // Slide 10 - The You Now
  currentTraits?: string[];

  // Slide 11 - From Me to You (Premium)
  personalMessage?: string;

  // Slide 12 - Outro
  outroMessage?: string;
  outroVariant?: string;
  creatorVariant?: string;

  // Background Music
  bgMusic?: string;

  // Metadata
  createdAt?: string;
}

export interface SlideConfig {
  id: number;
  title: string;
  isPremium: boolean;
  component: string;
}

export const RELATIONSHIP_LABELS: Record<RelationshipType, string> = {
  'partner': 'My Partner',
  'best-friend': 'My Best Friend',
  'friend': 'My Friend',
  'sibling': 'My Sibling',
  'parent': 'My Parent',
  'child': 'My Child',
  'enemy': 'My Enemy',
  'other': 'Someone Special',
};

export const MUSIC_OPTIONS: Option[] = [
  { value: 'none', label: 'No Music', emoji: '🔇' },
  { value: 'upbeat', label: 'Upbeat', emoji: '🎵' },
  { value: 'chill', label: 'Lo-Fi Chill', emoji: '☕' },
  { value: 'calm', label: 'Calm', emoji: '🧘' },
  { value: 'emotional', label: 'Emotional', emoji: '🎸' },
];

export const MAIN_CHARACTER_ERAS = [
  { value: 'healing', label: 'Healing Era', emoji: '🌱' },
  { value: 'glow-up', label: 'Glow-Up Era', emoji: '✨' },
  { value: 'chaos', label: 'Chaos Era', emoji: '🌪️' },
  { value: 'rebirth', label: 'Rebirth Era', emoji: '🔥' },
  { value: 'soft-life', label: 'Soft Life Era', emoji: '☁️' },
  { value: 'grind', label: 'Grind Era', emoji: '💪' },
  { value: 'discovery', label: 'Discovery Era', emoji: '🔮' },
  { value: 'peace', label: 'Peace Era', emoji: '🕊️' },
];

export const ERA_VARIANTS: QuestionVariant[] = [
  {
    id: 'main-character',
    question: "What era best describes their year?",
    displayPrefix: "Their Era",
    displaySuffix: "The",
    options: MAIN_CHARACTER_ERAS
  },
  {
    id: 'vibe',
    question: "What was their overall vibe this year?",
    displayPrefix: "2025 Vibe Check",
    displaySuffix: "Certified",
    options: [
      { value: 'chill', label: 'Chill', emoji: '🧊' },
      { value: 'chaotic-good', label: 'Chaotic Good', emoji: '🤪' },
      { value: 'main-character', label: 'Main Character', emoji: '💅' },
      { value: 'villain', label: 'Villain', emoji: '😈' },
      { value: 'wholesome', label: 'Wholesome', emoji: '🥰' },
      { value: 'feral', label: 'Feral', emoji: '🐺' },
      { value: 'academic', label: 'Academic', emoji: '📚' },
      { value: 'cozy', label: 'Cozy', emoji: '🧸' },
    ]
  },
  {
    id: 'chapter',
    question: "What chapter were they living?",
    displayPrefix: "This Year's Chapter",
    displaySuffix: "The",
    options: [
      { value: 'plot-twist', label: 'Plot Twist', emoji: '😱' },
      { value: 'redemption', label: 'Redemption Arc', emoji: '🌅' },
      { value: 'training', label: 'Training Arc', emoji: '🏋️' },
      { value: 'filler', label: 'Filler Episode', emoji: '🏖️' },
      { value: 'climax', label: 'The Climax', emoji: '🌋' },
      { value: 'prologue', label: 'The Prologue', emoji: '📖' },
      { value: 'side-quest', label: 'Side Quest', emoji: '🗺️' },
      { value: 'finale', label: 'Season Finale', emoji: '🎆' },
    ]
  },
  {
    id: 'energy',
    question: "What energy did they bring to 2025?",
    displayPrefix: "Their 2025 Energy",
    displaySuffix: "Pure",
    options: [
      { value: 'golden-retriever', label: 'Golden Retriever', emoji: '🐕' },
      { value: 'black-cat', label: 'Black Cat', emoji: '🐈‍⬛' },
      { value: 'capybara', label: 'Capybara', emoji: '🥔' },
      { value: 'raccoon', label: 'Raccoon', emoji: '🦝' },
      { value: 'orange-cat', label: 'Orange Cat', emoji: '🐈' },
      { value: 'bunny', label: 'Bunny', emoji: '🐰' },
      { value: 'dragon', label: 'Dragon', emoji: '🐉' },
      { value: 'sloth', label: 'Sloth', emoji: '🦥' },
    ]
  },
];

export const EMOTIONS = [
  { value: 'joy', label: 'Joy', emoji: '😊' },
  { value: 'curiosity', label: 'Curiosity', emoji: '🤔' },
  { value: 'determination', label: 'Determination', emoji: '💪' },
  { value: 'gratitude', label: 'Gratitude', emoji: '🙏' },
  { value: 'excitement', label: 'Excitement', emoji: '🎉' },
  { value: 'calm', label: 'Calm', emoji: '😌' },
  { value: 'hope', label: 'Hope', emoji: '🌟' },
  { value: 'love', label: 'Love', emoji: '❤️' },
];

export const EMOTIONS_VARIANTS: QuestionVariant[] = [
  {
    id: 'top-emotions',
    question: "Pick up to 2 that defined their year",
    displayPrefix: "Top Emotions",
    options: [...EMOTIONS, { value: 'other', label: 'Other', emoji: '✨', allowCustomInput: true }]
  },
  {
    id: 'mood-board',
    question: "What was their emotional palette?",
    displayPrefix: "Emotional Palette",
    options: [
      { value: 'pastel', label: 'Pastel Soft', emoji: '🌸' },
      { value: 'neon', label: 'Neon Chaos', emoji: '⚡' },
      { value: 'monochrome', label: 'Monochrome Moody', emoji: '🖤' },
      { value: 'golden-hour', label: 'Golden Hour', emoji: '🌅' },
      { value: 'forest', label: 'Deep Forest', emoji: '🌲' },
      { value: 'ocean', label: 'Ocean Blue', emoji: '🌊' },
      { value: 'sunset', label: 'Sunset Fire', emoji: '🌇' },
      { value: 'midnight', label: 'Midnight Rain', emoji: '🌧️' },
      { value: 'other', label: 'Other', emoji: '✨', allowCustomInput: true },
    ]
  },
  {
    id: 'feelings',
    question: "What feelings did they carry most?",
    displayPrefix: "Most Carried Feelings",
    options: [
      { value: 'nostalgia', label: 'Nostalgia', emoji: '🕰️' },
      { value: 'anticipation', label: 'Anticipation', emoji: '👀' },
      { value: 'wonder', label: 'Wonder', emoji: '✨' },
      { value: 'relief', label: 'Relief', emoji: '😮‍💨' },
      { value: 'pride', label: 'Pride', emoji: '🦁' },
      { value: 'affection', label: 'Affection', emoji: '🥰' },
      { value: 'melancholy', label: 'Melancholy', emoji: '🥀' },
      { value: 'euphoria', label: 'Euphoria', emoji: '🤩' },
      { value: 'other', label: 'Other', emoji: '✨', allowCustomInput: true },
    ]
  },
  {
    id: 'heart',
    question: "What lived in their heart this year?",
    displayPrefix: "In Their Heart",
    options: [
      { value: 'kindness', label: 'Kindness', emoji: '🤲' },
      { value: 'courage', label: 'Courage', emoji: '🦁' },
      { value: 'forgiveness', label: 'Forgiveness', emoji: '🕊️' },
      { value: 'passion', label: 'Passion', emoji: '🔥' },
      { value: 'loyalty', label: 'Loyalty', emoji: '🤝' },
      { value: 'generosity', label: 'Generosity', emoji: '🎁' },
      { value: 'empathy', label: 'Empathy', emoji: '🫂' },
      { value: 'resilience', label: 'Resilience', emoji: '🌱' },
      { value: 'other', label: 'Other', emoji: '✨', allowCustomInput: true },
    ]
  },
];

export const PHRASE_VARIANTS: QuestionVariant[] = [
  {
    id: 'signature',
    question: "What did they say all the time this year?",
    displayPrefix: "Most Used Phrase",
    options: [
      { value: 'slay', label: 'Slay', emoji: '💅' },
      { value: 'clock-it', label: 'Clock it', emoji: '🤏' },
      { value: 'real', label: 'Real', emoji: '💯' },
      { value: 'literally', label: 'Literally', emoji: '💀' },
      { value: 'obsessed', label: 'Obsessed', emoji: '😍' },
      { value: 'iconic', label: 'Iconic', emoji: '✨' },
      { value: 'period', label: 'Period', emoji: '🛑' },
      { value: 'vibes', label: 'Vibes', emoji: '🌊' },
      { value: 'bet', label: 'Bet', emoji: '🤝' },
    ]
  },
  {
    id: 'catchphrase',
    question: "What was their unofficial catchphrase?",
    displayPrefix: "2025 Catchphrase",
    options: [
      { value: 'it-is-what-it-is', label: 'It is what it is', emoji: '🤷' },
      { value: 'living-my-best-life', label: 'Living my best life', emoji: '🥂' },
      { value: 'main-character-energy', label: 'Main character energy', emoji: '🌟' },
      { value: 'in-my-era', label: 'In my ... era', emoji: '🕰️' },
      { value: 'trust-the-process', label: 'Trust the process', emoji: '🔄' },
      { value: 'let-him-cook', label: 'Let him cook', emoji: '👨‍🍳' },
      { value: 'touch-grass', label: 'Touch grass', emoji: '🌱' },
      { value: 'skill-issue', label: 'Skill issue', emoji: '🎮' },
    ]
  },
  {
    id: 'mantra',
    question: "What became their accidental mantra?",
    displayPrefix: "Accidental Mantra",
    options: [
      { value: 'i-can-do-hard-things', label: 'I can do hard things', emoji: '💪' },
      { value: 'one-day-at-a-time', label: 'One day at a time', emoji: '📅' },
      { value: 'everything-happens-for-a-reason', label: 'Everything happens for a reason', emoji: '✨' },
      { value: 'this-too-shall-pass', label: 'This too shall pass', emoji: '🍃' },
      { value: 'protect-your-peace', label: 'Protect your peace', emoji: '🛡️' },
      { value: 'choose-joy', label: 'Choose joy', emoji: '😊' },
      { value: 'be-here-now', label: 'Be here now', emoji: '🧘' },
      { value: 'good-vibes-only', label: 'Good vibes only', emoji: '✌️' },
    ]
  },
  {
    id: 'quote',
    question: "What's a quote that's just so them?",
    displayPrefix: "Peak Them Energy",
    options: [
      { value: 'yolo', label: 'You only live once', emoji: '🎢' },
      { value: 'live-laugh-love', label: 'Live, Laugh, Love', emoji: '💖' },
      { value: 'work-hard-play-hard', label: 'Work hard, play hard', emoji: '🎉' },
      { value: 'fake-it-till-you-make-it', label: 'Fake it till you make it', emoji: '🎭' },
      { value: 'treat-yourself', label: 'Treat yourself', emoji: '🛍️' },
      { value: 'no-regrets', label: 'No regrets', emoji: '🚫' },
      { value: 'just-do-it', label: 'Just do it', emoji: '✔️' },
      { value: 'stay-wild', label: 'Stay wild', emoji: '🐺' },
    ]
  },
];

export const OBSESSIONS_VARIANTS: QuestionVariant[] = [
  {
    id: 'obsessions',
    question: "What were they completely into?",
    displayPrefix: "2025 Obsessions",
    options: [
      { value: 'football', label: 'Football', emoji: '🏈' },
      { value: 'soccer', label: 'Soccer', emoji: '⚽' },
      { value: 'running', label: 'Running', emoji: '🏃' },
      { value: 'gym', label: 'Gym', emoji: '🏋️' },
      { value: 'cooking', label: 'Cooking', emoji: '🍳' },
      { value: 'thrifting', label: 'Thrifting', emoji: '👗' },
      { value: 'travel', label: 'Travel', emoji: '✈️' },
      { value: 'reading', label: 'Reading', emoji: '📚' },
    ]
  },
  {
    id: 'hyperfixations',
    question: "What consumed their attention?",
    displayPrefix: "2025 Biggest Obsessions",
    options: [
      { value: 'f1', label: 'Formula 1', emoji: '🏎️' },
      { value: 'eras-tour', label: 'The Eras Tour', emoji: '🎤' },
      { value: 'soccer', label: 'Soccer', emoji: '⚽' },
      { value: 'baldurs-gate', label: 'Baldur\'s Gate 3', emoji: '🎲' },
      { value: 'kpop', label: 'K-Pop', emoji: '🎵' },
      { value: 'astrology', label: 'Astrology', emoji: '🔮' },
      { value: 'coding', label: 'Coding', emoji: '💻' },
      { value: 'anime', label: 'Anime', emoji: '📺' },
      { value: 'chess', label: 'Chess', emoji: '♟️' },
    ]
  },
  {
    id: 'rabbit-holes',
    question: "What rabbit holes did they fall into?",
    displayPrefix: "Rabbit Holes Entered",
    options: [
      { value: 'true-crime', label: 'True Crime', emoji: '🕵️' },
      { value: 'conspiracy-theories', label: 'Conspiracy Theories', emoji: '👽' },
      { value: 'history', label: 'History', emoji: '📜' },
      { value: 'space', label: 'Space', emoji: '🌌' },
      { value: 'philosophy', label: 'Philosophy', emoji: '🤔' },
      { value: 'wikipedia', label: 'Wikipedia Spirals', emoji: '🌐' },
      { value: 'tiktok-trends', label: 'TikTok Trends', emoji: '📱' },
      { value: 'lore', label: 'Deep Lore', emoji: '📖' },
    ]
  },
  {
    id: 'could-not-stop',
    question: "What could they not stop talking about?",
    displayPrefix: "Talked About Non-Stop",
    options: [
      { value: 'their-dog', label: 'Their Dog', emoji: '🐶' },
      { value: 'their-cat', label: 'Their Cat', emoji: '🐱' },
      { value: 'gym', label: 'The Gym', emoji: '🏋️' },
      { value: 'work', label: 'Work', emoji: '💼' },
      { value: 'politics', label: 'Politics', emoji: '🗳️' },
      { value: 'movies', label: 'Movies', emoji: '🎬' },
      { value: 'music', label: 'Music', emoji: '🎧' },
      { value: 'food', label: 'Food', emoji: '🍕' },
    ]
  },
];

export const FAVORITES_VARIANTS: QuestionVariant[] = [
  {
    id: 'song',
    question: "What songs defined their year?",
    displayPrefix: "Favorite Songs",
    options: [
      { value: 'not-like-us', label: 'Not like us, Kendrick Lamar', emoji: '🎤' },
      { value: 'family-matters', label: 'Family Matters, Drake', emoji: '🎸' },
      { value: 'unavailable', label: 'Unavailable, Davido', emoji: '🎸' },
      { value: 'beat-it', label: 'Beat It, Michael Jackson', emoji: '🎸' },
    ]
  },
  {
    id: 'music',
    question: "What was on their playlist like?",
    displayPrefix: "Favorite music Genre",
    options: [
      { value: 'pop', label: 'Pop', emoji: '🎤' },
      { value: 'indie', label: 'Indie', emoji: '🎸' },
      { value: 'rap', label: 'Rap', emoji: '🧢' },
      { value: 'k-pop', label: 'K-Pop', emoji: '✨' },
      { value: 'techno', label: 'Techno', emoji: '🎛️' },
      { value: 'jazz', label: 'Jazz', emoji: '🎷' },
      { value: 'metal', label: 'Metal', emoji: '🤘' },
      { value: 'classical', label: 'Classical', emoji: '🎻' },
    ]
  },
  {
    id: 'movies',
    question: "What kind of movies defined their year?",
    displayPrefix: "Genre of the Year",
    options: [
      { value: 'horror', label: 'Horror', emoji: '👻' },
      { value: 'romcom', label: 'RomCom', emoji: '💘' },
      { value: 'sci-fi', label: 'Sci-Fi', emoji: '👽' },
      { value: 'thriller', label: 'Thriller', emoji: '🔪' },
      { value: 'documentary', label: 'Documentary', emoji: '📹' },
      { value: 'animation', label: 'Animation', emoji: '🎨' },
      { value: 'drama', label: 'Drama', emoji: '🎭' },
      { value: 'action', label: 'Action', emoji: '💥' },
    ]
  },
  {
    id: 'artist',
    question: "What artist defined their year?",
    displayPrefix: "Favorite Artist",
    options: [
      { value: 'drake', label: 'Drake', emoji: '⚔️' },
      { value: 'billie-eilish', label: 'Billie Eilish', emoji: '🌸' },
      { value: 'davido', label: 'Davido', emoji: '🌀' },
      { value: 'kendrick-lamar', label: 'Kendrick Lamar', emoji: '🍰' },
      { value: 'migos', label: 'Migos', emoji: '🤖' },
      { value: 'eminem', label: 'Eminem', emoji: '🏀' },
      { value: 'lil-wayne', label: 'Lil Wayne', emoji: '🧠' },
      { value: 'lil-nas-x', label: 'Lil Nas X', emoji: '🐉' },
    ]
  },
  {
    id: 'books',
    question: "What genre did they get lost in?",
    displayPrefix: "Book Genre",
    options: [
      { value: 'fantasy', label: 'Fantasy', emoji: '🧚' },
      { value: 'romance', label: 'Romance', emoji: '❤️' },
      { value: 'thriller', label: 'Thriller', emoji: '🔍' },
      { value: 'non-fiction', label: 'Non-fiction', emoji: '🧠' },
      { value: 'sci-fi', label: 'Sci-Fi', emoji: '🚀' },
      { value: 'mystery', label: 'Mystery', emoji: '🕵️' },
      { value: 'classics', label: 'Classics', emoji: '📜' },
      { value: 'poetry', label: 'Poetry', emoji: '✒️' },
    ]
  },
];

export const QUIET_IMPROVEMENTS = [
  { value: 'boundaries', label: 'Setting boundaries' },
  { value: 'self-care', label: 'Prioritizing self-care' },
  { value: 'patience', label: 'Being more patient' },
  { value: 'listening', label: 'Listening better' },
  { value: 'letting-go', label: 'Letting things go' },
  { value: 'showing-up', label: 'Showing up consistently' },
  { value: 'asking-help', label: 'Asking for help' },
  { value: 'saying-no', label: 'Saying no' },
];

export const IMPROVEMENT_VARIANTS: QuestionVariant[] = [
  {
    id: 'quiet',
    question: "Something they got better at (that they might not even realize)",
    displayPrefix: "A Quiet Improvement",
    options: [...QUIET_IMPROVEMENTS, { value: 'other', label: 'Other', allowCustomInput: true }]
  },
  {
    id: 'growth',
    question: "Where did they quietly grow this year?",
    displayPrefix: "Quiet Growth",
    options: [
      { value: 'confidence', label: 'Confidence', emoji: '🦁' },
      { value: 'communication', label: 'Communication', emoji: '🗣️' },
      { value: 'emotional-intelligence', label: 'Emotional Intelligence', emoji: '🧠' },
      { value: 'cooking', label: 'Cooking', emoji: '🍳' },
      { value: 'fitness', label: 'Fitness', emoji: '💪' },
      { value: 'creativity', label: 'Creativity', emoji: '🎨' },
      { value: 'leadership', label: 'Leadership', emoji: '👑' },
      { value: 'mindfulness', label: 'Mindfulness', emoji: '🧘' },
      { value: 'other', label: 'Other', emoji: '✨', allowCustomInput: true },
    ]
  },
  {
    id: 'leveled-up',
    question: "What did they level up in without noticing?",
    displayPrefix: "Secret Level Up",
    options: [
      { value: 'style', label: 'Style', emoji: '👗' },
      { value: 'humor', label: 'Humor', emoji: '😂' },
      { value: 'adulting', label: 'Adulting', emoji: '🏠' },
      { value: 'social-skills', label: 'Social Skills', emoji: '🤝' },
      { value: 'knowledge', label: 'General Knowledge', emoji: '📚' },
      { value: 'productivity', label: 'Productivity', emoji: '⚡' },
      { value: 'tech-skills', label: 'Tech Skills', emoji: '💻' },
      { value: 'hosting', label: 'Hosting', emoji: '🥂' },
      { value: 'other', label: 'Other', emoji: '✨', allowCustomInput: true },
    ]
  },
  {
    id: 'proud',
    question: "What should they be proud of themselves for?",
    displayPrefix: "Should Be Proud Of",
    options: [
      { value: 'surviving', label: 'Surviving', emoji: '❤️‍🩹' },
      { value: 'trying', label: 'Trying Their Best', emoji: '🌟' },
      { value: 'starting', label: 'Starting Something New', emoji: '🚀' },
      { value: 'finishing', label: 'Finishing What They Started', emoji: '🏁' },
      { value: 'helping', label: 'Helping Others', emoji: '🤲' },
      { value: 'learning', label: 'Learning From Mistakes', emoji: '📝' },
      { value: 'dreaming', label: 'Dreaming Big', emoji: '💭' },
      { value: 'being-themselves', label: 'Just Being Themselves', emoji: '🌈' },
      { value: 'other', label: 'Other', emoji: '✨', allowCustomInput: true },
    ]
  },
];

export const CURRENT_TRAITS = [
  { value: 'resilient', label: 'Resilient' },
  { value: 'grounded', label: 'Grounded' },
  { value: 'hopeful', label: 'Hopeful' },
  { value: 'confident', label: 'Confident' },
  { value: 'open', label: 'Open' },
  { value: 'brave', label: 'Brave' },
  { value: 'gentle', label: 'Gentle' },
  { value: 'authentic', label: 'Authentic' },
  { value: 'present', label: 'Present' },
  { value: 'free', label: 'Free' },
];

export const CREATOR_VARIANTS: QuestionVariant[] = [
  {
    id: 'name',
    question: "What's your name?",
    displayPrefix: "Created By",
    options: []
  },
  {
    id: 'sign-off',
    question: "How do you want to sign off?",
    displayPrefix: "Signed",
    options: [
      { value: 'your-fav', label: 'Your Favorite Child', emoji: '👶' },
      { value: 'bestie', label: 'Your Bestie', emoji: '👯' },
      { value: 'admirer', label: 'Secret Admirer', emoji: '🫣' },
    ]
  },
  {
    id: 'message',
    question: "Leave a short dedication",
    displayPrefix: "Dedication",
    options: [
      { value: 'love', label: 'With all my love', emoji: '❤️' },
      { value: 'proud', label: 'So proud of you', emoji: '🌟' },
    ]
  }
];

export interface ThemeConfig {
  id: Theme;
  label: string;
  emoji: string;
  isDark?: boolean;
  styles: {
    '--background': string;
    '--foreground': string;
    '--primary': string;
    '--accent': string;
    '--glow': string;
    '--ring': string;
    [key: string]: string;
  };
  gradient?: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'blue',
    label: 'Ocean Eyes',
    emoji: '🌊',
    isDark: false,
    styles: {
      '--background': '210 40% 98%',
      '--foreground': '222 47% 11%',
      '--primary': '221 83% 53%',
      '--accent': '199 89% 48%',
      '--glow': '221 83% 53%',
      '--ring': '221 83% 53%',
    },
    gradient: 'radial-gradient(circle at 50% 0%, hsl(221 83% 53% / 0.35), transparent 70%)'
  },
  {
    id: 'gold',
    label: 'Golden Hour',
    emoji: '✨',
    isDark: true,
    styles: {
      '--background': '20 14% 4%',
      '--foreground': '60 9% 96%',
      '--primary': '45 93% 47%',
      '--accent': '40 100% 60%',
      '--glow': '45 93% 47%',
      '--ring': '45 93% 47%',
    },
    gradient: 'radial-gradient(circle at 50% 0%, hsl(45 93% 47% / 0.15), transparent 70%)'
  },
  {
    id: 'purple',
    label: 'Lavender Haze',
    emoji: '💜',
    isDark: true,
    styles: {
      '--background': '265 48% 5%',
      '--foreground': '210 40% 98%',
      '--primary': '263 70% 50%',
      '--accent': '280 65% 60%',
      '--glow': '263 70% 50%',
      '--ring': '263 70% 50%',
    },
    gradient: 'radial-gradient(circle at 50% 0%, hsl(263 70% 50% / 0.2), transparent 70%)'
  },
  {
    id: 'pink',
    label: 'Hot Pink',
    emoji: '💖',
    isDark: false,
    styles: {
      '--background': '330 30% 98%',
      '--foreground': '330 60% 10%',
      '--primary': '330 81% 60%',
      '--accent': '320 70% 55%',
      '--glow': '330 81% 60%',
      '--ring': '330 81% 60%',
    },
    gradient: 'radial-gradient(circle at 50% 0%, hsl(330 81% 60% / 0.25), transparent 70%)'
  },
  {
    id: 'orange',
    label: 'Burnt Orange',
    emoji: '🧡',
    isDark: true,
    styles: {
      '--background': '20 30% 10%',
      '--foreground': '25 20% 95%',
      '--primary': '25 95% 50%',
      '--accent': '35 100% 60%',
      '--glow': '25 95% 50%',
      '--ring': '25 95% 50%',
    },
    gradient: 'radial-gradient(circle at 50% 0%, hsl(25 95% 50% / 0.25), transparent 70%)'
  },
  {
    id: 'green',
    label: 'Brat Green',
    emoji: '💚',
    isDark: false,
    styles: {
      '--background': '140 20% 97%',
      '--foreground': '145 60% 10%',
      '--primary': '142 71% 45%',
      '--accent': '150 60% 40%',
      '--glow': '142 71% 45%',
      '--ring': '142 71% 45%',
    },
    gradient: 'radial-gradient(circle at 50% 0%, hsl(142 71% 45% / 0.25), transparent 70%)'
  },
];


