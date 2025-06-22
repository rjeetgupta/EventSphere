import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { fetchClubById } from '@/store/clubSlice';
import ClubForm from '@/components/clubs/ClubForm';

const EditClub = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedClub: club, loading } = useSelector((state) => state.clubs);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(fetchClubById(id));
  }, [dispatch, id, user, navigate]);

  useEffect(() => {
    if (club && club.owner?._id !== user?._id) {
      navigate('/clubs');
    }
  }, [club, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Club</h1>
        <ClubForm club={club} isEditing />
      </div>
    </div>
  );
};

export default EditClub; 