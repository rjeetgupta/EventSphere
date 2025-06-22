import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Calendar, MapPin } from 'lucide-react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { itemVariants } from '@/components/events/constants';

const ClubCard = ({ club }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full flex flex-col">
        <div className="h-48 relative overflow-hidden">
          <img
            src={club.imageUrl || '/images/club-placeholder.jpg'}
            alt={club.name ? `${club.name} club` : 'Club image'}
            className="object-cover w-full h-full rounded-t-lg"
            onError={(e) => {
              e.target.src = '/images/club-placeholder.jpg';
              e.target.alt = 'Club placeholder image';
            }}
          />
        </div>
        <CardContent className="flex-grow p-4">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">{club.name}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-2">{club.description}</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>{club.members?.length || 0} members</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{club.events?.length || 0} events</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="line-clamp-1">{club.department}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button asChild className="w-full">
            <Link to={`/clubs/${club._id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ClubCard; 