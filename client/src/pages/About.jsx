import React from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Hero Section */}
            <Hero
                title="About Us"
                description="We are building a modern platform that connects talent with opportunities using smart AI-powered tools."
                showButtons={false}
            />

            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                {/* Text */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Our Mission
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Our mission is to simplify job searching and make hiring faster and smarter. We focus on creating a seamless experience for both job seekers and recruiters.
                    </p>

                    <p className="text-gray-600 leading-relaxed">
                        With features like AI recommendations, application tracking, and smart filters, we help you find the right job faster than ever.
                    </p>
                </div>

                {/* Image Card */}
                <div className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Why Choose Us?
                    </h3>
                    <ul className="space-y-3 text-gray-600 text-sm">
                        <li>✔ AI-powered resume feedback</li>
                        <li>✔ Easy application tracking system</li>
                        <li>✔ Clean and modern UI experience</li>
                        <li>✔ Trusted by growing professionals</li>
                    </ul>
                </div>

            </div>

            {/* Stats Section */}
            <div className="bg-white py-16 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">

                    <div className="p-6 border rounded-lg shadow-md">
                        <h3 className="text-3xl font-bold text-blue-600">10K+</h3>
                        <p className="text-gray-600 mt-2">Jobs Listed</p>
                    </div>

                    <div className="p-6 border rounded-lg shadow-md">
                        <h3 className="text-3xl font-bold text-blue-600">5K+</h3>
                        <p className="text-gray-600 mt-2">Active Users</p>
                    </div>

                    <div className="p-6 border rounded-lg shadow-md">
                        <h3 className="text-3xl font-bold text-blue-600">2K+</h3>
                        <p className="text-gray-600 mt-2">Companies</p>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <Footer />

        </div>
    );
};

export default About;