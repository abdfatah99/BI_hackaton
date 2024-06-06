import { TableContainer } from "@/components/mollecule/Table";
import BackButton from "@/components/ui/back-button";
import { columns } from "./columns-contract";
import { useLoaderData } from "react-router-dom";
import { TTender } from "tender";

function Contract() {
  const listOfTender = useLoaderData() as TTender[];
  return (
    <div className="container pt-4">
      <BackButton href="/" />

      <h1 className="text-xl font-bold mt-4">List of Contract</h1>

      <div className="mt-4">
        <TableContainer columns={columns} data={listOfTender} />
      </div>
    </div>
  );
}

export default Contract;
