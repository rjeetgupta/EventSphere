import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DEPARTMENTS } from '@/constants/departments';

const UpcomingEvents = ({ events = [] }) => {
  const [activeTab, setActiveTab] = useState('all');

  // Card Generator
  const EventCard = ({ event }) => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={event.imageUrl || 'https://source.unsplash.com/featured/?event'}
          alt={event.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
            {event.title}
          </h3>
          <p className="text-white/90 text-sm line-clamp-2">
            {event.description}
          </p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{event.currentParticipants || 0}/{event.maxParticipants || event.capacity || '∞'}</span>
          </div>
        </div>
        
        <Button asChild className="w-full">
          <Link to={`/events/${event._id || event.id}`}>
            View Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );

  // Render events list
  const renderEventsList = (eventsList) => {
    if (eventsList.length === 0) {
      return (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Check back later for upcoming events</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsList.map((event) => (
          <EventCard key={event._id || event.id} event={event} />
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover exciting events happening in your college. From technical workshops to cultural celebrations, there's something for everyone.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="tech">Technical</TabsTrigger>
            <TabsTrigger value="cultural">Cultural</TabsTrigger>
            <TabsTrigger value="sports">Sports</TabsTrigger>
            <TabsTrigger value="academic">Academic</TabsTrigger>
          </TabsList>

          <div className="pt-6">
            <TabsContent value="all">
              {renderEventsList(events.slice(0, 6))}
            </TabsContent>

            <TabsContent value="tech">
              {renderEventsList(events.filter(event =>
                event.category === 'technical' ||
                event.category === 'Technology' ||
                event.tags?.includes('Technology') ||
                event.tags?.includes('Coding')
              ).slice(0, 6))}
            </TabsContent>

            <TabsContent value="cultural">
              {renderEventsList(events.filter(event =>
                event.category === 'cultural' ||
                event.category === 'Cultural' ||
                event.tags?.includes('Cultural') ||
                event.tags?.includes('Arts')
              ).slice(0, 6))}
            </TabsContent>

            <TabsContent value="sports">
              {renderEventsList(events.filter(event =>
                event.category === 'sports' ||
                event.category === 'Sports' ||
                event.tags?.includes('Sports')
              ).slice(0, 6))}
            </TabsContent>

            <TabsContent value="academic">
              {renderEventsList(events.filter(event =>
                event.category === 'academic' ||
                event.category === 'Academic' ||
                event.tags?.includes('Academic') ||
                event.tags?.includes('Research')
              ).slice(0, 6))}
            </TabsContent>
          </div>
        </Tabs>

        {events.length > 6 && (
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/events">
                View All Events
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;
