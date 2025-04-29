import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthProvider';
import { Calendar, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center py-12 md:py-20">
      <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-lg rounded-lg overflow-hidden">
        <div className="relative bg-primary text-primary-foreground md:w-1/2 p-8 flex flex-col justify-center">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1181529/pexels-photo-1181529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center opacity-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="h-8 w-8" />
              <span className="font-bold text-2xl">CampusEvents</span>
            </div>
            <h1 className="text-3xl font-bold mb-4">Welcome Back!</h1>
            <p className="mb-6">Log in to access your account and manage your events.</p>
            <div className="space-y-4">
              <Feature icon="clock" text="Access to all campus events" />
              <Feature icon="bolt" text="Quick event registration" />
              <Feature icon="check-circle" text="Participation tracking" />
            </div>
          </div>
        </div>

        <Card className="md:w-1/2 border-0 rounded-none shadow-none">
          <CardHeader className="pt-8">
            <CardTitle className="text-2xl">Login to your account</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>

                <div className="text-center text-sm mt-4">
                  <p className="text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary font-medium">
                      Register
                    </Link>
                  </p>
                </div>

                <div className="border-t pt-4 mt-6">
                  <p className="text-sm text-muted-foreground mb-2">Demo accounts:</p>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Admin:</span> admin@example.com / password</div>
                    <div><span className="font-medium">Club:</span> club@example.com / password</div>
                    <div><span className="font-medium">Student:</span> student@example.com / password</div>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Feature = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="bg-white/20 p-2 rounded-full">
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
    </div>
    <span>{text}</span>
  </div>
);

export default LoginPage;