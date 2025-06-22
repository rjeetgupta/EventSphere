import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { containerVariants, itemVariants } from './constants';

const UpcomingEvents = ({ events }) => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <h2 className="text-3xl font-bold text-foreground">Upcoming Events</h2>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {events.map(event => {
            // Check if imageUrl is valid (not a blob URL and not empty)
            const isValidImageUrl = event.imageUrl && 
              !event.imageUrl.startsWith('blob:') && 
              event.imageUrl !== '';

            return (
              <motion.div key={event._id} variants={itemVariants} className="w-full">
                <Card className="overflow-hidden bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="aspect-video relative overflow-hidden group bg-gray-100">
                    {isValidImageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
                        isValidImageUrl ? 'hidden' : 'flex'
                      }`}
                    >
                      <div className="text-center text-gray-500">
                        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No image</p>
                      </div>
                    </div>
                    <Badge className="absolute top-4 right-4 bg-background/90 text-foreground hover:bg-background">
                      {event.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground line-clamp-2">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{event.description}</p>
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
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link to={`/events/${event._id}`}>View Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingEvents; 