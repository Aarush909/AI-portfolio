export interface EducationItem {
  id: string;
  institution: string;
  period: string;
  description: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  items: string[];
}

export interface PortfolioData {
  category: string;
  date?: string;
  name: string;
  firstName: string;
  lastName: string;
  greeting: string;
  coverDescription: string;
  bioDescription: string;
  email: string;
  website: string;
  handle: string;
  address: string;
  skills: {
    highlightSkills: string[];
    categories: SkillCategory[];
  };
  education: EducationItem[];
}
