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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getPosition, updatePosition } from "@/services/careers";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    department: z.string().min(2, "Department must be at least 2 characters"),
    location: z.string().min(2, "Location must be at least 2 characters"),
    type: z.enum(["Full-time", "Part-time", "Contract", "Internship", "Freelance"]),
    description: z.string().min(10, "Description must be at least 10 characters"),
});

export default function EditCareerPage({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            department: "",
            location: "",
            type: "Full-time",
            description: "",
        },
    });

    useEffect(() => {
        const fetchPosition = async () => {
            try {
                const res = await getPosition(id);
                const position = res.data;
                form.reset({
                    title: position.title,
                    department: position.department,
                    location: position.location,
                    type: position.type,
                    description: position.description,
                });
            } catch (error) {
                toast.error("Failed to load position details");
                router.push("/admin/careers");
            } finally {
                setFetching(false);
            }
        };

        fetchPosition();
    }, [id, form, router]);

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            await updatePosition(id, values);
            toast.success("Position updated successfully");
            router.push("/admin/careers");
        } catch (error) {
            toast.error(error.message || "Failed to update position");
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
                <Link href="/admin/careers">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Position</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Senior Frontend Engineer" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="department"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Engineering" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Remote" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Job Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select job type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Full-time">Full-time</SelectItem>
                                        <SelectItem value="Part-time">Part-time</SelectItem>
                                        <SelectItem value="Contract">Contract</SelectItem>
                                        <SelectItem value="Internship">Internship</SelectItem>
                                        <SelectItem value="Freelance">Freelance</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter job description..."
                                        className="min-h-[200px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Updating..." : "Update Position"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
