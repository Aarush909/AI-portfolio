import { PortfolioData } from '../types';

export const defaultPortfolioData: PortfolioData = {
  category: 'CREATIVE PORTFOLIO',
  name: 'AARUSH GAIKWAD',
  firstName: 'AARUSH',
  lastName: 'GAIKWAD',
  greeting: "HELLO, I'M",
  coverDescription:
    'Building things that make the internet feel a little less ordinary.',
  bioDescription:
    "I'm a frontend web designer who loves building immersive, interactive digital experiences that blend design, motion, and technology. I focus on crafting visually striking websites with smooth animations, thoughtful details, and clean interfaces.",
  email: 'aarykg2012@gmail.com',
  website: 'aarykg2012@gmail.com',
  handle: 'aarush.gaikwad.09',
  address: '',
  skills: {
    highlightSkills: [],
    categories: [
      {
        id: 'cat-1',
        name: 'Languages',
        items: [
          'HTML',
          'CSS',
          'Java Script',
          'C++ OOP',
          'React',
          'Next.js',
          'GSAP',
          'Three.js',
        ],
      },
      {
        id: 'cat-2',
        name: 'Designing',
        items: [
          'Adobe Creative Suite',
          'Figma',
          'Blender',
          'Framer',
        ],
      },
    ],
  },
  education: [
    {
      id: 'edu-1',
      institution: 'The Universal School',
      period: '(2015 - 2024)',
      description: '10th percentage - 87%',
    },
    {
      id: 'edu-2',
      institution: 'Vidyalankar Polytechnic',
      period: '',
      description: 'Ongoing.',
    },
  ],
};
