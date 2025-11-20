"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
} from "@tanstack/react-table";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const data = await adminService.getUsers();
            const list = Array.isArray(data) ? data : (data.data || data.users || []);
            setUsers(list);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await adminService.updateUserRole(userId, newRole);
            // Optimistic update or refetch
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Failed to update role", error);
            alert("Failed to update role");
        }
    };

    const columns = [
        {
            accessorKey: "name",
            header: "User",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={row.original.avatar} />
                        <AvatarFallback>{row.original.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-white">{row.original.name}</span>
                        <span className="text-xs text-gray-500">{row.original.email}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <Select
                        defaultValue={user.role}
                        onValueChange={(val) => handleRoleChange(user._id, val)}
                    >
                        <SelectTrigger className="w-[120px] bg-gray-800 border-gray-700 h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: "Joined",
            cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
        },
    ];

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">User Management</h2>

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
                                    No users found.
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
