import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HeroSection from './HeroSection';
import FeaturedEvents from './FeaturedEvents';
import Categories from './Categories';
import UpcomingEvents from './UpcomingEvents';
import { fetchEvents } from '@/store/eventSlice';
import { selectEvents, selectEventsLoading } from '@/store/eventSlice';

const Home = () => {
  const dispatch = useDispatch();
  // const events = useSelector(selectEvents);
  // const loading = useSelector(selectEventsLoading);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // useEffect(() => {
  //   // Fetch events from backend
  //   dispatch(fetchEvents());
  // }, [dispatch]);

  const dummyEvents = [
    { _id: '1', title: 'Tech Conference 2024', description: 'Annual tech conference with the best minds in the industry.', category: 'technical', date: '2024-08-15T09:00:00.000Z', location: 'Online', imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2062&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { _id: '2', title: 'Music Festival', description: 'A weekend of live music and fun.', category: 'cultural', date: '2024-09-01T14:00:00.000Z', location: 'City Park', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { _id: '3', title: 'University Hackathon', description: 'Compete and build amazing projects.', category: 'technical', date: '2024-09-10T10:00:00.000Z', location: 'Main Campus', imageUrl: 'https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { _id: '4', title: 'Sports Day', description: 'A day of various sports activities.', category: 'sports', date: '2024-09-20T08:00:00.000Z', location: 'University Stadium', imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { _id: '5', title: 'Art Exhibition', description: 'Showcasing the best art from students.', category: 'cultural', date: '2024-10-05T11:00:00.000Z', location: 'Art Gallery', imageUrl: 'https://images.unsplash.com/photo-1566954979172-eaba308acdf0?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { _id: '6', title: 'E-Sports Tournament', description: 'Gaming tournament with exciting prizes.', category: 'sports', date: '2024-10-15T18:00:00.000Z', location: 'Online', imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];

  const events = dummyEvents;
  const loading = false;

  // Filter events based on category
  const filteredEvents = events.filter(event => 
    selectedCategory === 'all' || event.category === selectedCategory
  );

  // Get featured events (first 3 events)
  const featuredEvents = events.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection />
      <FeaturedEvents events={featuredEvents} />
      <Categories 
        selectedCategory={selectedCategory} 
        onCategorySelect={setSelectedCategory} 
      />
      <UpcomingEvents events={filteredEvents} />
    </div>
  );
};

export default Home; 