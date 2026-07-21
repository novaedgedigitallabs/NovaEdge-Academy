import AdminTestimonialList from "@/components/admin/testimonials/AdminTestimonialList";

export default function AdminTestimonialsPage() {
    return (
        <div className="glass-card bg-white/30 backdrop-blur-sm p-6 rounded-xl shadow-sm">
            <h1 className="text-3xl font-bold mb-8">Testimonial Moderation</h1>
            <AdminTestimonialList />
        </div>
    );
}
