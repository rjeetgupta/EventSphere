import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { fetchClubs } from '@/store/clubSlice';
import ClubCard from './ClubCard';
import ClubFilters from './ClubFilters';
import { containerVariants, itemVariants } from '../events/constants';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

const PAGE_SIZE = 10;

const ClubList = () => {
  const dispatch = useDispatch();
  const { clubs, loading, error, total, page, totalPages } = useSelector((state) => state.clubs);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchClubs({ page: currentPage, limit: PAGE_SIZE }));
  }, [dispatch, currentPage]);
  console.log(clubs)

  // clubs is the array if filtered, or an object with clubs property from API
  const clubsArray = Array.isArray(clubs)
    ? clubs
    : Array.isArray(clubs?.clubs)
      ? clubs.clubs
      : [];

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
        <p>Error loading clubs: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ClubFilters />
      {clubsArray.length === 0 ? (
        <div className="text-center text-muted-foreground p-4">
          <p>No clubs found.</p>
        </div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {clubsArray.map((club) => (
              <motion.div key={club._id} variants={itemVariants}>
                <ClubCard club={club} />
              </motion.div>
            ))}
          </motion.div>
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  aria-disabled={currentPage === 1}
                  tabIndex={currentPage === 1 ? -1 : 0}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  aria-disabled={currentPage === totalPages}
                  tabIndex={currentPage === totalPages ? -1 : 0}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
};

export default ClubList; 