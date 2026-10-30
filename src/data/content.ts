import portfolioData from '@/data/portfolio.json';

export type CollectibleId = 'builder' | 'learner' | 'human' | 'dreamer';
export type SocialId = 'linkedin' | 'github' | 'leetcode';

export interface LinkItem {
  label: string;
  url: string;
  placeholder?: boolean;
}

export interface SocialLink extends LinkItem {
  id: SocialId;
}

export interface CodingProfile extends LinkItem {
  note?: string;
}

export interface Fact {
  label: string;
  value: string;
}

export interface PortfolioCard {
  title: string;
  meta?: string;
  body?: string;
  details?: string[];
  facts?: Fact[];
  tags?: string[];
  links?: LinkItem[];
  placeholder?: boolean;
}

export interface TagGroup {
  label: string;
  items: string[];
}

interface BaseBlock {
  heading: string;
  placeholder?: boolean;
}

export type PortfolioBlock =
  | (BaseBlock & { type: 'text'; body: string })
  | (BaseBlock & { type: 'cards'; items: PortfolioCard[] })
  | (BaseBlock & { type: 'bullets'; items: string[] })
  | (BaseBlock & { type: 'tagGroups'; groups: TagGroup[] })
  | (BaseBlock & { type: 'profiles' });

export interface PortfolioSection {
  id: CollectibleId;
  name: string;
  summary: string;
  intro: string;
  blocks: PortfolioBlock[];
}

export interface QAEntry {
  question: string;
  answer: string;
  placeholder: boolean;
}

interface SiteText {
  owner: string;
  ownerName: string;
  title: string;
  subtitle: string;
  tagline: string;
  footer: string;
  email: string;
  collectActionLabel: string;
}

interface PortfolioData {
  site: SiteText;
  socialLinks: SocialLink[];
  codingProfiles: CodingProfile[];
  collectibles: PortfolioSection[];
  qaEntries: QAEntry[];
}

const data = portfolioData as PortfolioData;

export const SITE_CONTENT = data.site;
export const SOCIAL_LINKS = data.socialLinks;
export const CODING_PROFILES = data.codingProfiles;
export const PORTFOLIO_SECTIONS = data.collectibles;
export const QA_ENTRIES = data.qaEntries;
export const COLLECTIBLE_ORDER: CollectibleId[] = PORTFOLIO_SECTIONS.map((section) => section.id);

export function getPortfolioSection(id: string): PortfolioSection | undefined {
  return PORTFOLIO_SECTIONS.find((section) => section.id === id);
}
