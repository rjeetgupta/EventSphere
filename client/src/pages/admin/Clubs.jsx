import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar } from "lucide-react";
import { getUsers, getClubs, assignManagerToClub } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AssignManagerModal from '@/components/admin/AssignManagerModal';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/authSlice';
import { toast } from 'sonner';

const AdminClubsPage = () => {
  const admin = useSelector(selectCurrentUser);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [clubsList, setClubsList] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (admin?.departmentName) {
      getClubs({ departmentName: admin.departmentName }).then(setClubsList);
    }
  }, [admin, refresh]);

  const handleOpenAssignModal = () => {
    setAssignModalOpen(true);
  };

  const handleAssigned = () => {
    setRefresh(r => !r);
    toast.success('Club manager assigned successfully!');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Club Management</h1>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Club
        </Button>
      </div>
      <div className="mb-6 flex justify-end">
        <Button variant="outline" onClick={handleOpenAssignModal}>Assign Manager</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubsList.map((club, index) => (
          <motion.div
            key={club._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{club.name}</h3>
                <p className="text-sm text-gray-500">{club.category}</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {club.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Members</p>
                <p className="text-lg font-semibold text-gray-900">{club.membersCount || club.members}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Events</p>
                <p className="text-lg font-semibold text-gray-900">{club.eventsHosted || club.events}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleOpenAssignModal}>Assign Manager</Button>
              <Button variant="outline" className="flex-1">Edit</Button>
            </div>
            {club.manager && (
              <div className="mt-2 text-sm text-gray-700">Manager: {club.manager.name}</div>
            )}
          </motion.div>
        ))}
      </div>
      <AssignManagerModal open={assignModalOpen} onClose={() => setAssignModalOpen(false)} onAssigned={handleAssigned} />
    </div>
  );
};

export default AdminClubsPage;