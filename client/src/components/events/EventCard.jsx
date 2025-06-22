import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Image as ImageIcon } from 'lucide-react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { itemVariants } from './constants';

const EventCard = ({ event }) => {
  // Check if imageUrl is valid (not a blob URL and not empty)
  const isValidImageUrl = event.imageUrl && 
    !event.imageUrl.startsWith('blob:') && 
    event.imageUrl !== '';

  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full flex flex-col">
        <div className="h-48 relative overflow-hidden bg-gray-100">
          {isValidImageUrl ? (
            <img
              src={event.imageUrl}
              alt={event.title ? `${event.title} event` : 'Event image'}
              className="object-cover w-full h-full rounded-t-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`w-full h-full rounded-t-lg flex items-center justify-center ${
              isValidImageUrl ? 'hidden' : 'flex'
            }`}
          >
            <div className="text-center text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No image available</p>
            </div>
          </div>
        </div>
        <CardContent className="flex-grow p-4">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">{event.title}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>{event.registeredUsers ? event.registeredUsers.length : 0} registered</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button asChild className="w-full">
            <Link to={`/events/${event._id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default EventCard; 