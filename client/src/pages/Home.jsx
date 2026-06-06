import React, { useEffect, useState } from 'react'
import JobCard from '../components/JobCard.jsx'
import ApplicationCard from '../components/ApplicationCard.jsx'
import axios from 'axios'

const Home = () => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [stats, setStats] = useState({
        totalJobs: 0,
        applications: 0,
        savedJobs: 0
    });

    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // ---------------- FETCH DATA ----------------
    const fetchData = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const [jobsRes, appRes, savedRes] = await Promise.all([
                axios.get(`${backendUrl}/api/jobs`, config),
                axios.get(`${backendUrl}/api/applications/my-applications`, config),
                axios.get(`${backendUrl}/api/jobs/saved-jobs`, config),
            ]);

            setStats({
                totalJobs: jobsRes.data.totalJobs || 0,
                applications: appRes.data.count || 0,
                savedJobs: savedRes.data.savedJobs?.length || 0
            });

            setApplications(appRes.data.applications || []);
            setJobs(jobsRes.data.jobs || []);

        } catch (error) {
            console.log("Dashboard error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='space-y-8'>

            {/* TITLE */}
            <h1 className='text-2xl font-semibold'>Dashboard</h1>

            {/* ---------------- TOP STATS ---------------- */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>

                <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-md'>
                    <p>Total Jobs</p>
                    <h2 className='text-3xl font-bold mt-2'>{stats.totalJobs}</h2>
                </div>

                <div className='bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-md'>
                    <p>My Applications</p>
                    <h2 className='text-3xl font-bold mt-2'>{stats.applications}</h2>
                </div>

                <div className='bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-md'>
                    <p>Saved Jobs</p>
                    <h2 className='text-3xl font-bold mt-2'>{stats.savedJobs}</h2>
                </div>

            </div>

            {/* ---------------- BOTTOM SECTION ---------------- */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

                {/* RECENT APPLICATIONS */}
                <div className='bg-white p-6 rounded-xl shadow-sm border flex flex-col'>
                    <h2 className='text-lg font-semibold mb-4'>Recent Applications</h2>

                    <div className='space-y-3'>

                        {loading ? (
                            <>
                                <ApplicationCard loading />
                                <ApplicationCard loading />
                                <ApplicationCard loading />
                            </>
                        ) : applications.length === 0 ? (
                            <div className="flex items-center justify-center h-32  text-gray-500 text-md">
                                No recent applications found
                            </div>
                        ) : (
                            applications.slice(0, 3).map((app) => {
                                const jobDeleted = app.job?.isDeleted;

                                return (
                                    <ApplicationCard
                                        key={app._id}
                                        title={jobDeleted ? "Job Deleted" : app.job?.title}
                                        company={jobDeleted ? "N/A" : app.job?.createdBy?.companyName}
                                        date={new Date(app.createdAt).toLocaleDateString()}
                                        status={jobDeleted ? "Deleted" : app.status}
                                    />
                                );
                            })
                        )}

                    </div>
                </div>

                {/* RECOMMENDED JOBS */}
                <div className='bg-white p-6 rounded-xl shadow-sm border flex flex-col'>
                    <h2 className='text-lg font-semibold mb-4'>Recommended Jobs</h2>

                    <div className='space-y-4 max-h-[400px] overflow-y-auto'>

                        {loading ? (
                            <>
                                <JobCard loading />
                                <JobCard loading />
                                <JobCard loading />
                                <JobCard loading />
                            </>
                        ) : (
                            jobs.slice(0, 5).map((job) => (
                                <JobCard
                                    key={job._id}
                                    id={job._id}
                                    title={job.title}
                                    company={job.createdBy?.companyName}
                                    logo={job.createdBy?.companyLogo}
                                    location={job.location}
                                    salary={job.salary}
                                    type={job.jobType}
                                    isRemote={job.location?.toLowerCase().includes("remote")}
                                    isNew={true}
                                />
                            ))
                        )}

                    </div>

                </div>
            </div>

        </div>
    )
}

export default Home