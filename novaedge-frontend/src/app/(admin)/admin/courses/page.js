"use client";

import { useEffect, useState } from "react";
import { courseService, adminService } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table";

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: "", description: "", price: "", thumbnail: "" });

    const fetchCourses = async () => {
        try {
            const data = await courseService.getAllCourses();
            const list = Array.isArray(data) ? data : (data.data || data.courses || []);
            setCourses(list);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleCreateCourse = async () => {
        try {
            await adminService.createCourse(newCourse);
            setIsDialogOpen(false);
            setNewCourse({ title: "", description: "", price: "", thumbnail: "" });
            fetchCourses(); // Refresh list
            alert("Course created successfully!");
        } catch (error) {
            console.error("Failed to create course", error);
            alert("Failed to create course");
        }
    };

    const columns = [
        {
            accessorKey: "thumbnail",
            header: "Thumbnail",
            cell: ({ row }) => (
                <div className="w-16 h-10 bg-gray-800 rounded overflow-hidden">
                    {row.original.thumbnail && <img src={row.original.thumbnail} alt="" className="w-full h-full object-cover" />}
                </div>
            ),
        },
        {
            accessorKey: "title",
            header: "Title",
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => `$${row.original.price}`,
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const course = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(course._id)}>
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: courses,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white">Course Management</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" /> Add Course
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle>Create New Course</DialogTitle>
                            <DialogDescription>
                                Add a new course to the platform. You can add modules later.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input
                                    id="title"
                                    value={newCourse.title}
                                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                    className="col-span-3 bg-gray-800 border-gray-700"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={newCourse.price}
                                    onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                                    className="col-span-3 bg-gray-800 border-gray-700"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="desc" className="text-right">Description</Label>
                                <Input
                                    id="desc"
                                    value={newCourse.description}
                                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                    className="col-span-3 bg-gray-800 border-gray-700"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="thumb" className="text-right">Thumbnail URL</Label>
                                <Input
                                    id="thumb"
                                    value={newCourse.thumbnail}
                                    onChange={(e) => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                                    className="col-span-3 bg-gray-800 border-gray-700"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateCourse} className="bg-blue-600 hover:bg-blue-700">Create Course</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border border-gray-800">
                <Table>
                    <TableHeader className="bg-gray-900">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-gray-800 hover:bg-gray-900">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-gray-400">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-gray-800 hover:bg-gray-900/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-gray-300">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                                    No courses found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
