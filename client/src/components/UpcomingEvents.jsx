import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

const UpcomingEvents = ({ events = [] }) => {
  const [activeTab, setActiveTab] = useState('all');

  // Dummy Events Array
  const dummyEvents = [
    {
      id: 'dummy1',
      title: 'Tech Conference 2024',
      description: 'Explore the future of tech with industry leaders.',
      date: '2024-06-10',
      venue: 'Main Auditorium',
      image: 'https://source.unsplash.com/featured/?conference',
      currentParticipants: 50,
      maxParticipants: 100,
    },
    {
      id: 'dummy2',
      title: 'Art & Culture Fest',
      description: 'Celebrate diversity with art and cultural events.',
      date: '2024-06-15',
      venue: 'Cultural Hall',
      image: 'https://source.unsplash.com/featured/?art',
      currentParticipants: 30,
      maxParticipants: 60,
    },
    {
      id: 'dummy3',
      title: 'Entrepreneurship Bootcamp',
      description: 'Learn how to start your own business in 3 days.',
      date: '2024-06-20',
      venue: 'Room 302',
      image: 'https://source.unsplash.com/featured/?startup',
      currentParticipants: 40,
      maxParticipants: 50,
    },
  ];

  // Card Generator
  const renderEventsList = (eventList) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {eventList.map((event) => (
        <Link to={`/events/${event.id}`} key={event.id}>
          <div className="border rounded-lg overflow-hidden shadow hover:shadow-md transition">
            <div className="aspect-video overflow-hidden">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {event.date}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {event.currentParticipants}/{event.maxParticipants}
                </span>
              </div>
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <div className="text-xs bg-muted inline-block px-2 py-1 rounded">
                {event.venue}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <section className="container px-4 sm:px-6 py-12 md:py-16 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">Upcoming Events</h2>
          <p className="text-muted-foreground text-lg">
            Discover and participate in exciting campus events
          </p>
        </div>
        <Button variant="outline" className="whitespace-nowrap px-6 py-2 h-auto" asChild>
          <Link to="/events" className="flex items-center gap-2">
            View All Events <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="space-y-8">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex justify-start p-0 border-b rounded-none gap-0">
            <TabsTrigger value="all" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background">All Categories</TabsTrigger>
            <TabsTrigger value="tech" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background">Technology</TabsTrigger>
            <TabsTrigger value="cultural" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background">Cultural</TabsTrigger>
            <TabsTrigger value="sports" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background">Sports</TabsTrigger>
            <TabsTrigger value="academic" className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background">Academic</TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <div className="pt-6">
            <TabsContent value="all">
              {renderEventsList([...events.slice(0, 6), ...dummyEvents])}
            </TabsContent>

            <TabsContent value="tech">
              {renderEventsList(events.filter(event =>
                event.tags.includes('Technology') ||
                event.tags.includes('Coding') ||
                event.department === 'Computer Science'
              ).slice(0, 6))}
            </TabsContent>

            <TabsContent value="cultural">
              {renderEventsList(events.filter(event =>
                event.tags.includes('Cultural') ||
                event.tags.includes('Arts') ||
                event.department === 'Cultural Affairs'
              ).slice(0, 6))}
            </TabsContent>

            <TabsContent value="sports">
              {renderEventsList(events.filter(event =>
                event.tags.includes('Sports') ||
                event.department === 'Physical Education'
              ).slice(0, 6))}
            </TabsContent>

            <TabsContent value="academic">
              {renderEventsList(events.filter(event =>
                event.tags.includes('Academic') ||
                event.tags.includes('Research') ||
                event.department === 'Research Cell'
              ).slice(0, 6))}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default UpcomingEvents;
