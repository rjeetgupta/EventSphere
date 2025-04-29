import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getEventById,
  registerForEvent,
  cancelRegistration,
} from "@/services/api";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "sonner"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  Link as LinkIcon,
  Share2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const eventData = await getEventById(id);
        setEvent(eventData);

        if (user && eventData) {
          const registered = eventData.attendees.some(
            (attendee) => attendee.id === user.id
          );
          setIsRegistered(registered);
        }
      } catch (error) {
        console.error("Error fetching event", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event details. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user, toast]);

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!event) return;

    try {
      setRegistering(true);

      if (event.currentParticipants >= event.maxParticipants) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "This event has reached its maximum capacity.",
        });
        return;
      }

      const success = await registerForEvent(
        event.id,
        user.id,
        user.name,
        user.email
      );

      if (success) {
        setIsRegistered(true);
        setEvent((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentParticipants: prev.currentParticipants + 1,
            attendees: [
              ...prev.attendees,
              {
                id: user.id,
                name: user.name,
                email: user.email,
                attended: false,
                registrationDate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
              },
            ],
          };
        });
        toast({
          title: "Registration Successful",
          description: `You are now registered for ${event.title}.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "Failed to register for this event. Please try again.",
        });
      }
    } catch (error) {
      console.error("Registration error", error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setRegistering(false);
      setShowRegisterDialog(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!user || !event) return;

    try {
      setCanceling(true);

      const success = await cancelRegistration(event.id, user.id);

      if (success) {
        setIsRegistered(false);
        setEvent((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentParticipants: prev.currentParticipants - 1,
            attendees: prev.attendees.filter(
              (attendee) => attendee.id !== user.id
            ),
          };
        });
        toast({
          title: "Registration Canceled",
          description: `Your registration for ${event.title} has been canceled.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Cancellation Failed",
          description: "Failed to cancel your registration. Please try again.",
        });
      }
    } catch (error) {
      console.error("Cancellation error", error);
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setCanceling(false);
      setShowCancelDialog(false);
    }
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator
        .share({
          title: event?.title,
          text: event?.description,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Event link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="mb-8 text-muted-foreground">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/events")}>Browse Events</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="relative h-96 bg-gray-800 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        <div className="container relative h-full flex items-end pb-12">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant="secondary"
                className="bg-primary/90 text-primary-foreground hover:bg-primary/90"
              >
                {event.department}
              </Badge>
              {event.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="backdrop-blur bg-background/50"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(event.date), "EEEE, MMMM dd, yyyy")}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {event.time}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {event.venue}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {event.currentParticipants}/{event.maxParticipants} registered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content section */}
      <section className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                  About This Event
                </h2>
                <p className="text-muted-foreground whitespace-pre-line mb-6">
                  {event.description}
                </p>

                <Separator className="my-6" />

                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Date</div>
                      <div className="font-medium">
                        {format(new Date(event.date), "MMMM dd, yyyy")}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Time</div>
                      <div className="font-medium">{event.time}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Venue</div>
                      <div className="font-medium">{event.venue}</div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <h3 className="text-xl font-semibold mb-4">Organized By</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        event.organizer.type === "admin"
                          ? "https://images.pexels.com/photos/7148384/pexels-photo-7148384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                          : "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      }
                    />
                    <AvatarFallback>
                      {event.organizer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{event.organizer.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {event.department}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Registration</h3>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm">Registration Status</div>
                      <Badge
                        variant={
                          event.currentParticipants < event.maxParticipants
                            ? "success"
                            : "destructive"
                        }
                      >
                        {event.currentParticipants < event.maxParticipants
                          ? "Open"
                          : "Closed"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm">Available Spots</div>
                      <div className="font-medium">
                        {Math.max(
                          0,
                          event.maxParticipants - event.currentParticipants
                        )}{" "}
                        / {event.maxParticipants}
                      </div>
                    </div>

                    <div className="mt-6">
                      {!user ? (
                        <Button
                          className="w-full"
                          onClick={() => navigate("/login")}
                        >
                          Login to Register
                        </Button>
                      ) : isRegistered ? (
                        <>
                          <div className="flex items-center justify-center gap-2 p-2 bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-md mb-4">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              You are registered for this event
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full text-destructive hover:text-destructive"
                            onClick={() => setShowCancelDialog(true)}
                          >
                            Cancel Registration
                          </Button>
                        </>
                      ) : event.currentParticipants >= event.maxParticipants ? (
                        <Button disabled className="w-full">
                          Registration Full
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => setShowRegisterDialog(true)}
                        >
                          Register Now
                        </Button>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-4">Share This Event</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={shareEvent}
                        className="flex-1"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast({
                            title: "Link Copied",
                            description: "Event link copied to clipboard",
                          });
                        }}
                        className="flex-1"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for {event.title}</DialogTitle>
            <DialogDescription>
              You are about to register for this event. Please review the event
              details.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Event</span>
                <span className="font-medium">{event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{format(new Date(event.date), "MMMM dd, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span>{event.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Venue</span>
                <span>{event.venue}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRegisterDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRegister} disabled={registering}>
              {registering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Confirm Registration"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel registration dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your registration for{" "}
              {event.title}?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Registration
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelRegistration}
              disabled={canceling}
            >
              {canceling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Registration"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventDetailsPage;
