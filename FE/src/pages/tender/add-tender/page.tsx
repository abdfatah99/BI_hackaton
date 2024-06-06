import BackButton from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoaderData, useNavigate } from "react-router-dom";
import { TAddTenderParticipant } from "tender";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import axios from "axios";
import { CircleAlert } from "lucide-react";
import DownloadButton from "./download-file";

function AddTender() {
  const navigate = useNavigate();

  // get company list (vendor)
  const { id_procurement, listOfVendor } =
    useLoaderData() as TAddTenderParticipant;

  // const [idProcurement, setIdProcurement] = useState("");
  const [idVendor, setIdVendor] = useState("");
  const [fileDocument, setFileDocument] = useState<File | null>(null);

  console.log(listOfVendor);

  const handleAddTenderParticipant = async () => {
    const formData = new FormData();
    formData.append("id_procurement", id_procurement);
    formData.append("id_vendor", idVendor);
    if (fileDocument) {
      formData.append("file", fileDocument);
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/tender/${id_procurement}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        "id procurement: ",
        id_procurement,
        "navigate to : /tender/${id_procurement}"
      );

      navigate(`/tender/${id_procurement}`);

      console.log("Response update:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container pt-4 pb-24">
      <BackButton href="/tender" />

      <h1 className="text-xl font-bold mt-4">Add Tender Participant</h1>

      <Select onValueChange={setIdVendor}>
        <SelectTrigger className="mt-4">
          <SelectValue placeholder="Select Company To Participate" />
        </SelectTrigger>
        <SelectContent>
          {listOfVendor.map((vendor) => (
            <SelectItem key={vendor.vendor_id} value={vendor.vendor_id}>
              {vendor.company_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-row gap-[2px] items-center my-4">
        <CircleAlert className="h-4" />
        <div className="text-[10px]">
          <p>
            You have to follow example table structure in order to submit
            tender.
          </p>
          <p>
            Please add column{" "}
            <code className="bg-slate-200 px-1 rounded-sm">proposed_price</code>{" "}
            for given price of each product
          </p>
        </div>
      </div>

      <DownloadButton fileId={id_procurement} />

      <div className="flex flex-col gap-4 mt-4">
        <Label htmlFor="fileDocument" className="font-semibold">
          Upload Proposed List of Prices
        </Label>
        <Input
          type="file"
          id="fileDocument"
          onChange={(event) => {
            setFileDocument(event.target.files?.[0] || null);
          }}
        />

        {/* <div className="mt-4">
          <p className="mb-4 text-sm text-slate-500">Result price comparison</p>
          <TableContainer columns={columns} data={proposedPriceData} />
        </div> */}
      </div>

      <div className="grid mt-6">
        <Button onClick={handleAddTenderParticipant}>
          Save Proposed Vendor
        </Button>
      </div>
    </div>
  );
}

export default AddTender;
