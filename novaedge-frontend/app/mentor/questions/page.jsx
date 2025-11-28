"use client";

import { useEffect, useState } from "react";
import { getCourseQuestions, replyToQuestion, getMentorProfile } from "@/services/mentor";
import { MessageSquare, User, Send, Loader2 } from "lucide-react";

export default function MentorQuestionsPage() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("all");

    // Reply State
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const profile = await getMentorProfile();
                setCourses(profile.assignedCourses);

                // Fetch questions for the first course initially or all if possible
                // Our backend API currently takes courseId as a param, so we might need to fetch for each course
                // For simplicity, let's just fetch for the first course if available
                if (profile.assignedCourses.length > 0) {
                    setSelectedCourse(profile.assignedCourses[0]._id);
                    fetchQuestions(profile.assignedCourses[0]._id);
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

    const fetchQuestions = async (courseId) => {
        setLoading(true);
        try {
            const data = await getCourseQuestions(courseId);
            setQuestions(data.questions);
        } catch (error) {
            console.error("Failed to fetch questions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseChange = (e) => {
        const courseId = e.target.value;
        setSelectedCourse(courseId);
        if (courseId !== "all") {
            fetchQuestions(courseId);
        } else {
            setQuestions([]); // Or handle 'all' logic if backend supported it
        }
    };

    const handleReply = async (questionId) => {
        if (!replyContent.trim()) return;
        setSubmitting(true);
        try {
            await replyToQuestion(questionId, replyContent);
            setReplyingTo(null);
            setReplyContent("");
            // Refresh questions to show the reply count update or status change if we had that
            // For now just keep the list as is
            alert("Reply sent successfully!");
        } catch (error) {
            alert("Failed to send reply");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Questions Queue</h1>
                    <p className="text-zinc-400 mt-2">Answer student queries from your courses.</p>
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
                <div className="text-white">Loading questions...</div>
            ) : (
                <div className="space-y-4">
                    {questions.map((q) => (
                        <div key={q._id} className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {q.user?.avatar?.url ? (
                                        <img src={q.user.avatar.url} alt={q.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="h-5 w-5 text-zinc-500" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-white">{q.title}</h4>
                                        <span className="text-xs text-zinc-500">{new Date(q.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-zinc-300 mt-1">{q.content}</p>

                                    <div className="mt-4 flex items-center gap-4">
                                        <button
                                            onClick={() => setReplyingTo(replyingTo === q._id ? null : q._id)}
                                            className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            {replyingTo === q._id ? "Cancel Reply" : "Reply"}
                                        </button>
                                    </div>

                                    {replyingTo === q._id && (
                                        <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                                            <textarea
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder="Write your answer here..."
                                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 min-h-[100px]"
                                            />
                                            <div className="flex justify-end mt-2">
                                                <button
                                                    onClick={() => handleReply(q._id)}
                                                    disabled={submitting}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                    Send Reply
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {questions.length === 0 && (
                        <div className="text-center py-12 text-zinc-500 bg-zinc-900/50 border border-white/5 rounded-xl border-dashed">
                            No questions found for this course.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
