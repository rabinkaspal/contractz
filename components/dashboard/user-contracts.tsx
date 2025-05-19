import { IContractAnalysis as ContractAnalysis } from "@/utils/types";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
// import { UploadModal } from "../modals/upload-modal";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UploadModal } from "../modals/upload-modal";

export default function UserContracts() {
    const { data: contracts } = useQuery<ContractAnalysis[]>({
        queryKey: ["user-contracts"],
        queryFn: () => fetchUserContracts(),
    });

    const [sorting, setSorting] = useState<SortingState>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const contractTypeColors: { [key: string]: string } = {
        Employment: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        "Non-Disclosure Agreement": "bg-green-100 text-green-800 hover:bg-green-200",
        Sales: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        Lease: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
        Services: "bg-pink-100 text-pink-800 hover:bg-pink-200",
        Other: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    };

    const columns: ColumnDef<ContractAnalysis>[] = [
        {
            accessorKey: "name",
            header: () => {
                return <Button variant={"ghost"}>Contract Name</Button>;
            },
            cell: ({ row }) => (
                <div className="font-medium overflow-ellipsis max-w-[300px] whitespace-nowrap overflow-hidden">
                    {row.getValue<string>("name")}
                </div>
            ),
        },
        {
            accessorKey: "_id",
            header: () => {
                return <Button variant={"ghost"}>Contract ID</Button>;
            },
            cell: ({ row }) => (
                <div className="font-medium text-center overflow-ellipsis max-w-[150px] whitespace-nowrap overflow-hidden">
                    {row.getValue<string>("_id")}
                </div>
            ),
        },
        {
            accessorKey: "overallScore",
            header: () => {
                return <Button variant={"ghost"}>Overall Score</Button>;
            },
            cell: ({ row }) => {
                const score = parseFloat(row.getValue("overallScore"));
                return (
                    <Badge
                        className="rounded-md"
                        variant={
                            score > 75
                                ? "default"
                                : score < 50
                                ? "destructive"
                                : "secondary"
                        }>
                        {score.toFixed(2)} Overall Score
                    </Badge>
                );
            },
        },
        {
            accessorKey: "contractType",
            header: "Contract Type",
            cell: ({ row }) => {
                const contractType = row.getValue("contractType") as string;
                const colorClass =
                    contractTypeColors[contractType] || contractTypeColors["Other"];
                return (
                    <Badge className={cn("rounded-md", colorClass)}>{contractType}</Badge>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const contract = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} className="size-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Link href={`/dashboard/contract/${contract._id}`}>
                                    View Details
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                        <span className="text-destructive">
                                            Delete Contract
                                        </span>
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will
                                            permanently delete your contract and remove
                                            your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: contracts ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            sorting,
        },
    });

    const totalContracts = contracts?.length || 0;
    const averageScore =
        totalContracts > 0
            ? (contracts?.reduce(
                  (sum, contract) => sum + (contract.overallScore ?? 0),
                  0
              ) ?? 0) / totalContracts
            : 0;

    const highRiskContracts =
        contracts?.filter(contract =>
            contract.risks.some(risk => risk.severity === "high")
        ).length ?? 0;

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Your Contracts</h1>
                <Button onClick={() => setIsUploadModalOpen(true)}>New Contract</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="gap-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-bold">
                            Total Contracts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalContracts}</div>
                        <p className="font-light text-sm text-gray-400">
                            +100% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="gap-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-bold">Average Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {averageScore.toFixed(2)}
                        </div>
                        <p className="font-light text-sm text-gray-400">
                            +190.1 basis points from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="gap-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-bold">
                            High Risk Contracts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{highRiskContracts}</div>
                        <p className="font-light text-sm text-gray-400">
                            +5.6% from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button
                    variant={"outline"}
                    size={"sm"}
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadComplete={() => table.reset()}
            />
        </div>
    );
}

async function fetchUserContracts(): Promise<ContractAnalysis[]> {
    setTimeout(() => {}, 1000);
    const response = {
        data: [
            {
                _id: "as829fh20h824e0hjg028h9jw09j",
                name: "Employment Contract with ABC Corp",
                overallScore: 85.5,
                contractType: "Employment",
                risks: [
                    {
                        description: "Risk of termination without notice",
                        severity: "high",
                    },
                    { description: "Non-compete clause", severity: "medium" },
                    { description: "Confidentiality obligations", severity: "low" },
                ],
                opportunities: [
                    { description: "Potential for salary increase", impact: "high" },
                    { description: "Career advancement opportunities", impact: "medium" },
                    { description: "Training and development programs", impact: "low" },
                ],
                createdAt: "2023-10-01T12:00:00Z",
                version: 1,
                expirationDate: null,
            },
            {
                _id: "asd9f8uas9fg8ashh0298fhw02",
                name: "NDA with Partner Company",
                overallScore: 55.0,
                contractType: "Non-Disclosure Agreement",
                risks: [
                    { description: "Risk of data breach", severity: "high" },
                    {
                        description: "Obligations to return confidential information",
                        severity: "medium",
                    },
                    { description: "Non-solicitation clause", severity: "low" },
                ],
                opportunities: [
                    {
                        description: "Protection of sensitive information",
                        impact: "high",
                    },
                    { description: "Building trust with partners", impact: "medium" },
                    { description: "Legal recourse in case of breach", impact: "low" },
                ],
                createdAt: "2023-10-02T12:00:00Z",
                version: 1,
                expirationDate: null,
            },
        ],
    };
    return response.data as unknown as ContractAnalysis[];
}
