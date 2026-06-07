import React from 'react'
import Hero from '../components/Hero';
import Footer from '../components/Footer';

const Landing = ({ setAuthOpen, setAuthType }) => {
    return (
        <div className='min-h-screen bg-gray-50'>

            {/* hero section */}
            <Hero
                title="Find Your Dream Job Easily"
                description="Explore thousands of job opportunities and apply with ease using our modern job portal."
                showButtons={true}
                setAuthOpen={setAuthOpen}
                setAuthType={setAuthType}
            />

            {/* cards-section */}
            <div className='px-6 py-16 bg-gray-50'>
                <h2 className='text-2xl font-semibold text-center text-gray-800 mb-10'>Why Choose Our Platform?</h2>

                {/* cards */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto'>

                    {/* card-1 */}
                    <div className='bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2 text-center'>Easy Job Search</h3>
                        <p className='text-gray-600 text-md text-center'>Explore relevant job opportunities with smart filters for location, role, and experience level.
                        </p>
                    </div>

                    <div className='bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2 text-center'>Track Applications</h3>
                        <p className='text-gray-600 text-md text-center'>Manage your applications in one place and stay updated on their progress effortlessly.</p>
                    </div>

                    <div className='bg-white p-5 rounded-xl shadow-md border hover:shadow-lg transition'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-2 text-center'>AI Career Guidance</h3>
                        <p className='text-gray-600 text-md text-center'>Get personalized insights, resume tips, and job recommendations powered by AI.
                        </p>
                    </div>

                </div>

            </div>

            {/* Footer */}
            <Footer />

        </div>
    )
}

export default Landing
