import React, { useEffect, useState } from 'react'
import { useModal } from '../../context/modalContext'
import { FaTimes } from 'react-icons/fa'

import EditAboutModal from './userModal/EditAboutModal'
import EditProfileModal from './userModal/EditProfileModal'
import SkillsLangsModal from './userModal/SkillsLangsModal'
import EducationModal from './userModal/EducationModal'
import InternshipModal from './userModal/InternshipModal'
import ProjectModal from './userModal/ProjectModal'
import ResumeModal from './userModal/ResumeModal'
import CompanyModal from './userModal/CompanyModal'
import JobOverviewModal from './jobModal/JobOverviewModal'
import JobInfoModal from './jobModal/JobInfoModal'
import ApplyJobModal from './jobModal/ApplyJobModal'

const GlobalModal = () => {

    const { modalType, modalData, closeModal } = useModal()

    const [mounted, setMounted] = useState(false)
    const [show, setShow] = useState(false)
    const [activeType, setActiveType] = useState(null)

    useEffect(() => {

        if (modalType) {
            setActiveType(modalType)
            setMounted(true)

            const t = setTimeout(() => setShow(true), 10)
            return () => clearTimeout(t)

        } else {

            setShow(false)

            const t = setTimeout(() => {
                setMounted(false)
                setActiveType(null)
            }, 220)

            return () => clearTimeout(t)
        }

    }, [modalType])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* BACKDROP */}
            <div
                onClick={closeModal}
                className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200
                ${show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-5 pointer-events-none"}`}
            />

            {/* ANIMATION WRAPPER */}
            <div
                className={`relative w-full max-w-2xl max-h-[90vh]
                transition-all duration-200 ease-out will-change-transform
                ${show ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-5 pointer-events-none"}`}
            >

                {/* MODAL BOX */}
                <div className="bg-gray-200 rounded-xl shadow-2xl overflow-hidden flex flex-col relative">

                    {/* CLOSE BUTTON (fixed, never cropped) */}
                    <button
                        onClick={closeModal}
                        className="absolute top-3 right-3 z-50
                        bg-white shadow-md p-2 rounded-full
                        text-gray-600 hover:text-black"
                    >
                        <FaTimes />
                    </button>

                    {/* SCROLL AREA ONLY */}
                    <div className="overflow-y-auto max-h-[90vh] p-4 sm:p-6 pt-12">

                        {activeType === "editProfile" &&
                            <EditProfileModal modalData={modalData} closeModal={closeModal} />}

                        {activeType === "editAbout" &&
                            <EditAboutModal modalData={modalData} closeModal={closeModal} />}

                        {activeType === "editCompany" &&
                            <CompanyModal modalData={modalData} closeModal={closeModal} />}

                        {activeType === "editSkillsAndLangs" &&
                            <SkillsLangsModal modalData={modalData} closeModal={closeModal} />}

                        {(activeType === "addEducation" || activeType === "editEducation") &&
                            <EducationModal modalData={modalData} closeModal={closeModal} />}

                        {(activeType === "addInternship" || activeType === "editInternship") &&
                            <InternshipModal modalData={modalData} closeModal={closeModal} />}

                        {(activeType === "addProject" || activeType === "editProject") &&
                            <ProjectModal modalData={modalData} closeModal={closeModal} />}

                        {activeType === "editResume" &&
                            <ResumeModal modalData={modalData} closeModal={closeModal} />}

                        {activeType === "editJobOverview" &&
                            <JobOverviewModal modalData={modalData} closeModal={closeModal} />}

                        {activeType === "editJobInfo" &&
                            <JobInfoModal modalData={modalData} closeModal={closeModal} />}

                        {activeType === "applyJob" &&
                            <ApplyJobModal modalData={modalData} closeModal={closeModal} />}

                    </div>

                </div>

            </div>

        </div>
    )
}

export default GlobalModal