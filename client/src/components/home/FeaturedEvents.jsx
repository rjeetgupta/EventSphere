import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { containerVariants, itemVariants } from './constants';

const FeaturedEvents = ({ events = [] }) => {
  // If no events, show a placeholder
  if (events.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Featured Events</h2>
            <p className="text-muted-foreground">No featured events available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 px-4"
        >
          <h2 className="text-3xl font-bold text-foreground">Featured Events</h2>
          <Button variant="ghost" className="gap-2 text-primary hover:text-primary/80" asChild>
            <Link to="/events">
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4"
        >
          {events.map(event => (
            <motion.div key={event._id || event.id} variants={itemVariants} className="w-full">
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="aspect-video relative overflow-hidden group">
                  <img
                    src={event.imageUrl || 'https://source.unsplash.com/featured/?event'}
                    alt={event.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <Badge className="absolute top-4 right-4 bg-background/90 text-foreground hover:bg-background">
                    {event.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground line-clamp-2">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3  ">{event.description.length > 45 ? event.description.substring(0, 45) + '...' : event.description}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{event.venue || event.location}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to={`/events/${event._id || event.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedEvents; 