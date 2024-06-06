import { TableContainer } from "@/components/mollecule/Table";
import BackButton from "@/components/ui/back-button";
import { Procurement } from "procurement";
import { useLoaderData, useNavigate } from "react-router-dom";
import { columns } from "./columns-procurement-detail";
// import { getProcurementItemDetail } from "@/services/procurement";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Product } from "product";
import { deleteProcurment } from "@/services/procurement";
import { addTender } from "@/services/tender";
// import axios from "axios";

function ProcurementDetail() {
  const { procurementInfo, productOfProcurement } = useLoaderData() as {
    // detail information about the procurement
    procurementInfo: Procurement;

    // Product that requested by the applicant division
    productOfProcurement: Product[];
  };

  const navigate = useNavigate();

  const handleCancelProcurement = async () => {
    try {
      const status = await deleteProcurment(procurementInfo.procurement_id);

      if (status) {
        alert("Procurement Proposal Cancelled Successfully");
        navigate("/procurement");
      }
    } catch (error) {
      console.error("Error cancellnig procurement proposal", error);
      alert("Failed to cancal procurement proposal");
    }
  };

  const handleTenderProcess = async () => {
    try {
      const status = await addTender(procurementInfo.procurement_id);

      if (status) {
        alert("Procurement succesfully Tendered");
        navigate("/tender");
      }
    } catch (error) {
      console.log({
        "Function Name": "handleTenderProcess",
        detail: "Error to sending the tender data",
        error: error,
      });
    }
  };

  return (
    <div className="container mt-4">
      <BackButton href="/procurement" />

      <h1 className="text-xl font-bold mt-4">Procurement Details</h1>

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
            <th className="font-normal text-left align-top">Procurement Id</th>
            <td className="align-top w-min pr-2">:</td>
            <td className="align-top">{procurementInfo.procurement_id}</td>
          </tr>

          <tr>
            <th className="font-normal text-left align-top">
              Applicant Division
            </th>
            <td className="align-top w-min pr-2">:</td>
            <td className="align-top">{procurementInfo.applicant_division}</td>
          </tr>
          <tr>
            <th className="font-normal text-left align-top">Total Price</th>
            <td className="align-top w-min pr-2">:</td>
            <td className="align-top">{procurementInfo.amount}</td>
          </tr>
        </tbody>
      </table>

      <h1 className="text-base font-bold mt-4">Item Details</h1>

      <div className="mt-4">
        <TableContainer columns={columns} data={productOfProcurement} />
      </div>

      <div className="flex flex-col gap-4 my-16">
        <AlertDialog>
          <AlertDialogTrigger className="btn">Tender</AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogDescription>
                Do you agree with this procurement proposal and want to do
                Tender?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleTenderProcess}>
                Agree
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger className="btn">
            Cancel Procurement Proposal
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogDescription>
                Do you want to cancel the proposal? All data will be remove from
                database
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelProcurement}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ProcurementDetail;
