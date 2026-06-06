import React from "react";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const Contact = () => {
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Hero */}
            <Hero
                title="Contact Us"
                description="Have questions or feedback? We’re here to help you anytime."
                showButtons={false}
            />

            {/* Contact Section */}
            <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* Form */}
                <div className="bg-white p-6 rounded-xl shadow-md border">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Send Message
                    </h2>

                    <form className="space-y-4">

                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <textarea
                            rows="5"
                            placeholder="Your Message"
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>

                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 w-full"
                        >
                            Send Message
                        </button>

                    </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">

                    <div className="bg-white p-6 rounded-xl shadow-md border">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Email Support
                        </h3>
                        <p className="text-gray-600">support@jobportal.com</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Location
                        </h3>
                        <p className="text-gray-600">India</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md border">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Response Time
                        </h3>
                        <p className="text-gray-600">Within 24–48 hours</p>
                    </div>

                </div>

            </div>

            {/* footer */}
            <Footer />

        </div>
    );
};

export default Contact;