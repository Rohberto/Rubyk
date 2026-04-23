export interface QuizOption {
  label: string
  score: number
}

export interface QuizQuestion {
  id:       number
  category: string
  question: string
  options:  QuizOption[]
}

export interface QuizResult {
  tier:        string
  range:       [number, number]
  headline:    string
  description: string
  strengths:   string[]
  gaps:        string[]
  cta:         string
  color:       string
}

export const questions: QuizQuestion[] = [
  {
    id: 1,
    category: 'Clarity',
    question: 'Can you explain what your startup does in one sentence without using the word "platform", "solution", or "ecosystem"?',
    options: [
      { label: 'Not really. It usually takes a few sentences and some back-and-forth', score: 1 },
      { label: "Yes, but I'm not totally happy with how it sounds", score: 2 },
      { label: "Yes. It's clear, specific, and people get it immediately", score: 3 },
    ],
  },
  {
    id: 2,
    category: 'Origin',
    question: "When you tell investors why you started this company, what's their typical reaction?",
    options: [
      { label: "They nod politely but don't seem particularly moved", score: 1 },
      { label: 'They find it interesting, but the conversation moves on quickly', score: 2 },
      { label: 'They lean in. It creates a moment of real connection', score: 3 },
    ],
  },
  {
    id: 3,
    category: 'Investor Narrative',
    question: 'How do you open your investor pitch?',
    options: [
      { label: 'With a slide about the market size or the problem statement', score: 1 },
      { label: 'With a surprising fact or statistic about the space', score: 2 },
      { label: 'With a specific scene, moment, or story that puts the investor in the world', score: 3 },
    ],
  },
  {
    id: 4,
    category: 'Customer Messaging',
    question: 'How would your best customer describe your product to a friend?',
    options: [
      { label: "I'm not sure. I've never really asked them", score: 1 },
      { label: "I have a rough idea, but it's not something we've aligned on", score: 2 },
      { label: "I know exactly. We've documented it, and it shapes our messaging", score: 3 },
    ],
  },
  {
    id: 5,
    category: 'Differentiation',
    question: 'What makes your company different from competitors?',
    options: [
      { label: "We're faster, cheaper, or better. Our product speaks for itself", score: 1 },
      { label: 'We have a unique approach, but I struggle to articulate it compellingly', score: 2 },
      { label: 'We have a distinct point of view that no competitor owns, and we say it publicly', score: 3 },
    ],
  },
  {
    id: 6,
    category: 'Content & Thought Leadership',
    question: 'How consistently does your company publish content that reflects your expertise?',
    options: [
      { label: "Rarely or never. We're too focused on building the product", score: 1 },
      { label: 'Occasionally, when we have time or something major happens', score: 2 },
      { label: 'Regularly. We have a clear voice and a cadence that builds trust over time', score: 3 },
    ],
  },
  {
    id: 7,
    category: 'Brand Voice',
    question: "If your brand were a person, how clearly defined is their personality?",
    options: [
      { label: "We haven't really thought about it in those terms", score: 1 },
      { label: "We have a rough sense of tone, but it's not documented or consistent", score: 2 },
      { label: 'We have a clear, documented voice. Our team knows how to write and speak on-brand', score: 3 },
    ],
  },
  {
    id: 8,
    category: 'The Big Picture',
    question: 'How well can you articulate where your company will be in 7 years, and why the world needs it to get there?',
    options: [
      { label: "I have a general direction but haven't put it into words clearly", score: 1 },
      { label: 'I have a vision, but it tends to sound generic when I say it out loud', score: 2 },
      { label: "I can paint a vivid, specific picture, and it makes people want to be part of it", score: 3 },
    ],
  },
  {
    id: 9,
    category: 'Proof Points',
    question: 'When you talk about traction or results, how do you present them?',
    options: [
      { label: 'I share the numbers. Revenue, users, growth rate', score: 1 },
      { label: 'I share the numbers with some context about what they mean', score: 2 },
      { label: 'I use the numbers to tell a story. What changed, for whom, and why it matters', score: 3 },
    ],
  },
  {
    id: 10,
    category: 'Emotional Resonance',
    question: 'After a pitch or sales conversation, what do people typically say?',
    options: [
      { label: '"That\'s interesting" or "We\'ll think about it"', score: 1 },
      { label: '"This is impressive." Focused on the product or metrics', score: 2 },
      { label: '"I believe in what you\'re building." They\'re sold on you, not just the idea', score: 3 },
    ],
  },
]

export const results: QuizResult[] = [
  {
    tier:        'Emerging',
    range:       [10, 16],
    headline:    'Your story is waiting to be told',
    description: "You have something real to build on, but right now, your narrative isn't doing justice to what you're actually building. The good news: this is fixable, and the impact is immediate. Most founders in this range see a dramatic shift once they invest in getting the story right.",
    strengths:   ["You're focused on building the product", 'You have real experience to draw from'],
    gaps:        ['Narrative clarity and the one-sentence pitch', 'Investor storytelling structure', 'Brand voice and consistency'],
    cta:         'Book a free discovery call',
    color:       '#7A6252',
  },
  {
    tier:        'Developing',
    range:       [17, 22],
    headline:    "You have the ingredients — not yet the recipe",
    description: "You're thinking about storytelling and doing some things right. But the pieces aren't yet working together as a cohesive narrative. There's a gap between how good your company is and how well you communicate that. Closing this gap is where the biggest returns are.",
    strengths:   ['You understand the importance of narrative', 'Some clear messaging exists'],
    gaps:        ['Connecting your origin story to your vision', 'Consistent voice across all touchpoints', 'Making proof points land emotionally'],
    cta:         'Book a free discovery call',
    color:       '#E8632A',
  },
  {
    tier:        'Compelling',
    range:       [23, 27],
    headline:    "Your story is working. Now sharpen it",
    description: "You're telling a compelling story, and it's opening doors. Investors get it, customers respond, and your brand has a real identity. The next level is about refinement, making the narrative tighter, more distinctive, and more consistent across every surface.",
    strengths:   ['Strong core narrative', 'Investors and customers respond well', 'Emerging brand voice'],
    gaps:        ['Differentiating more sharply from competitors', 'Building a thought leadership engine', 'Owning a specific point of view publicly'],
    cta:         'Get the free storytelling guide',
    color:       '#1a9e6e',
  },
  {
    tier:        'Magnetic',
    range:       [28, 30],
    headline:    "You're already doing this, so go further",
    description: "Your story is sharp, consistent, and emotionally resonant. People don't just understand what you're building. They believe in it. At this level, the work is about scale: building systems that let your narrative grow with the company without losing its edge.",
    strengths:   ['Clear, compelling narrative across all contexts', 'Strong brand voice and thought leadership', 'Emotional resonance in investor conversations'],
    gaps:        ['Systematising the story for a growing team', 'Building a content engine at scale', 'Owning your category narrative publicly'],
    cta:         'Get the free storytelling guide',
    color:       '#185fa5',
  },
]

export function getResult(score: number): QuizResult {
  return results.find(r => score >= r.range[0] && score <= r.range[1]) ?? results[0]
}

export const CALENDLY_URL = 'https://calendly.com/victory-rubyk'
export const GUIDE_URL    = '/guide'