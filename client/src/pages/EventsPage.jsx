// src/pages/EventsPage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMockData } from '@/services/api';
import { 
  Calendar,
  Search,
  Filter,
  MapPin,
  Users,
  Clock,
  Tag,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsData, departmentsData] = await Promise.all([
          getMockData({
            department: selectedDepartment || undefined,
            status: selectedStatus || undefined,
            search: searchQuery || undefined,
          }),
          getDepartments(),
        ]);
        setEvents(eventsData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDepartment, selectedStatus, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('');
    setSelectedStatus('upcoming');
    setCurrentPage(1);
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
        <p className="text-muted-foreground">
          Browse and register for upcoming events across campus
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-sm p-6 sticky top-24">
            <div className="mb-6">
              <h3 className="font-medium mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </h3>

              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Department
                  </label>
                  <Select
                    value={selectedDepartment}
                    onValueChange={(value) => setSelectedDepartment(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Event Status
                  </label>
                  <Select
                    value={selectedStatus}
                    onValueChange={(value) => setSelectedStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleClearFilters}
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            <div>
              <h3 className="font-medium mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["Technology", "Cultural", "Sports", "Academic", "Workshop", "Competition"].map(tag => (
                  <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-muted">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="grid" className="mb-8">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground">
                {events.length} events found
              </div>
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <TabsContent value="grid" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentEvents.map((event) => (
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
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                              {event.title}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="text-xs px-2 py-1 rounded bg-muted">
                                  {event.venue}
                                </div>
                              </div>
                              <div className="text-primary flex items-center text-sm font-medium">
                                View details
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="list" className="mt-6">
                  <div className="space-y-4">
                    {currentEvents.map((event) => (
                      <Link key={event.id} to={`/events/${event.id}`}>
                        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              <div className="md:w-1/4 h-48 md:h-auto relative overflow-hidden">
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                  <div className="inline-block bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                                    {event.department}
                                  </div>
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
                                    <div className="text-sm text-muted-foreground flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {event.time}
                                    </div>
                                  </div>
                                </div>
                                <p className="text-muted-foreground text-sm mb-4">{event.description}</p>
                                <div className="flex flex-wrap items-center gap-4">
                                  <div className="text-sm flex items-center text-muted-foreground">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {event.venue}
                                  </div>
                                  <div className="text-sm flex items-center text-muted-foreground">
                                    <Users className="h-3 w-3 mr-1" />
                                    {event.currentParticipants}/{event.maxParticipants}
                                  </div>
                                  <div className="text-sm flex items-center text-muted-foreground">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {event.tags.join(', ')}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              </>
            )}

            {!loading && events.length > 0 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) =>
                    page === 'ellipsis' ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
