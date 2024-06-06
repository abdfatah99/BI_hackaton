import { TableContainer } from "@/components/mollecule/Table";
import BackButton from "@/components/ui/back-button";
import { Link, useLoaderData } from "react-router-dom";
import {
  TTender,
  // TTenderDesiredVendor
} from "tender";
import { columns } from "./columns-tender-detail";
import { Button } from "@/components/ui/button";
// import { TTender } from "tender";

function TenderDetail() {
  const listOfTenderVendor = useLoaderData() as TTender[];


  // get first tender vendor for general procurement info
  const procurementInfo = listOfTenderVendor[0] as TTender;

  console.log("TenderDetail - List Of Tender Vendor", listOfTenderVendor)

  return (
    <div className="container pt-4">
      <BackButton href="/tender" />

      <h1 className="text-xl font-bold mt-4">
        {procurementInfo.procurement_name}
      </h1>

      <table className="w-full mt-4 table-fixed">
        <tbody>
          <tr className="">
            <th className="font-normal text-left align-top">
              Procurement Name
            </th>
            <td className="align-top w-min pr-2">:</td>
            <td className="align-top">{procurementInfo.procurement_name}</td>
          </tr>

          <tr className="">
            <th className="font-normal text-left align-top">
              Procurement Number
            </th>
            <td className="align-top w-min pr-2">:</td>
            <td className="align-top">{procurementInfo.proc_number}</td>
          </tr>

          <tr>
            <th className="font-normal text-left align-top">Desired Vendor</th>
            <td className="align-top w-min pr-2">:</td>
            <td className="align-top">{procurementInfo.company_name}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4">
        <TableContainer columns={columns} data={listOfTenderVendor} />
      </div>

      <div className="grid mt-4">
        <Link to={`/tender/${procurementInfo.procurement_id}/add-tender`}>
          <Button className="w-full">Add Vendor</Button>
        </Link>
      </div>
    </div>
  );
}

export default TenderDetail;
