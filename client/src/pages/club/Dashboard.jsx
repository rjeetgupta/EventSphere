import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Bell } from "lucide-react";

const ClubDashboardPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Club Dashboard</h1>
        <Button>Create New Event</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">5</div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Club Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">87</div>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Event RSVPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">142</div>
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your next scheduled events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Club Meetup</h3>
                  <p className="text-sm text-muted-foreground">October 15, 2023 · 5:00 PM</p>
                  <p className="text-sm text-muted-foreground">Student Center, Room 202</p>
                </div>
                <div className="text-sm font-medium">32 RSVPs</div>
              </div>
              
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Guest Speaker: Industry Insights</h3>
                  <p className="text-sm text-muted-foreground">October 25, 2023 · 6:30 PM</p>
                  <p className="text-sm text-muted-foreground">Engineering Building, Auditorium</p>
                </div>
                <div className="text-sm font-medium">54 RSVPs</div>
              </div>
              
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">Workshop: Skills Development</h3>
                  <p className="text-sm text-muted-foreground">November 5, 2023 · 2:00 PM</p>
                  <p className="text-sm text-muted-foreground">Library, Conference Room</p>
                </div>
                <div className="text-sm font-medium">18 RSVPs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Announcements</CardTitle>
            <CardDescription>Important club updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium">Membership Renewal</h3>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
                <p className="text-sm">Don't forget to renew your club membership for the fall semester by October 31st.</p>
              </div>
              
              <div className="border-b pb-4">
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium">Leadership Positions Open</h3>
                  <span className="text-xs text-muted-foreground">1 week ago</span>
                </div>
                <p className="text-sm">We're looking for a new Events Coordinator and Treasurer. Apply by October 20th.</p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium">Facility Changes</h3>
                  <span className="text-xs text-muted-foreground">2 weeks ago</span>
                </div>
                <p className="text-sm">Our weekly meetings will now be held in Room 202 of the Student Center.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubDashboardPage;