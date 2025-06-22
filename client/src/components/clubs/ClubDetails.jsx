import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Users, Calendar, MapPin, Mail, Phone, Globe } from 'lucide-react';

import { fetchClubById, joinClub, leaveClub } from '@/store/clubSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { containerVariants, itemVariants } from '../events/constants';
import { ROLES } from '@/constants/roles';

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedClub: club, loading, error } = useSelector((state) => state.clubs);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchClubById(id));
  }, [dispatch, id]);

  const handleJoinClub = () => {
    dispatch(joinClub(id));
  };

  const handleLeaveClub = () => {
    dispatch(leaveClub(id));
  };

  const isMember = club?.members?.some((member) => member._id === user?._id);
  const canJoinOrLeave = user && [ROLES.STUDENT, ROLES.CLUB_MANAGER].includes(user.role);

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
        <p>Error loading club details: {error}</p>
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
      className="space-y-6"
    >
      <Card>
        <CardHeader className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-t-lg" />
          <div className="relative">
            <CardTitle className="text-3xl font-bold">{club.name}</CardTitle>
            <p className="text-muted-foreground mt-2">{club.description}</p>
            <div className="mt-2 text-sm text-muted-foreground">Type: {club.type} | Department: {club.departmentName}</div>
            {club.manager && (
              <div className="mt-1 text-sm">Manager: {club.manager.name}</div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>{club.members?.length || 0} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{club.events?.length || 0} events</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{club.departmentName}</span>
              </div>
            </div>
            <div className="space-y-4">
              {club.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>{club.email}</span>
                </div>
              )}
              {club.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{club.phone}</span>
                </div>
              )}
              {club.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <a
                    href={club.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>

          {canJoinOrLeave && (
            <div className="flex gap-4">
              {isMember ? (
                <Button
                  variant="outline"
                  onClick={handleLeaveClub}
                  className="flex-1"
                >
                  Leave Club
                </Button>
              ) : (
                <Button onClick={handleJoinClub} className="flex-1">
                  Join Club
                </Button>
              )}
            </div>
          )}

          {club.members && club.members.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Members</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {club.members.map((member) => (
                  <motion.div
                    key={member._id}
                    variants={itemVariants}
                    className="flex items-center gap-2"
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
            </div>
          )}

          {club.events && club.events.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {club.events.map((event) => (
                  <div key={event._id} className="border rounded p-2">
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-muted-foreground">{event.date && new Date(event.date).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ClubDetails; 