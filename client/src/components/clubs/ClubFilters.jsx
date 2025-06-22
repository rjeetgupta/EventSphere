import { useState } from 'react';
import { Search, Users, MapPin } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEPARTMENTS } from '@/constants/departments';

const ClubFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    memberCount: '',
  });

  const handleChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      department: '',
      memberCount: '',
    });
    onFilter({});
  };

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clubs..."
                value={filters.search}
                onChange={(e) => handleChange('search', e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Department</label>
            <Select
              value={filters.department}
              onValueChange={(value) => handleChange('department', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Member Count</label>
            <div className="relative">
              <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Select
                value={filters.memberCount}
                onValueChange={(value) => handleChange('memberCount', value)}
              >
                <SelectTrigger className="pl-8">
                  <SelectValue placeholder="Filter by member count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-10">0-10 members</SelectItem>
                  <SelectItem value="11-50">11-50 members</SelectItem>
                  <SelectItem value="51-100">51-100 members</SelectItem>
                  <SelectItem value="100+">100+ members</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Apply Filters
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClubFilters; 