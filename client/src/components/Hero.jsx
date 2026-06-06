import React from "react";
import heroImg from "../assets/pexels-thirdman-7652126.jpg";

const Hero = ({
    title,
    description,
    showButtons = true,
}) => {
    return (
        <div
            className="relative flex flex-col items-center justify-center text-center px-6 min-h-[70vh] bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImg})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Content */}
            <div className="relative z-10">

                <h1 className="text-4xl sm:text-5xl font-bold text-white max-w-2xl">
                    {title}
                </h1>

                <p className="text-gray-200 mt-4 max-w-xl">
                    {description}
                </p>

                {/* Buttons (only show if true) */}
                {showButtons && (
                    <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">
                            Get Started
                        </button>

                        <button className="border border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-black">
                            Browse Jobs
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Hero;