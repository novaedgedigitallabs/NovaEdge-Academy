"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle, XCircle, BrainCircuit } from "lucide-react";
import { toast } from "sonner";

export default function AIResourcesPanel({
    summary,
    quiz,
    onGenerate,
    isGenerating,
}) {
    const [activeTab, setActiveTab] = useState("summary");
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleOptionSelect = (questionIndex, optionIndex) => {
        if (showResults) return;
        setQuizAnswers((prev) => ({
            ...prev,
            [questionIndex]: optionIndex,
        }));
    };

    const handleSubmitQuiz = () => {
        if (Object.keys(quizAnswers).length < quiz.length) {
            toast.error("Please answer all questions before submitting.");
            return;
        }
        setShowResults(true);
    };

    const resetQuiz = () => {
        setQuizAnswers({});
        setShowResults(false);
    };

    const calculateScore = () => {
        let correct = 0;
        quiz.forEach((q, idx) => {
            if (quizAnswers[idx] === q.correctAnswer) correct++;
        });
        return correct;
    };

    if (!summary && !quiz) {
        return (
            <Card className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                    <BrainCircuit className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">AI Assistant</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Generate a summary and practice quiz for this lecture using AI.
                    </p>
                </div>
                <Button onClick={onGenerate} disabled={isGenerating}>
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
                        </>
                    ) : (
                        "Generate Resources"
                    )}
                </Button>
            </Card>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-primary" /> AI Assistant
                        </CardTitle>
                    </div>
                    <TabsList className="grid w-full grid-cols-2 mt-2">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="quiz">Practice Quiz</TabsTrigger>
                    </TabsList>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4">
                    <TabsContent value="summary" className="mt-0 space-y-4 h-full">
                        {summary ? (
                            <div className="prose dark:prose-invert text-sm">
                                <p>{summary}</p>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                No summary available.
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="quiz" className="mt-0 space-y-6 h-full">
                        {quiz && quiz.length > 0 ? (
                            <div className="space-y-6">
                                {showResults && (
                                    <div className="bg-muted p-4 rounded-lg text-center mb-4">
                                        <p className="font-medium">
                                            You scored {calculateScore()} out of {quiz.length}
                                        </p>
                                        <Button variant="link" onClick={resetQuiz} className="text-sm">
                                            Try Again
                                        </Button>
                                    </div>
                                )}

                                {quiz.map((q, qIdx) => {
                                    const userAnswer = quizAnswers[qIdx];
                                    const isCorrect = userAnswer === q.correctAnswer;

                                    return (
                                        <div key={qIdx} className="space-y-3">
                                            <p className="font-medium text-sm">
                                                {qIdx + 1}. {q.question}
                                            </p>
                                            <div className="space-y-2">
                                                {q.options.map((opt, oIdx) => {
                                                    let optionClass =
                                                        "w-full justify-start text-left h-auto py-2 px-3 text-sm";

                                                    if (showResults) {
                                                        if (oIdx === q.correctAnswer) {
                                                            optionClass += " bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-500";
                                                        } else if (userAnswer === oIdx && !isCorrect) {
                                                            optionClass += " bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-500";
                                                        } else {
                                                            optionClass += " opacity-50";
                                                        }
                                                    } else {
                                                        if (userAnswer === oIdx) {
                                                            optionClass += " border-primary bg-primary/5";
                                                        }
                                                    }

                                                    return (
                                                        <Button
                                                            key={oIdx}
                                                            variant="outline"
                                                            className={optionClass}
                                                            onClick={() => handleOptionSelect(qIdx, oIdx)}
                                                            disabled={showResults}
                                                        >
                                                            <div className="flex items-center w-full">
                                                                <span className="flex-grow">{opt}</span>
                                                                {showResults && oIdx === q.correctAnswer && (
                                                                    <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                                                                )}
                                                                {showResults && userAnswer === oIdx && userAnswer !== q.correctAnswer && (
                                                                    <XCircle className="w-4 h-4 text-red-500 ml-2" />
                                                                )}
                                                            </div>
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}

                                {!showResults && (
                                    <Button className="w-full" onClick={handleSubmitQuiz}>
                                        Submit Quiz
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                No quiz available.
                            </div>
                        )}
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    );
}
