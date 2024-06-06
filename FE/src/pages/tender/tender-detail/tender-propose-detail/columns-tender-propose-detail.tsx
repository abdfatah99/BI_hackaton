import { ColumnDef } from "@tanstack/react-table";
// import { procurementItem } from "@/types/procurement";
import { TTenderProposedPrice } from "tender";
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
export const columns: ColumnDef<TTenderProposedPrice>[] = [
  {
    accessorKey: "product_name",
    header: "Product Name",
  },
  {
    accessorKey: "propose_vendor_price",
    header: "Recomended Price",
  },
  {
    accessorKey: "market_price",
    header: "Fair Price",
    // this function is the example of cell formatting to change the number into
    // US currency
    // source: https://ui.shadcn.com/docs/components/data-table#cell-formatting
    //   cell: ({ row }) => {
    //     const amount = parseFloat(row.getValue("amount"));
    //     const formatted = new Intl.NumberFormat("en-US", {
    //       style: "currency",
    //       currency: "USD",
    //     }).format(amount);

    //     return <div className="text-right font-medium">{formatted}</div>;
    //   },
  },
  //   {
  //     id: "actions",
  //     enableHiding: false,
  //     cell: ({ row }) => {
  //       const procurement = row.original;

  //       return (
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="ghost" className="h-8 w-8 p-0">
  //               <span className="sr-only">Open menu</span>
  //               <MoreHorizontal className="h-4 w-4" />
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             <Link to={`/procurement/${procurement.id}`}>
  //               <DropdownMenuLabel>Details</DropdownMenuLabel>
  //             </Link>
  //             <DropdownMenuItem
  //               onClick={() => navigator.clipboard.writeText(procurement.id)}
  //             >
  //               Copy Procurement ID
  //             </DropdownMenuItem>
  //             {/* <DropdownMenuSeparator />
  //             <DropdownMenuItem>View customer</DropdownMenuItem>
  //             <DropdownMenuItem>View payment details</DropdownMenuItem> */}
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       );
  //     },
  //   },
];
