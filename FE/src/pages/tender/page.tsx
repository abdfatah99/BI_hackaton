import { TableContainer } from "@/components/mollecule/Table";
import BackButton from "@/components/ui/back-button";
import { columns } from "./columns-tender";
// import { getListOfTender } from "@/services/tender";
import { useLoaderData } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Procurement } from "procurement";

function Tender() {
  const listOfTender = useLoaderData() as Procurement[];

  return (
    <div className="container pt-4 pb-7">
      <BackButton href="/"></BackButton>

      <h1 className="text-xl font-bold mt-4">List of Tender</h1>
      <p className="text-slate-500 text-xs mt-1">
        This list is the procurement that are being Tendered with Vendor
      </p>

      <div className="mt-4">
        <TableContainer columns={columns} data={listOfTender} />
      </div>

      <h1 className="text-xl font-bold mt-4">Announcement</h1>

      <div className="flex flex-col mt-8 gap-4">
        <Button>Procedure</Button>
        <Button>Terms and Conditions</Button>
      </div>
    </div>
  );
}

export default Tender;
