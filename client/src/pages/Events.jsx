import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Search, Filter, ChevronDown, Clock, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchEvents } from '@/store/eventSlice';
import { selectEvents, selectEventsLoading, selectEventsError } from '@/store/eventSlice';

const Events = () => {
  const dispatch = useDispatch();
  const events = useSelector(selectEvents);
  const loading = useSelector(selectEventsLoading);
  const error = useSelector(selectEventsError);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Filter events based on search, category, and status
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center text-red-500">
          <p>Error loading events: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600 mt-2">Discover and join exciting events</p>
        </div>
        <Button asChild>
          <Link to="/events/create">
            Create Event
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="academic">Academic</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredEvents.map((event) => (
              <motion.div
                key={event._id || event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                      <Badge variant="outline">{event.category}</Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                  </CardHeader>
                  
                  {/* Event Image */}
                  <div className="px-6 pb-3">
                    <div className="h-48 relative overflow-hidden bg-gray-100 rounded-lg">
                      {event.imageUrl && !event.imageUrl.startsWith('blob:') ? (
                        <img
                          src={event.imageUrl}
                          alt={event.title ? `${event.title} event` : 'Event image'}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-full h-full flex items-center justify-center ${
                          event.imageUrl && !event.imageUrl.startsWith('blob:') ? 'hidden' : 'flex'
                        }`}
                      >
                        <div className="text-center text-gray-500">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No image available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="pb-3">
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location || event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{event.currentParticipants || 0}/{event.maxParticipants || '∞'} participants</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link to={`/events/${event._id || event.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Events; 