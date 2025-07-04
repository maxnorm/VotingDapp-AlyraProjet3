"use client"

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { useContract } from '@/contexts/useContract';
import { cn } from '@/lib/utils';
import AddVoterDialog from './AddVoterDialog';
import { Voter } from '@/lib/types/voter';

function VotersTable() {
  const { isOwner, workflowStatus, voters, UnAuthorized } = useContract();
  const [sorting, setSorting] = useState<SortingState>([]);


  const columns: ColumnDef<Voter>[] = [
    {
      accessorKey: 'address',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'hasVoted',
      header: "Voting Status",
      cell: ({ row }) => (
        <div className={row.getValue('hasVoted') ? 'text-[var(--accent-secondary)]' : 'text-red-400'}>
          {row.getValue('hasVoted') ? 'Voted' : 'Not Voted'}
        </div>
      ),
    },
    {
      accessorKey: 'votedProposalId',
      header: "Voted Proposal ID",
      cell: ({ row }) => {
        return row.getValue('hasVoted') 
          ? <div>{row.getValue('votedProposalId')}</div>
          : <div className="text-gray-400">-</div>
      },
    },
  ];

  const table = useReactTable({
    data: voters || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
      <Card className="w-full max-w-5xl">
        <CardHeader className="flex flex-row items-center">
          <div>
            <CardTitle className="text-2xl">Voters</CardTitle>
            <CardDescription>
              View all the voters of the contract
            </CardDescription>
          </div>
          {
            workflowStatus > 3 && (
              <div className={cn("ml-auto text-sm font-bold text-secondary bg-[var(--accent-secondary)] rounded-full px-3 py-1", {
                'bg-red-400': (voters?.length || 0) / 2 > (voters?.filter((voter: Voter) => voter.hasVoted).length || 0),
              })}>
                Vote: {voters?.filter((voter: Voter) => voter.hasVoted).length || 0} / {voters?.length || 0}
              </div>
            )
          }
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
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
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  UnAuthorized() ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
                      Can't access voters list
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center">
                      No voters found.
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className={cn(
            "flex items-center space-x-2 py-4 justify-end", {
            'justify-between': isOwner() && workflowStatus === 0,
          })}>
            {isOwner() && workflowStatus === 0 && (
              <AddVoterDialog />
            )}
            <div className="flex items-center space-x-2">
              {table.getCanPreviousPage() && (
                <Button
                  variant="outline"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              )}
              {table.getCanNextPage() && (
                <Button
                  variant="outline"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
  );
};

export default VotersTable;
