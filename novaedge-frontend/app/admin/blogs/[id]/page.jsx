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
import { getPost, updatePost } from "@/services/blogs";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import RichTextEditor from "@/components/ui/rich-text-editor";

const formSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
    content: z.string().min(20, "Content must be at least 20 characters"),
    author: z.string().min(2, "Author must be at least 2 characters"),
    category: z.enum(['Technology', 'Education', 'Career', 'Design', 'Development', 'News']),
    image: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
    readTime: z.string().min(2, "Read time is required"),
});

export default function EditBlogPage({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            excerpt: "",
            content: "",
            author: "",
            category: "Technology",
            image: "",
            readTime: "",
        },
    });

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await getPost(id);
                const post = res.data;
                form.reset({
                    title: post.title,
                    excerpt: post.excerpt,
                    content: post.content,
                    author: post.author,
                    category: post.category,
                    image: post.image,
                    readTime: post.readTime,
                });
            } catch (error) {
                toast.error("Failed to load post details");
                router.push("/admin/blogs");
            } finally {
                setFetching(false);
            }
        };

        fetchPost();
    }, [id, form, router]);

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            await updatePost(id, values);
            toast.success("Post updated successfully");
            router.push("/admin/blogs");
        } catch (error) {
            toast.error(error.message || "Failed to update post");
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
                <Link href="/admin/blogs">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Blog post title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Excerpt</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Short summary of the post"
                                        className="min-h-[80px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Technology">Technology</SelectItem>
                                            <SelectItem value="Education">Education</SelectItem>
                                            <SelectItem value="Career">Career</SelectItem>
                                            <SelectItem value="Design">Design</SelectItem>
                                            <SelectItem value="Development">Development</SelectItem>
                                            <SelectItem value="News">News</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="readTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Read Time</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. 5 min read" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Author</FormLabel>
                                <FormControl>
                                    <Input placeholder="Author name" {...field} />
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
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <RichTextEditor
                                        placeholder="Write your blog post here..."
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Updating..." : "Update Post"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
