"use client";

import CourseOfferedCard from "../course/CourseOfferedCard";

const DUMMY_COURSES = [
    {
        id: 1,
        title: "Data Science and Analytics with GenAI",
        thumbnail: "/online-learning-platform.jpg",
        originalPrice: 8999,
        discountedPrice: 4999,
    },
    {
        id: 2,
        title: "Full Stack Web Development with Next.js 15",
        thumbnail: "/nextjs-code.jpg",
        originalPrice: 9999,
        discountedPrice: 5499,
    },
    {
        id: 3,
        title: "Cloud Computing & DevOps Masterclass",
        thumbnail: "/online-learning-platform.png",
        originalPrice: 12999,
        discountedPrice: 7999,
    },
    {
        id: 4,
        title: "UI/UX Design with Figma & Adobe XD",
        thumbnail: "/abstract-ui-elements.png",
        originalPrice: 6999,
        discountedPrice: 3499,
    }
];

export default function CoursesOfferedSection() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Courses <span className="text-[#22c5b8]">Offered</span>
                </h2>
                <p className="text-white/60 max-w-2xl mx-auto">
                    Master the most in-demand skills with our expertly crafted courses.
                    From AI to Cloud, we've got you covered.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {DUMMY_COURSES.map((course) => (
                    <CourseOfferedCard key={course.id} course={course} />
                ))}
            </div>
        </section>
    );
}
