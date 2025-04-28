import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMockData } from '@/services/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const renderEventsList = (events) => {
    if (loading) {
      return (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No events found</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Link key={event.id} to={`/events/${event.id}`}>
            <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="inline-block bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                    {event.department}
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {event.currentParticipants}/{event.maxParticipants}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{event.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-xs px-2 py-1 rounded bg-muted">
                      {event.venue}
                    </div>
                  </div>
                  <div className="text-primary flex items-center text-sm font-medium">
                    View details
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20"></div>

        {/* Main Container: Flex for Centering */}
        <div className="container relative z-10 py-20 md:py-32 flex flex-col items-center text-center">

          {/* Title Section */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 [text-shadow:_0_2px_10px_rgb(0_0_0_/_20%)]">
            Campus Events Management
          </h1>

          {/* Description Section */}
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Discover, participate, and manage all the events happening across your campus in one place.
          </p>

          {/* Button Section */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/events">
                Browse Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10" asChild>
              <Link to="/register">
                Join Now
              </Link>
            </Button>
          </div>

          {/* Stats Grid Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 justify-center">
            {/* Event Stats Cards */}
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur">
              <div className="bg-white/20 p-3 rounded-full mb-3">
                <Calendar className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">200+</span>
              <span className="text-sm opacity-80">Events</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur">
              <div className="bg-white/20 p-3 rounded-full mb-3">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">5,000+</span>
              <span className="text-sm opacity-80">Participants</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur">
              <div className="bg-white/20 p-3 rounded-full mb-3">
                <Award className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">15+</span>
              <span className="text-sm opacity-80">Departments</span>
            </div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-white/10 backdrop-blur">
              <div className="bg-white/20 p-3 rounded-full mb-3">
                <Star className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">50+</span>
              <span className="text-sm opacity-80">Clubs</span>
            </div>
          </div>
        </div>
      </section>


      {/* Featured events section */}
      <section className="container px-4 sm:px-6 py-12 md:py-16 mx-auto">
  {/* Header Section */}
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
    <div className="space-y-2">
      <h2 className="text-3xl md:text-4xl font-bold">Upcoming Events</h2>
      <p className="text-muted-foreground text-lg">
        Discover and participate in exciting campus events
      </p>
    </div>
    <Button 
      variant="outline" 
      className="whitespace-nowrap px-6 py-2 h-auto"
      asChild
    >
      <Link to="/events" className="flex items-center gap-2">
        View All Events <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  </div>
  
  {/* Tabs Section */}
  <div className="space-y-8">
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full flex justify-start p-0 border-b rounded-none gap-0">
        <TabsTrigger 
          value="all" 
          className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
        >
          All Categories
        </TabsTrigger>
        <TabsTrigger 
          value="tech" 
          className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
        >
          Technology
        </TabsTrigger>
        <TabsTrigger 
          value="cultural" 
          className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
        >
          Cultural
        </TabsTrigger>
        <TabsTrigger 
          value="sports" 
          className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
        >
          Sports
        </TabsTrigger>
        <TabsTrigger 
          value="academic" 
          className="px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
        >
          Academic
        </TabsTrigger>
      </TabsList>

      {/* Tab Contents */}
      <div className="pt-6">
        <TabsContent value="all">
          {renderEventsList(events.slice(0, 6))}
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

      {/* How it works section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Discover, participate, and manage campus events effortlessly with our easy-to-use platform.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-12">
            {[
              {
                step: "1",
                title: "Browse Events",
                description: "Explore exciting upcoming events across all departments and clubs."
              },
              {
                step: "2",
                title: "Register & Participate",
                description: "Quickly sign up for the events you're interested in, within a few clicks."
              },
              {
                step: "3",
                title: "Track & Manage",
                description: "Manage your registrations and keep track of event details with ease."
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-background rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-sm"
              >
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary text-3xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-extrabold mb-6 leading-tight">Ready to Join?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-10 opacity-90">
            Create your account to register for exciting events, manage your participation seamlessly, and stay connected with all campus happenings.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">
                Sign Up Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10" asChild>
              <Link to="/login">
                Log In
              </Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;