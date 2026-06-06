import React from 'react'

const Footer = () => {
    return (
        <footer className='bg-gray-900 text-gray-300 px-6 py-10 mt-10'>
            <div className='max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>

                {/* logo & description*/}
                <div>
                    <h2 className='text-xl font-bold text-white mb-2'>Job Portal</h2>
                    <p className='text-sm text-gray-400'>Find jobs, track applications, and grow your career with AI-powered insights.</p>
                </div>

                <div>
                    {/* quick links */}
                    <h3 className='text-white font-semibold mb-3'>Quick Links</h3>
                    <ul className='space-y-2 text-sm'>
                        <li className='hover:text-white cursor-pointer'>Home</li>
                        <li className='hover:text-white cursor-pointer'>Jobs</li>
                        <li className='hover:text-white cursor-pointer'>Dashboard</li>
                    </ul>
                </div>

                {/* Features */}
                <div>
                    <h3 className='text-white font-semibold mb-3'>Features</h3>
                    <ul className='space-y-2 text-sm'>
                        <li className='hover:text-white cursor-pointer'>Job Search</li>
                        <li className='hover:text-white cursor-pointer'>Applications</li>
                        <li className='hover:text-white cursor-pointer'>Guidance</li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className='text-white font-semibold mb-3'>Contact</h3>
                    <p className='text-sm text-gray-400'>Email : support@jobportal.com</p>
                    <p className='text-sm text-gray-400'>Location : India</p>
                </div>
            </div>

            {/* Bottom Line */}
            <div className='border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500'>
                &copy; 2026 Job Portal. All rights reserved
            </div>

        </footer>

    )
}

export default Footer
