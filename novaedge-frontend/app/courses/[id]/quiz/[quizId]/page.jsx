"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getQuizzes, submitQuiz, getQuizResult } from "@/services/quiz";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/layout/Header";

export default function QuizPage() {
    const { id: courseId, quizId } = useParams();
    const router = useRouter();

    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({}); // { 0: 1, 1: 3 } (questionIndex: optionIndex)
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                // 1. Fetch Quiz Details (We need to find the specific quiz from the list or add a getQuiz endpoint)
                // For now, let's assume we fetch all and find one, or update backend to get single quiz.
                // Actually, I didn't make a getSingleQuiz endpoint. I made getQuizzes.
                // Let's use getQuizzes and find it.
                const data = await getQuizzes(courseId);
                const found = data.quizzes.find(q => q._id === quizId);
                setQuiz(found);

                // 2. Check if already submitted
                try {
                    const res = await getQuizResult(quizId);
                    if (res.submission) {
                        setResult(res.submission);
                    }
                } catch (e) {
                    // Not submitted yet
                }
            } catch (e) {
                toast.error("Failed to load quiz");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [courseId, quizId]);

    const handleSubmit = async () => {
        try {
            const formattedAnswers = Object.entries(answers).map(([qIdx, oIdx]) => ({
                questionIndex: parseInt(qIdx),
                selectedOptionIndex: parseInt(oIdx),
            }));

            const res = await submitQuiz(quizId, formattedAnswers);
            setResult(res.submission);
            toast.success("Quiz submitted!");
        } catch (e) {
            toast.error(e.message || "Submission failed");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!quiz) return <div>Quiz not found</div>;

    if (result) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="container mx-auto py-12 max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quiz Results: {quiz.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center py-8">
                                <div className="text-4xl font-bold mb-2">
                                    {result.obtainedMarks} / {result.totalMarks}
                                </div>
                                <div className={`text-xl font-medium ${result.isPassed ? "text-green-600" : "text-red-600"}`}>
                                    {result.isPassed ? "Passed" : "Failed"}
                                </div>
                            </div>
                            <Button onClick={() => router.push(`/courses/${courseId}`)} className="w-full">
                                Back to Course
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="container mx-auto py-12 max-w-3xl">
                <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>

                <div className="space-y-8">
                    {quiz.questions.map((q, idx) => (
                        <Card key={idx}>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {idx + 1}. {q.questionText}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    onValueChange={(val) => setAnswers(prev => ({ ...prev, [idx]: parseInt(val) }))}
                                    value={answers[idx]?.toString()}
                                >
                                    {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="flex items-center space-x-2">
                                            <RadioGroupItem value={oIdx.toString()} id={`q${idx}-opt${oIdx}`} />
                                            <Label htmlFor={`q${idx}-opt${oIdx}`}>{opt}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 flex justify-end">
                    <Button onClick={handleSubmit} size="lg">
                        Submit Quiz
                    </Button>
                </div>
            </main>
        </div>
    );
}
