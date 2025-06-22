import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { getClubs, getUsers, assignManagerToClub } from '@/services/api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/authSlice';

const AssignManagerModal = ({ open, onClose, onAssigned }) => {
  const admin = useSelector(selectCurrentUser);
  const [clubs, setClubs] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      getClubs({ departmentName: admin?.departmentName }).then(data => {
        setClubs(Array.isArray(data?.data?.clubs) ? data.data.clubs : []);
      });
      getUsers({ departmentName: admin?.departmentName }).then(data => {
        setUsers(Array.isArray(data?.data) ? data.data : []);
      });
    }
  }, [open, admin]);

  const handleAssign = async () => {
    if (!selectedClubId || !selectedUserId) return;
    setLoading(true);
    await assignManagerToClub(selectedClubId, selectedUserId);
    setLoading(false);
    setSelectedClubId('');
    setSelectedUserId('');
    onAssigned && onAssigned();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Club Manager</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select value={selectedClubId} onValueChange={setSelectedClubId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Club" />
            </SelectTrigger>
            <SelectContent>
              {(Array.isArray(clubs) ? clubs : []).map(club => (
                <SelectItem key={club._id} value={club._id}>{club.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Manager (student in your department)" />
            </SelectTrigger>
            <SelectContent>
              {(Array.isArray(users) ? users : [])
                .filter(u => u.role === 'student' && u.departmentName === admin?.departmentName)
                .map(user => (
                  <SelectItem key={user._id} value={user._id}>{user.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={handleAssign} disabled={!selectedClubId || !selectedUserId || loading}>
            {loading ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignManagerModal; 