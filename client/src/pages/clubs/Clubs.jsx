import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { fetchClubs } from '@/store/clubSlice';
import { Button } from '@/components/ui/button';
import ClubList from '@/components/clubs/ClubList';
import { ROLES } from '@/constants/roles';

const Clubs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchClubs());
  }, [dispatch]);

  const canCreateClub = user && (user.role === ROLES.SUPER_ADMIN || user.role === ROLES.ADMIN);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Clubs</h1>
          <p className="text-muted-foreground mt-2">
            Discover and join clubs at your university
          </p>
        </div>
        {canCreateClub && (
          <Button asChild>
            <Link to="/clubs/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Club
            </Link>
          </Button>
        )}
      </div>

      <ClubList />
    </div>
  );
};

export default Clubs; 