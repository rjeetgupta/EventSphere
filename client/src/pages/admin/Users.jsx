import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Mail, Phone, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEPARTMENTS } from '@/constants/departments';

const Users = () => {
  const [users] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@college.edu',
      phone: '+1 234 567 890',
      role: 'student',
      department: 'Computer Science',
      status: 'active'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@college.edu',
      phone: '+1 234 567 891',
      role: 'faculty',
      department: 'Electrical Engineering',
      status: 'active'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@college.edu',
      phone: '+1 234 567 892',
      role: 'student',
      department: 'Mechanical Engineering',
      status: 'inactive'
    }
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                user.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                {user.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                {user.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <GraduationCap className="h-4 w-4 mr-2" />
                {user.department}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">View Profile</Button>
              <Button variant="outline" className="flex-1">Edit</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Users;