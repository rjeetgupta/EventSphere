import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2 } from 'lucide-react';
import { ROLES } from '@/constants/roles';

import { fetchClubById, deleteClub } from '@/store/clubSlice';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import ClubDetails from '@/components/clubs/ClubDetails';

const ClubDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedClub: club } = useSelector((state) => state.clubs);

  useEffect(() => {
    dispatch(fetchClubById(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    try {
      await dispatch(deleteClub(id)).unwrap();
      navigate('/clubs');
    } catch (error) {
      console.error('Error deleting club:', error);
    }
  };

  const canEdit = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CLUB_MANAGER].includes(user?.role);
  const canDelete = [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(user?.role);

  return (
    <div className="container mx-auto py-8">
      {(canEdit || canDelete) && (
        <div className="flex justify-end gap-4 mb-8">
          {canEdit && (
            <Button
              variant="outline"
              onClick={() => navigate(`/clubs/${id}/edit`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Club
            </Button>
          )}
          {canDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Club
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the
                    club and all its associated data.
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
          )}
        </div>
      )}

      <ClubDetails />
    </div>
  );
};

export default ClubDetailsPage; 