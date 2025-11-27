"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getMentor, updateMentor } from "@/services/mentors";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import RichTextEditor from "@/components/ui/rich-text-editor";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.string().min(2, "Role must be at least 2 characters"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    image: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
});

export default function EditMentorPage({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            role: "",
            bio: "",
            image: "",
        },
    });

    useEffect(() => {
        const fetchMentor = async () => {
            try {
                const res = await getMentor(id);
                const mentor = res.data;
                form.reset({
                    name: mentor.name,
                    role: mentor.role,
                    bio: mentor.bio,
                    image: mentor.image,
                });
            } catch (error) {
                toast.error("Failed to load mentor details");
                router.push("/admin/mentors");
            } finally {
                setFetching(false);
            }
        };

        fetchMentor();
    }, [id, form, router]);

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            await updateMentor(id, values);
            toast.success("Mentor updated successfully");
            router.push("/admin/mentors");
        } catch (error) {
            toast.error(error.message || "Failed to update mentor");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-8">
            <div className="flex items-center space-x-4">
                <Link href="/admin/mentors">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Mentor</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Mentor name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Senior Developer" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image URL (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <RichTextEditor
                                        placeholder="Mentor biography..."
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Updating..." : "Update Mentor"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
