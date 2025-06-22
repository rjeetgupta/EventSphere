import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Settings, Calendar, Mail } from 'lucide-react';

import { fetchClubById, updateClub } from '@/store/clubSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { containerVariants, itemVariants } from '@/components/events/constants';

const ClubManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedClub: club, loading, error } = useSelector((state) => state.clubs);
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch club details if not already loaded
    if (!club) {
      dispatch(fetchClubById(user.clubId));
    }
  }, [dispatch, user, club, navigate]);

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      name: formData.get('name'),
      description: formData.get('description'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      website: formData.get('website'),
    };

    try {
      await dispatch(updateClub({ id: club._id, ...updatedData })).unwrap();
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Error updating club:', error);
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
        <p>Error loading club: {error}</p>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="text-center text-muted-foreground p-4">
        <p>Club not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto py-8"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Club Management</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Club Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateSettings} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Club Name</label>
                      <Input
                        name="name"
                        defaultValue={club.name}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        name="description"
                        defaultValue={club.description}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        name="email"
                        type="email"
                        defaultValue={club.email}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        name="phone"
                        type="tel"
                        defaultValue={club.phone}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Website</label>
                      <Input
                        name="website"
                        type="url"
                        defaultValue={club.website}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Club Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {club.members?.map((member) => (
                    <motion.div
                      key={member._id}
                      variants={itemVariants}
                      className="flex items-center gap-3 p-3 rounded-lg border"
                    >
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.role}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Club Events</CardTitle>
              </CardHeader>
              <CardContent>
                {club.events?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {club.events.map((event) => (
                      <motion.div
                        key={event._id}
                        variants={itemVariants}
                        className="p-4 rounded-lg border"
                      >
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    No events found.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default ClubManagement; 