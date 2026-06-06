import React from 'react'

const Pagination = ({ page, totalPages, onPageChange }) => {

    const handlePrev = () => {
        if (page > 1) onPageChange(page - 1);
    }

    const handleNext = () => {
        if (page < totalPages) onPageChange(page + 1);
    }

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 flex-wrap">

            {/* Previous */}
            <button
                onClick={handlePrev}
                disabled={page === 1}
                className="
                    px-3 sm:px-4 py-2 rounded-md font-medium text-sm sm:text-base
                    bg-blue-600 text-white hover:bg-blue-700
                    disabled:bg-gray-300 disabled:text-gray-600
                    disabled:cursor-not-allowed disabled:opacity-60
                    whitespace-nowrap
                "
            >
                Previous
            </button>

            {/* Page info */}
            <span className="
                font-medium bg-white px-3 sm:px-4 py-2 rounded-md
                text-sm sm:text-base whitespace-nowrap
            ">
                Page {page} of {totalPages}
            </span>

            {/* Next */}
            <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="
                    px-3 sm:px-4 py-2 rounded-md font-medium text-sm sm:text-base
                    bg-blue-600 text-white hover:bg-blue-700
                    disabled:bg-gray-300 disabled:text-gray-600
                    disabled:cursor-not-allowed disabled:opacity-60
                    whitespace-nowrap
                "
            >
                Next
            </button>

        </div>
    )
}

export default Pagination