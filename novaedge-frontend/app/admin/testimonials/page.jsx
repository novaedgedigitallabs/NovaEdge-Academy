import AdminTestimonialList from "@/components/admin/testimonials/AdminTestimonialList";

export default function AdminTestimonialsPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Testimonial Moderation</h1>
            <AdminTestimonialList />
        </div>
    );
}
