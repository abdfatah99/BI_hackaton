import { ColumnDef } from "@tanstack/react-table";
import { TTenderProposedPrice } from "@/types/tender";

// define the columns
export const columns: ColumnDef<TTenderProposedPrice>[] = [
  {
    accessorKey: "product_name",
    header: "Product Name",
  },
  {
    accessorKey: "proposed_price",
    header: "Proposed Price",
  },
  {
    accessorKey: "avrg_price",
    header: "Average Price",
  },
];
