import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLES, ROLE_LABELS } from "@/constants/authConstants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { changePassword } from "@/store/authSlice";
import { z } from "zod";
import { useForm } from "react-hook-form"
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  currentPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form definition
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleUpdateProfile = async (data) => {
    try {
      // Dispatch update profile API or thunk
      await dispatch(updateUserProfile(data)).unwrap();
      toast.success("Profile updated");
      setIsEditing(false);
    } catch (err) {
      toast.error(err || "Failed to update profile");
    }
  };

  const handleUpdatePassword = async (values) => {
    try {
      await dispatch(changePassword(values)).unwrap();
      form.reset();
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>

          <Tabs defaultValue="personal" className="mt-6">
            <TabsList>
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={user.name} disabled={!isEditing} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled={!isEditing} />
                  </div>
                </div>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
              </div>
            </TabsContent>

            <TabsContent value="security">
              <form onSubmit={form.handleSubmit(handleUpdatePassword)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    {...form.register("currentPassword")}
                  />
                  {form.formState.errors.currentPassword && (
                    <p className="text-sm text-red-500">{form.formState.errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    {...form.register("newPassword")}
                  />
                  {form.formState.errors.newPassword && (
                    <p className="text-sm text-red-500">{form.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    {...form.register("confirmPassword")}
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </TabsContent>

          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile; 