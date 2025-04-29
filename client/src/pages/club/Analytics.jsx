import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ClubAnalyticsPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Club Analytics</h1>
        
        <Select defaultValue="last3months">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lastmonth">Last month</SelectItem>
            <SelectItem value="last3months">Last 3 months</SelectItem>
            <SelectItem value="last6months">Last 6 months</SelectItem>
            <SelectItem value="year">This year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Event Attendees</CardTitle>
            <CardDescription>+22% from last semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <CardDescription>+5% from last semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Member Growth</CardTitle>
            <CardDescription>+15% from last semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="attendance" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Event Attendance</CardTitle>
              <CardDescription>Number of attendees at each event</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Bar chart would go here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="demographics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Member Year Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Pie chart would go here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Member Major Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <p className="text-muted-foreground">Pie chart would go here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Member Engagement</CardTitle>
              <CardDescription>How frequently members attend events</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Chart visualization would go here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Event Popularity</CardTitle>
          <CardDescription>Most popular events based on attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Guest Speaker: Industry Insights</p>
                <p className="text-sm text-muted-foreground">54 attendees</p>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Fundraiser</p>
                <p className="text-sm text-muted-foreground">78 attendees</p>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Welcome Back Social</p>
                <p className="text-sm text-muted-foreground">45 attendees</p>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Club Meetup</p>
                <p className="text-sm text-muted-foreground">32 attendees</p>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubAnalyticsPage;