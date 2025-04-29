import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Users, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMockData } from '@/services/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const Home = () => {
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

  const renderEventsList = (list) => {
    if (loading) {
      return (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (list.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No events found</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((event) => (
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

        <div className="container mx-auto max-w-4xl relative z-10 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 [text-shadow:_0_2px_10px_rgb(0_0_0_/_20%)]">
            Campus Events Management
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Discover, participate, and manage all the events happening across your campus in one place.
          </p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 justify-center">
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
    </div>
  );
};

export default Home;
