import { TableContainer } from "@/components/mollecule/Table";
import BackButton from "@/components/ui/back-button";
import { columns } from "./columns-tender-propose-detail";
// import propsedPricejson from "@/assets/data/office-stationery.json";
import { Button } from "@/components/ui/button";
import { useLoaderData } from "react-router-dom";
import { TTenderProposedPrice } from "tender";

function TenderProposedDetail() {
  const listOfProductProposedPrice = useLoaderData() as TTenderProposedPrice[];

  const headerInfo = listOfProductProposedPrice[0]

  return (
    <div className="container pt-4">
      <BackButton href="/tender/" />

      <h1 className="text-xl font-bold mt-4">{headerInfo.procurement_name}</h1>

      <table className="w-full mt-4 table-fixed">
        <tr className="">
          <th className="font-normal text-left align-top">Procurement Name</th>
          <td className="align-top w-min pr-2">:</td>
          <td className="align-top">{headerInfo.procurement_name}</td>
        </tr>

        <tr className="">
          <th className="font-normal text-left align-top">
            Procurement Number
          </th>
          <td className="align-top w-min pr-2">:</td>
          <td className="align-top">{headerInfo.proc_number}</td>
        </tr>

        <tr>
          <th className="font-normal text-left align-top">Division</th>
          <td className="align-top w-min pr-2">:</td>
          <td className="align-top">{headerInfo.applicant_division}</td>
        </tr>
      </table>

      <table className="w-full mt-4 table-fixed">
        <tr className="">
          <th className="font-normal text-left align-top">Vendor Name</th>
          <td className="align-top w-min pr-2">:</td>
          <td className="align-top">{headerInfo.company_name}</td>
        </tr>

        <tr className="">
          <th className="font-normal text-left align-top">NIB</th>
          <td className="align-top w-min pr-2">:</td>
          <td className="align-top">{headerInfo.nib}</td>
        </tr>

        <tr>
          <th className="font-normal text-left align-top">Email</th>
          <td className="align-top w-min pr-2">:</td>
          <td className="align-top">{headerInfo.email}</td>
        </tr>

        {/* <tr>
          <th className="font-normal text-left align-top">Offer Index</th>
          <td className="align-top w-min pr-2">:</td>
          <td className="align-top">{headerInfo.}</td>
        </tr> */}
      </table>

      <div className="mt-4">
        <TableContainer columns={columns} data={listOfProductProposedPrice} />
      </div>

      <div className="grid mt-4">
        <Button>Determine as the winner</Button>
      </div>
    </div>
  );
}

export default TenderProposedDetail;
