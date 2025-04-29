// components/JoinUs.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const JoinUs = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-4xl font-extrabold mb-6 leading-tight">Ready to Join?</h2>
        <p className="text-lg max-w-2xl mx-auto mb-10 opacity-90">
          Create your account to register for exciting events, manage your participation seamlessly, and stay connected with all campus happenings.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link to="/register">
              Sign Up Now
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10" asChild>
            <Link to="/login">
              Log In
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JoinUs;
