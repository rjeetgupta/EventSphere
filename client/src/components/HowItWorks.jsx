// components/HowItWorks.jsx
import React from 'react';

const HowItWorks = () => {
    return (
        <section className="bg-muted/50 py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold mb-4 leading-tight">How It Works</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Discover, participate, and manage campus events effortlessly with our easy-to-use platform.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-12">
                    {[
                        {
                            step: "1",
                            title: "Browse Events",
                            description: "Explore exciting upcoming events across all departments and clubs."
                        },
                        {
                            step: "2",
                            title: "Register & Participate",
                            description: "Quickly sign up for the events you're interested in, within a few clicks."
                        },
                        {
                            step: "3",
                            title: "Track & Manage",
                            description: "Manage your registrations and keep track of event details with ease."
                        }
                    ].map((item, index) => (
                        <div
                            key={index}
                            className="bg-background rounded-2xl p-8 text-center shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-sm"
                        >
                            <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                                <span className="text-primary text-3xl font-bold">{item.step}</span>
                            </div>
                            <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                            <p className="text-muted-foreground text-base leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
