import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { FaBriefcase, FaCheckCircle, FaUser } from 'react-icons/fa'

const RecruiterDashboard = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        applicants: 0
    });

    const [recentApplicants, setRecentApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const fetchData = async () => {
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const jobsRes = await axios.get(
                `${backendUrl}/api/jobs/recruiter-jobs`,
                config
            );

            const jobs = jobsRes.data.jobs || [];

            const totalJobs = jobs.length;
            const activeJobs = jobs.filter(job => job.status === "open").length;

            const totalApplicants = jobs.reduce((acc, job) => {
                return acc + (job.applicants || 0);
            }, 0);

            setStats({
                totalJobs,
                activeJobs,
                applicants: totalApplicants
            });

            const recent = [];

            for (let job of jobs.slice(0, 3)) {

                // SKIP deleted jobs
                if (job.isDeleted) continue;

                const res = await axios.get(
                    `${backendUrl}/api/applications/job/${job._id}`,
                    config
                );

                const apps = res.data.applications || [];

                if (apps.length > 0) {
                    recent.push({
                        name: apps[0].user?.name,
                        job: job.title
                    });
                }
            }
            setRecentApplicants(recent);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='space-y-6'>

            {/* TITLE */}
            <h1 className='text-2xl font-semibold text-gray-800'>
                Recruiter Dashboard
            </h1>

            {/* ---------------- STATS (ALWAYS VISIBLE) ---------------- */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>

                {/* Total Jobs */}
                <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-md flex items-center gap-4'>
                    <FaBriefcase className='text-3xl' />
                    <div>
                        <p>Total Jobs</p>
                        <h3 className='text-2xl font-bold'>
                            {loading ? "0" : stats.totalJobs}
                        </h3>
                    </div>
                </div>

                {/* Active Jobs */}
                <div className='bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md flex items-center gap-4'>
                    <FaCheckCircle className='text-3xl' />
                    <div>
                        <p>Active Jobs</p>
                        <h3 className='text-2xl font-bold'>
                            {loading ? "0" : stats.activeJobs}
                        </h3>
                    </div>
                </div>

                {/* Applicants */}
                <div className='bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-md flex items-center gap-4'>
                    <FaUser className='text-3xl' />
                    <div>
                        <p>Applicants</p>
                        <h3 className='text-2xl font-bold'>
                            {loading ? "0" : stats.applicants}
                        </h3>
                    </div>
                </div>

            </div>

            {/* ---------------- RECENT APPLICATIONS ---------------- */}
            <div className='bg-white p-6 rounded-xl shadow border'>
                <h2 className='text-lg font-semibold mb-4'>Recent Applications</h2>

                <div className='space-y-3'>

                    {loading ? (
                        <>
                            <div className="animate-pulse flex justify-between">
                                <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
                                <div className="h-4 bg-gray-300 w-1/4 rounded"></div>
                            </div>
                            <div className="animate-pulse flex justify-between">
                                <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
                                <div className="h-4 bg-gray-300 w-1/4 rounded"></div>
                            </div>
                            <div className="animate-pulse flex justify-between">
                                <div className="h-4 bg-gray-300 w-1/3 rounded"></div>
                                <div className="h-4 bg-gray-300 w-1/4 rounded"></div>
                            </div>
                        </>
                    ) : recentApplicants.length === 0 ? (
                        <p className='text-gray-500'>No recent applications yet.</p>
                    ) : (
                        recentApplicants.map((app, index) => (
                            <div
                                key={index}
                                className='flex justify-between items-center border-b pb-2'
                            >
                                <p className='text-gray-700 font-medium'>
                                    {app.name}
                                </p>
                                <p className='text-sm text-gray-500'>
                                    {app.job}
                                </p>
                            </div>
                        ))
                    )}

                </div>
            </div>

        </div>
    )
}

export default RecruiterDashboard