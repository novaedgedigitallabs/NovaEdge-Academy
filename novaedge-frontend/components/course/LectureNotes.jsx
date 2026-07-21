"use client";

import { useEffect, useState } from "react";
import { getLectureNotes, generateLectureNotes } from "@/services/notes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, BrainCircuit, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function LectureNotes({ courseId, lectureId }) {
    const { user } = useAuth();
    const [notes, setNotes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [quizOpen, setQuizOpen] = useState(false);

    useEffect(() => {
        if (courseId && lectureId) {
            loadNotes();
        }
    }, [courseId, lectureId]);

    const loadNotes = async () => {
        setLoading(true);
        try {
            const res = await getLectureNotes(courseId, lectureId);
            setNotes(res.note);
        } catch (e) {
            // Notes might not exist yet
            setNotes(null);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            await generateLectureNotes(courseId, lectureId);
            await loadNotes();
        } catch (e) {
            console.error(e);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <div className="p-4"><Loader2 className="animate-spin" /></div>;

    if (!notes) {
        // Only admins can generate
        if (user?.role === "admin") {
            return (
                <div className="p-6 border rounded-lg bg-muted/10 text-center">
                    <h3 className="text-lg font-semibold mb-2">AI Notes Available</h3>
                    <p className="text-muted-foreground mb-4">Generate summary, key points, and quiz for this lecture.</p>
                    <Button onClick={handleGenerate} disabled={generating}>
                        {generating ? <Loader2 className="animate-spin mr-2" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                        Generate AI Notes
                    </Button>
                </div>
            );
        }
        return null; // Students see nothing if no notes
    }

    return (
        <div className="space-y-6 mt-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Lecture Summary
                    </CardTitle>
                    <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <BrainCircuit className="w-4 h-4 mr-2" />
                                Practice Quiz
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Practice Quiz</DialogTitle>
                            </DialogHeader>
                            <QuizView mcqs={notes.mcqs} />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{notes.summary}</p>

                    <div>
                        <h4 className="font-semibold mb-2">Key Takeaways:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                            {notes.keyPoints.map((point, i) => (
                                <li key={i}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function QuizView({ mcqs }) {
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleSelect = (qIndex, option) => {
        if (showResults) return;
        setAnswers({ ...answers, [qIndex]: option });
    };

    const score = mcqs.reduce((acc, q, i) => {
        return acc + (answers[i] === q.correctAnswer ? 1 : 0);
    }, 0);

    return (
        <div className="space-y-6 py-4">
            {mcqs.map((q, i) => (
                <div key={i} className="space-y-3 pb-4 border-b last:border-0">
                    <p className="font-medium">{i + 1}. {q.question}</p>
                    <div className="space-y-2">
                        {q.options.map((opt) => {
                            const isSelected = answers[i] === opt;
                            const isCorrect = opt === q.correctAnswer;

                            let className = "w-full justify-start text-left h-auto py-3 px-4 border rounded-md hover:bg-muted/50 transition-colors";

                            if (showResults) {
                                if (isCorrect) className += " bg-green-100 border-green-500 text-green-900";
                                else if (isSelected && !isCorrect) className += " bg-red-100 border-red-500 text-red-900";
                            } else if (isSelected) {
                                className += " border-primary bg-primary/5";
                            }

                            return (
                                <button
                                    key={opt}
                                    onClick={() => handleSelect(i, opt)}
                                    className={className}
                                    disabled={showResults}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <span>{opt}</span>
                                        {showResults && isCorrect && <CheckCircle className="w-4 h-4 text-green-600" />}
                                        {showResults && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-600" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {showResults && (
                        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded">
                            <span className="font-semibold">Explanation:</span> {q.explanation}
                        </div>
                    )}
                </div>
            ))}

            {!showResults ? (
                <Button
                    className="w-full"
                    onClick={() => setShowResults(true)}
                    disabled={Object.keys(answers).length < mcqs.length}
                >
                    Check Answers
                </Button>
            ) : (
                <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <p className="text-lg font-bold">You scored {score} / {mcqs.length}</p>
                    <Button variant="outline" onClick={() => {
                        setShowResults(false);
                        setAnswers({});
                    }} className="mt-2">
                        Retry Quiz
                    </Button>
                </div>
            )}
        </div>
    );
}
