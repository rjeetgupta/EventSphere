import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users, Calendar } from "lucide-react";

const AdminClubsPage = () => {
  const approvedClubs = [
    { id: 1, name: "Computer Science Club", members: 120, events: 15, category: "Academic" },
    { id: 2, name: "Photography Society", members: 75, events: 8, category: "Art & Culture" },
    { id: 3, name: "Debate Club", members: 45, events: 6, category: "Academic" },
    { id: 4, name: "Chess Club", members: 30, events: 4, category: "Recreation" },
    { id: 5, name: "Dance Club", members: 95, events: 12, category: "Art & Culture" },
    { id: 6, name: "Entrepreneurship Club", members: 65, events: 10, category: "Career" }
  ];

  const pendingClubs = [
    { id: 7, name: "Film Appreciation Society", president: "Alex Chen", category: "Art & Culture", date: "2023-09-15" },
    { id: 8, name: "Robotics Club", president: "Maya Johnson", category: "Academic", date: "2023-09-18" }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Club Management</h1>
      </div>
      
      <Tabs defaultValue="approved" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="approved">Approved Clubs</TabsTrigger>
          <TabsTrigger value="pending">
            Pending Approval
            {pendingClubs.length > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingClubs.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="approved">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clubs..."
                className="pl-8"
              />
            </div>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Add Club
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedClubs.map((club) => (
              <Card key={club.id}>
                <CardHeader>
                  <CardTitle>{club.name}</CardTitle>
                  <CardDescription>{club.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users size={16} className="text-muted-foreground" />
                      <span>{club.members} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span>{club.events} events</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pending">
          {pendingClubs.length > 0 ? (
            <div className="space-y-4">
              {pendingClubs.map((club) => (
                <Card key={club.id}>
                  <CardHeader>
                    <CardTitle>{club.name}</CardTitle>
                    <CardDescription>Requested by {club.president} on {club.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Category: {club.category}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">View Application</Button>
                    <Button variant="destructive">Reject</Button>
                    <Button>Approve</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No pending club applications.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminClubsPage;