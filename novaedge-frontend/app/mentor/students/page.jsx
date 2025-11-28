"use client";

import { useEffect, useState } from "react";
import { getCourseStudents, getMentorProfile } from "@/services/mentor";
import { User, Search, Mail } from "lucide-react";

export default function MentorStudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");

    useEffect(() => {
        const init = async () => {
            try {
                const profile = await getMentorProfile();
                setCourses(profile.assignedCourses);
                if (profile.assignedCourses.length > 0) {
                    setSelectedCourse(profile.assignedCourses[0]._id);
                    fetchStudents(profile.assignedCourses[0]._id);
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Failed to init", error);
                setLoading(false);
            }
        };
        init();
    }, []);

    const fetchStudents = async (courseId) => {
        setLoading(true);
        try {
            const data = await getCourseStudents(courseId);
            setStudents(data.students);
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        fetchStudents(courseId);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Students</h1>
                    <p className="text-zinc-400 mt-2">Monitor student progress and performance.</p>
                </div>

                <select
                    value={selectedCourse}
                    onChange={handleCourseChange}
                    className="bg-zinc-900 border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                    {courses.map(c => (
                        <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-white">Loading students...</div>
            ) : (
                <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-950 text-zinc-400 text-sm uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Student</th>
                                    <th className="px-6 py-4 font-medium">Email</th>
                                    <th className="px-6 py-4 font-medium">Progress</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {students.map((student) => (
                                    <tr key={student._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                                                    {student.avatar?.url ? (
                                                        <img src={student.avatar.url} alt={student.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="h-4 w-4 text-zinc-500" />
                                                    )}
                                                </div>
                                                <span className="font-medium text-white">{student.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-400">{student.email}</td>
                                        <td className="px-6 py-4">
                                            <div className="w-full max-w-[100px] h-2 bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 w-[45%]"></div> {/* Mock progress for now */}
                                            </div>
                                            <span className="text-xs text-zinc-500 mt-1 block">45% Complete</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-zinc-400 hover:text-white transition-colors">
                                                <Mail className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-zinc-500">
                                            No students enrolled in this course yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
