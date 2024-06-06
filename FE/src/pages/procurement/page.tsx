import { columns } from "./columns-procurement";
import { TableContainer } from "../../components/mollecule/Table";
import { Button } from "@/components/ui/button";
import { useLoaderData, useNavigate } from "react-router-dom";
import BackButton from "@/components/ui/back-button";
import { Procurement } from "procurement";

function ProcurementPage() {
  const data: Procurement[] = useLoaderData() as Procurement[];

  const navigate = useNavigate();

  return (
    <>
      <div className="container pt-4 pb-56">
        <BackButton href="/" />

        <h1 className="text-xl font-bold mt-4">Procurement Request</h1>

        <div className="mt-4 ">
          <TableContainer columns={columns} data={data} />
        </div>

        <div className="flex flex-col gap-5 max-w-sm mx-auto">
          <Button
            className="font-bold mt-14"
            onClick={() => {
              navigate("/procurement/add-procurement");
            }}
          >
            Add Procurement
          </Button>
          <Button
            className="font-bold"
            onClick={() => {
              navigate("/tender");
            }}
          >
            Auction
          </Button>
          <Button className="font-bold">Contract</Button>
        </div>
      </div>
    </>
  );
}

export default ProcurementPage;
