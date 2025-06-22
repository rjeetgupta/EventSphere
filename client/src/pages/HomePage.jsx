import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, Clock, ArrowRight, Sparkles, Trophy, BookOpen, Music, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetEventsQuery } from '@/store/eventApi';
import { Skeleton } from '@/components/ui/skeleton';
import Home from '@/components/home/Home';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const categories = [
  { name: 'Academic', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
  { name: 'Sports', icon: Trophy, color: 'from-green-500 to-green-600' },
  { name: 'Cultural', icon: Music, color: 'from-purple-500 to-purple-600' },
  { name: 'Photography', icon: Camera, color: 'from-pink-500 to-pink-600' }
];

const EventCard = ({ event }) => (
  <motion.div
    key={event._id}
    variants={fadeIn}
    whileHover={{ y: -5 }}
    className="group"
  >
    <Card className="overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2">
            {event.description}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{event.attendees?.length || 0} attending</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const EventCardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <div className="flex gap-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

const HomePage = () => {
  return <Home />;
};

export default HomePage;