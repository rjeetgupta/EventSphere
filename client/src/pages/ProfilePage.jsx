import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { toast } from "sonner"
import { getEvents } from '@/services/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, PenSquare, MailOpen, Book, Bookmark, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [attendedEvents, setAttendedEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const allEvents = await getEvents();
        
        // Filter for registered events
        const userRegisteredEvents = allEvents.filter(event => 
          event.attendees.some(attendee => attendee.id === user.id)
        );
        
        // Filter for attended events
        const userAttendedEvents = allEvents.filter(event => 
          event.attendees.some(attendee => attendee.id === user.id && attendee.attended)
        );
        
        setEvents(allEvents);
        setRegisteredEvents(userRegisteredEvents);
        setAttendedEvents(userAttendedEvents);
      } catch (error) {
        console.error('Error fetching events', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load events. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, toast]);

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
        <p className="mb-8 text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Manage your profile and settings</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground mb-2">{user.email}</p>
              <Badge className="mb-4 capitalize">{user.role}</Badge>
              
              {user.department && (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Book className="h-4 w-4" />
                  <span>{user.department}</span>
                  {user.year && <span>· Year {user.year}</span>}
                </div>
              )}
              
              <div className="flex items-center gap-8 mt-6 text-center">
                <div>
                  <div className="text-2xl font-bold">{registeredEvents.length}</div>
                  <div className="text-xs text-muted-foreground">Registered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{attendedEvents.length}</div>
                  <div className="text-xs text-muted-foreground">Attended</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="outline" className="w-full">
                <PenSquare className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="registered">
            <TabsList className="mb-8">
              <TabsTrigger value="registered">
                <Bookmark className="h-4 w-4 mr-2" />
                Registered Events
              </TabsTrigger>
              <TabsTrigger value="attended">
                <CheckCircle className="h-4 w-4 mr-2" />
                Attended Events
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="registered">
              {loading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : registeredEvents.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 pb-12 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <MailOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No registered events</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't registered for any events yet.
                    </p>
                    <Button asChild>
                      <Link to="/events">Browse Events</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {registeredEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto relative overflow-hidden">
                            <img 
                              src={event.image} 
                              alt={event.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge variant="secondary" className="bg-primary/90 text-primary-foreground hover:bg-primary/90">
                                {event.department}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-6 md:w-3/4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                              <h3 className="font-semibold text-lg mb-2 md:mb-0">{event.title}</h3>
                              <div className="flex items-center gap-4">
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {format(new Date(event.date), 'MMM dd, yyyy')}
                                </div>
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <div className="text-sm flex items-center text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.venue}
                              </div>
                              <div className="text-sm flex items-center text-muted-foreground">
                                <Users className="h-3 w-3 mr-1" />
                                {event.currentParticipants}/{event.maxParticipants}
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button variant="outline" asChild>
                                <Link to={`/events/${event.id}`}>View Details</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="attended">
              {loading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : attendedEvents.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 pb-12 text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No attended events</h3>
                    <p className="text-muted-foreground mb-6">
                      You haven't attended any events yet.
                    </p>
                    <Button asChild>
                      <Link to="/events">Browse Events</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {attendedEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/4 h-48 md:h-auto relative overflow-hidden">
                            <img 
                              src={event.image} 
                              alt={event.title} 
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-4 left-4">
                              <Badge variant="secondary" className="bg-primary/90 text-primary-foreground hover:bg-primary/90">
                                {event.department}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-6 md:w-3/4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                              <h3 className="font-semibold text-lg mb-2 md:mb-0">{event.title}</h3>
                              <div className="flex items-center gap-4">
                                <div className="text-sm text-muted-foreground flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {format(new Date(event.date), 'MMM dd, yyyy')}
                                </div>
                              </div>
                            </div>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mb-4">
                              <div className="text-sm flex items-center text-muted-foreground">
                                <MapPin className="h-3 w-3 mr-1" />
                                {event.venue}
                              </div>
                              <div className="text-sm flex items-center text-muted-foreground">
                                <Users className="h-3 w-3 mr-1" />
                                {event.currentParticipants}/{event.maxParticipants}
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <Button variant="outline" asChild>
                                <Link to={`/events/${event.id}`}>View Details</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
