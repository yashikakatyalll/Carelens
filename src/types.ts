export type TriageLevel = 'low' | 'medium' | 'high';

export interface UserProfile {
  age: string;
  gender: string;
  race: string;
  healthHistory: string;
}

export interface SymptomData {
  painLevel: number;
  duration: string;
  symptoms: string[];
  additionalInfo: string;
}

export interface TriageResult {
  level: TriageLevel;
  confidence: number;
  explanation: string;
  recommendation: string;
  nextSteps: string[];
  suggestedAction: string;
}

export interface SkincareResult {
  condition: string;
  analysis: string;
  routine: string[];
  productCategories: string[];
}

export interface ScanHistory {
  id: string;
  timestamp: number;
  type: 'triage' | 'skincare';
  imageUrl: string;
  result: TriageResult | SkincareResult;
  symptoms?: SymptomData;
}

export interface Clinic {
  name: string;
  type: string;
  distance: string;
  address: string;
  uri: string;
  waitTime?: string;
}

export interface EducationResource {
  title: string;
  description: string;
  category: string;
  link: string;
  image: string;
}

export const SYMPTOMS_LIST = [
  'Fever',
  'Swelling',
  'Bleeding',
  'Itching',
  'Redness',
  'Pus/Discharge',
  'Numbness',
  'Spreading',
  'Warmth',
  'Dizziness'
];

export const EDUCATION_RESOURCES: EducationResource[] = [
  {
    title: "First Aid for Minor Burns",
    description: "Learn how to treat first-degree burns at home and when to see a doctor.",
    category: "First Aid",
    link: "https://www.redcross.org/get-help/how-to-prepare-for-emergencies/types-of-emergencies/burns.html",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Identifying Common Skin Rashes",
    description: "A guide to recognizing eczema, psoriasis, and allergic reactions.",
    category: "Dermatology",
    link: "https://www.aad.org/public/diseases/rashes",
    image: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "When to Visit the ER vs. Urgent Care",
    description: "Understanding the difference can save you time and money.",
    category: "Health Tips",
    link: "https://www.mountsinai.org/health-library/self-care-instructions/when-to-use-the-emergency-room-or-urgent-care",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Sun Protection 101",
    description: "Why SPF matters and how to choose the right sunscreen for your skin type.",
    category: "Prevention",
    link: "https://www.skincancer.org/skin-cancer-prevention/sun-protection/",
    image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Mental Health Check-in",
    description: "Simple daily practices to maintain emotional well-being and reduce stress.",
    category: "Wellness",
    link: "https://www.mhanational.org/taking-care-your-mental-health",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400"
  },
  {
    title: "Healthy Sleep Habits",
    description: "Tips for better sleep hygiene and why rest is crucial for recovery.",
    category: "Lifestyle",
    link: "https://www.sleepfoundation.org/sleep-hygiene",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=400"
  }
];
