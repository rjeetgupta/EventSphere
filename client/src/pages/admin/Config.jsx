import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DEPARTMENTS } from '@/constants/departments';

const Config = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    departments: [],
    clubCategories: [],
    maxEventParticipants: 100,
    allowStudentRegistration: true,
    requireEmailVerification: true,
    maintenanceMode: false,
    systemAnnouncement: '',
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      // TODO: Replace with your actual API call
      const response = await fetch('/api/admin/config', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      toast.error('Failed to fetch system configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // TODO: Replace with your actual API call
      await fetch('/api/admin/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(config)
      });
      toast.success('Configuration saved successfully');
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>
            Manage system-wide settings and configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Departments */}
            <div className="space-y-2">
              <Label>Departments</Label>
              <Textarea
                value={config.departments.join('\n')}
                onChange={(e) => setConfig({
                  ...config,
                  departments: e.target.value.split('\n').filter(dept => dept.trim())
                })}
                placeholder="Enter departments (one per line)"
                className="h-32"
              />
            </div>

            {/* Club Categories */}
            <div className="space-y-2">
              <Label>Club Categories</Label>
              <Textarea
                value={config.clubCategories.join('\n')}
                onChange={(e) => setConfig({
                  ...config,
                  clubCategories: e.target.value.split('\n').filter(cat => cat.trim())
                })}
                placeholder="Enter club categories (one per line)"
                className="h-32"
              />
            </div>

            {/* Max Event Participants */}
            <div className="space-y-2">
              <Label>Maximum Event Participants</Label>
              <Input
                type="number"
                value={config.maxEventParticipants}
                onChange={(e) => setConfig({
                  ...config,
                  maxEventParticipants: parseInt(e.target.value)
                })}
                min="1"
              />
            </div>

            {/* System Announcement */}
            <div className="space-y-2">
              <Label>System Announcement</Label>
              <Textarea
                value={config.systemAnnouncement}
                onChange={(e) => setConfig({
                  ...config,
                  systemAnnouncement: e.target.value
                })}
                placeholder="Enter system-wide announcement"
                className="h-32"
              />
            </div>

            {/* Toggle Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Allow Student Registration</Label>
                <Switch
                  checked={config.allowStudentRegistration}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    allowStudentRegistration: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Require Email Verification</Label>
                <Switch
                  checked={config.requireEmailVerification}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    requireEmailVerification: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Maintenance Mode</Label>
                <Switch
                  checked={config.maintenanceMode}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    maintenanceMode: checked
                  })}
                />
              </div>
            </div>

            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Config; 