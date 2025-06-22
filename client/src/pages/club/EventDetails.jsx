import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // TODO: Fetch event details
        const mockEvent = {
          _id: eventId,
          title: 'Sample Event',
          description: 'This is a sample event description that provides more details about the event.',
          date: new Date(),
          time: '14:00',
          location: 'Room 101',
          capacity: 50,
          registeredAttendees: 25,
          registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: 'upcoming',
          organizer: {
            name: 'John Doe',
            email: 'john@example.com',
          },
        };
        setEvent(mockEvent);
        setIsRegistered(false); // TODO: Check if user is registered
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleRegister = async () => {
    try {
      // TODO: Register for event API call
      setIsRegistered(true);
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const handleCancelRegistration = async () => {
    try {
      // TODO: Cancel registration API call
      setIsRegistered(false);
    } catch (error) {
      console.error('Error canceling registration:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <h3 className="text-lg font-medium mb-2">Event Not Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/events')}>Back to Events</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                  <Badge
                    variant={
                      event.status === 'upcoming'
                        ? 'default'
                        : event.status === 'ongoing'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </Badge>
                </div>
                {user?.role === 'CLUB_MANAGER' && (
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/events/${eventId}/edit`)}
                  >
                    Edit Event
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-muted-foreground">{event.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{format(event.date, 'PPP')}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    <span>
                      {event.registeredAttendees} / {event.capacity} registered
                    </span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Event Organizer</h3>
                  <div className="flex items-center">
                    <User className="h-8 w-8 text-muted-foreground mr-3" />
                    <div>
                      <p className="font-medium">{event.organizer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.organizer.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    Registration closes on{' '}
                    {format(event.registrationDeadline, 'PPP')}
                  </span>
                </div>

                {event.registeredAttendees >= event.capacity ? (
                  <div className="text-center py-4">
                    <p className="text-red-500 font-medium">Event is Full</p>
                  </div>
                ) : isRegistered ? (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <p className="text-green-500 font-medium">
                        You are registered for this event
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleCancelRegistration}
                    >
                      Cancel Registration
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleRegister}
                    disabled={event.registeredAttendees >= event.capacity}
                  >
                    Register for Event
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 