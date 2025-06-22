import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaRegClock } from 'react-icons/fa';

const AboutPage = () => {
  const eventHighlights = [
    { icon: <FaCalendarAlt className="w-8 h-8" />, title: "Date", value: "July 15-17, 2025" },
    { icon: <FaMapMarkerAlt className="w-8 h-8" />, title: "Location", value: "Marwari College Campus" },
    { icon: <FaUsers className="w-8 h-8" />, title: "Participants", value: "1000+ Students" },
    { icon: <FaRegClock className="w-8 h-8" />, title: "Duration", value: "3 Days" }
  ];

  const eventFeatures = [
    { title: "Workshops", description: "Hands-on sessions with industry experts.", icon: "💻" },
    { title: "Hackathon", description: "36-hour coding marathon.", icon: "⌨️" },
    { title: "Guest Lectures", description: "Talks from tech entrepreneurs.", icon: "🎤" },
    { title: "Project Expo", description: "Showcase of student projects.", icon: "🏆" },
    { title: "Tech Quiz", description: "Test your technical knowledge.", icon: "🧠" },
    { title: "Career Fair", description: "Connect with top companies.", icon: "🤝" }
  ];

  const eventTags = [
    { label: "Innovation", lightClass: "bg-indigo-100 text-indigo-800", darkClass: "dark:bg-indigo-900 dark:text-indigo-200" },
    { label: "Learning", lightClass: "bg-purple-100 text-purple-800", darkClass: "dark:bg-purple-900 dark:text-purple-200" },
    { label: "Networking", lightClass: "bg-blue-100 text-blue-800", darkClass: "dark:bg-blue-900 dark:text-blue-200" },
    { label: "Competitions", lightClass: "bg-green-100 text-green-800", darkClass: "dark:bg-green-900 dark:text-green-200" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:text-5xl">
          About <span className="text-indigo-600 dark:text-indigo-400">TechFest 2025</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          The annual technology festival of Marwari College, bringing together innovators, creators, and tech enthusiasts.
        </p>
      </div>

      {/* Event Highlights */}
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
        {eventHighlights.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="text-indigo-600 dark:text-indigo-400 mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{item.value}</p>
          </div>
        ))}
      </div>

      {/* About Content */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden mb-16">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/3">
            <img 
              className="h-full w-full object-cover dark:brightness-75" 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" 
              alt="College students at event" 
            />
          </div>
          <div className="p-8 md:w-2/3">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              TechFest began in 2010 as a small departmental event and has since grown into the premier tech festival 
              of our region. What started with just 50 participants now attracts over 1000 attendees annually.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our mission is to provide a platform for students to showcase their technical skills, learn from industry 
              experts, and network with like-minded individuals.
            </p>
            <div className="flex flex-wrap gap-4">
              {eventTags.map((tag, index) => (
                <span 
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${tag.lightClass} ${tag.darkClass}`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Features */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Event Highlights</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {eventFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto bg-gray-600 dark:bg-gray-800 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to Join Us?</h2>
        <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
          Register now to be part of the most exciting tech event of the year. Limited seats available!
        </p>
        <button className="bg-white text-indigo-600 dark:bg-indigo-100 dark:text-indigo-800 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 dark:hover:bg-indigo-200 transition-colors">
          Register Now
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
