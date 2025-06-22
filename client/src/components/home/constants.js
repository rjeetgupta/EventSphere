export const CATEGORIES = [
  { name: 'Academic', icon: '🎓', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
  { name: 'Cultural', icon: '🎭', color: 'bg-rose-50 text-rose-700 hover:bg-rose-100' },
  { name: 'Sports', icon: '⚽', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
  { name: 'Technical', icon: '💻', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
  { name: 'Workshops', icon: '🔧', color: 'bg-sky-50 text-sky-700 hover:bg-sky-100' },
  { name: 'Social', icon: '🎉', color: 'bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100' },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export const MOCK_FEATURED_EVENTS = [
  {
    id: 1,
    title: 'Annual Tech Fest',
    description: 'Join us for the biggest technical festival of the year',
    date: '2024-03-15',
    time: '10:00 AM',
    location: 'Main Auditorium',
    category: 'Technical',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: 2,
    title: 'Cultural Night',
    description: 'A night of music, dance, and cultural performances',
    date: '2024-03-20',
    time: '6:00 PM',
    location: 'Open Air Theatre',
    category: 'Cultural',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: 3,
    title: 'Sports Meet',
    description: 'Annual sports competition with various events',
    date: '2024-03-25',
    time: '9:00 AM',
    location: 'Sports Complex',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
];

export const MOCK_UPCOMING_EVENTS = [
  {
    id: 4,
    title: 'Workshop on AI',
    description: 'Learn the basics of Artificial Intelligence and Machine Learning',
    date: '2024-04-01',
    time: '2:00 PM',
    location: 'Computer Lab',
    category: 'Workshops',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: 5,
    title: 'Academic Seminar',
    description: 'Research presentation and discussion on latest academic developments',
    date: '2024-04-05',
    time: '11:00 AM',
    location: 'Conference Hall',
    category: 'Academic',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: 6,
    title: 'Social Mixer',
    description: 'Networking event for students and faculty',
    date: '2024-04-10',
    time: '5:00 PM',
    location: 'Student Center',
    category: 'Social',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
];

export const HERO_CONTENT = {
  title: 'Discover Campus Events',
  description: 'Connect, Learn, and Celebrate with Your College Community',
  backgroundImage: 'https://i.pinimg.com/736x/27/e5/9b/27e59b8dbca807695b75580cebb19289.jpg',
  buttons: {
    primary: {
      text: 'Browse Events',
      link: '/events',
    },
    secondary: {
      text: 'Get Started',
      link: '/register',
    },
  },
}; 