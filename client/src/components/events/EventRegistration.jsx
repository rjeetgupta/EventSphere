import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { fetchEventById, registerForEvent, cancelRegistration } from '@/store/eventSlice';

const EventRegistration = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedEvent: event, loading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchEventById(eventId));
  }, [dispatch, eventId]);

  const isRegistered = event?.registeredUsers?.some((registeredUser) => registeredUser._id === user?._id);
  const isRegistrationOpen = event && new Date() < new Date(event.registrationDeadline) && event.status === 'upcoming';
  const isFull = event && event.registeredUsers?.length >= event.capacity;

  const handleRegister = async () => {
    try {
      await dispatch(registerForEvent(eventId)).unwrap();
      toast.success('Successfully registered for the event!');
      dispatch(fetchEventById(eventId));
    } catch (error) {
      toast.error(error || 'Failed to register for the event');
    }
  };

  const handleCancelRegistration = async () => {
    try {
      await dispatch(cancelRegistration(eventId)).unwrap();
      toast.success('Successfully cancelled registration!');
      dispatch(fetchEventById(eventId));
    } catch (error) {
      toast.error(error || 'Failed to cancel registration');
    }
  };

  if (loading || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
              <CardDescription className="mt-2">{event.description}</CardDescription>
            </div>
            <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
              {event.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>{event.registeredUsers?.length || 0} / {event.capacity} participants</span>
            </div>
            <div className="pt-4">
              {!user ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Please log in to register for this event</p>
                  <Button onClick={() => navigate('/login')} className="mt-2">
                    Login
                  </Button>
                </div>
              ) : isRegistered ? (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <p className="text-green-500 font-medium">You are registered for this event</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={handleCancelRegistration} 
                    disabled={loading} 
                    className="w-full"
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
                <Button onClick={handleRegister} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Register for Event'
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventRegistration; 