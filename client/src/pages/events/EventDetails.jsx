import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ROLES } from '@/constants/roles';

import { fetchEventById, deleteEvent, registerForEvent, cancelRegistration } from '@/store/eventSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { containerVariants, itemVariants } from '@/components/events/constants';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const event = useSelector((state) => state.events.selectedEvent);
  const loading = useSelector((state) => state.events.loading);
  const error = useSelector((state) => state.events.error);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteEvent(event._id)).unwrap();
      toast.success('Event deleted successfully');
      navigate('/events');
    } catch (error) {
      toast.error(error.message || 'Failed to delete event');
    }
  };

  const handleRegister = async () => {
    try {
      await dispatch(registerForEvent(event._id)).unwrap();
      toast.success('Successfully registered for the event');
      dispatch(fetchEventById(id));
    } catch (error) {
      toast.error(error.message || 'Failed to register for the event');
    }
  };

  const handleCancelRegistration = async () => {
    try {
      await dispatch(cancelRegistration(event._id)).unwrap();
      toast.success('Successfully cancelled registration');
      dispatch(fetchEventById(id));
    } catch (error) {
      toast.error(error.message || 'Failed to cancel registration');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Error loading event: {error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center text-muted-foreground p-4">
        <p>Event not found.</p>
      </div>
    );
  }

  const canManageEvent = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CLUB_MANAGER].includes(user?.role);
  const canRegister = [ROLES.STUDENT, ROLES.CLUB_MANAGER].includes(user?.role);
  const isRegistered = event.registeredUsers?.some((registeredUser) => registeredUser._id === user?._id);
  const isRegistrationOpen = event && new Date() < new Date(event.registrationDeadline) && event.status === 'upcoming';
  const isFull = event && event.registeredUsers?.length >= event.capacity;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto py-8"
    >
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">{event.title}</CardTitle>
                <p className="text-muted-foreground mt-2">{event.description}</p>
              </div>
              {canManageEvent && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate(`/events/${event._id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the event.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{event.venue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{event.registeredUsers?.length || 0} / {event.capacity} participants</span>
                </div>
                {event.club && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Organized by:</span>
                    <span className="font-medium">{event.club.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Registration</h3>
                
                {!user ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Please log in to register for this event</p>
                    <Button onClick={() => navigate('/login')} className="mt-2">
                      Login
                    </Button>
                  </div>
                ) : !canRegister ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Only students can register for events</p>
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
                      disabled={loading}
                    >
                      Cancel Registration
                    </Button>
                  </div>
                ) : !isRegistrationOpen ? (
                  <div className="text-center py-4">
                    <p className="text-red-500 font-medium">Registration is closed</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Registration deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                    </p>
                  </div>
                ) : isFull ? (
                  <div className="text-center py-4">
                    <p className="text-red-500 font-medium">Event is Full</p>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleRegister}
                    disabled={loading}
                  >
                    Register for Event
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default EventDetails; 