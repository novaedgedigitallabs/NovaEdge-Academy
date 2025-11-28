import TestimonialUploadForm from "@/components/testimonials/TestimonialUploadForm";

export default function SubmitTestimonialPage() {
    return (
        <div className="container mx-auto py-12 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Share Your Experience</h1>
            <p className="text-center text-muted-foreground mb-8">
                We'd love to hear from you! Upload a video or write a review about your learning journey.
            </p>
            <TestimonialUploadForm />
        </div>
    );
}
