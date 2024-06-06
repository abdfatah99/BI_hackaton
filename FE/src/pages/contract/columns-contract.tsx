// client component, contain column definition

import { ColumnDef } from "@tanstack/react-table";
import { TTender } from "@/types/tender";
// import {
//   DropdownMenu,
//   // DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   // DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal } from "lucide-react";
// import { Link } from "react-router-dom";

// define the columns
export const columns: ColumnDef<TTender>[] = [
  {
    accessorKey: "id",
    header: "Id",
    // cell: ({ row }) => {
    //   const value = row.getValue("id");

    //   if (typeof value !== "string") {
    //     throw new Error("value is not string");
    //   }

    //   const match = value.match(/^([a-zA-Z0-9]+)-/);

    //   // console.log(match);

    //   return <div className="text-bold">{match ? match[1] : ""}</div>;
    // },
  },
  {
    accessorKey: "procurement_name",
    header: "Procurement Name",
  },
  {
    accessorKey: "desired_vendor",
    header: "Company",
  },
];
