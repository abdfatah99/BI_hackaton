import { ColumnDef } from "@tanstack/react-table";
import { TTender } from "@/types/tender";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

// define the columns
export const columns: ColumnDef<TTender>[] = [
  {
    accessorKey: "vendor_id",
    header: "ID Vendor",
  },
  {
    accessorKey: "company_name",
    header: "Company Name",
  },
  {
    accessorKey: "index_value",
    header: "Index",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const vendor = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link to={`/tender/${vendor.procurement_id}/${vendor.vendor_id}`}>
              <DropdownMenuLabel>Details</DropdownMenuLabel>
            </Link>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(vendor.vendor_id)}
            >
              Copy Procurement ID
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
