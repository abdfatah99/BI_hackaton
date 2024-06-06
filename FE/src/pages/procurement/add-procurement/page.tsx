import BackButton from "@/components/ui/back-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

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
import { useState } from "react";
import axios from "axios";
import { CircleAlert } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
// import { Toaster } from "@/components/ui/toaster";

const CSV_FILE_URL = "http://localhost:5173/procurement-format.csv";

function AddProcurement() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [procurementName, setProcurementName] = useState("");
  const [procNum, setProcNum] = useState("");
  const [applicantDivision, setApplicantDivision] = useState("");
  // const [amount, setAmount] = useState("");
  const [fileDocument, setFileDocument] = useState<File | null>(null);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("procurement_name", procurementName);
    formData.append("proc_number", procNum);
    formData.append("applicant_division", applicantDivision);
    // formData.append("amount", amount);
    if (fileDocument) {
      formData.append("file", fileDocument);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/procurement",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response Server:", response);

      console.log("data saved successfully", response.data);
      navigate("/procurement/");
    } catch (error) {
      if (error instanceof Error && error.message) {
        console.error("Error message:", error.message);

        toast({
          title: "Failed to send a request",
          description: error.message,
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        });
      }
    }
  };

  const downloadFileAtURL = (url: string) => {
    const fileName: string = url.split("/").pop() || "";
    const aTag = document.createElement("a");

    aTag.href = url;
    aTag.setAttribute("download", fileName);
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
  };

  // const handleInputChange = () => {};

  return (
    <>
      {/* <Toaster /> */}
      <div className="container pt-4">
        <BackButton href="/procurement" />

        <h1 className="text-xl font-bold mt-4 max-w-max sm:mx-auto">
          Procurement Data
        </h1>

        <div className="grid w-full mx-auto max-w-sm items-center gap-3 mt-3 sm:mt-6">
          <Label htmlFor="procurement" className="font-semibold">
            Procurement
          </Label>
          <Input
            type="text"
            id="procurement"
            placeholder="Procurement Name"
            value={procurementName}
            onChange={(event) => setProcurementName(event.target.value)}
          />

          <Label htmlFor="procNum" className="font-semibold">
            Procurement Number
          </Label>
          <Input
            type="text"
            id="procNum"
            placeholder="Procurement Number"
            value={procNum}
            onChange={(event) => setProcNum(event.target.value)}
          />

          <Label htmlFor="applicantDivision" className="font-semibold">
            Applicant Division
          </Label>
          <Input
            type="text"
            id="applicantDivision"
            placeholder="Applicant Division"
            value={applicantDivision}
            onChange={(event) => setApplicantDivision(event.target.value)}
          />

          {/* <Label htmlFor="amount" className="font-semibold">
            Amount
          </Label>
          <Input
            type="text"
            id="amount"
            placeholder="Amount"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          /> */}

          <Label htmlFor="fileDocument" className="font-semibold">
            Procurement Document
          </Label>
          <Input
            type="file"
            id="fileDocument"
            onChange={(event) =>
              setFileDocument(event.target.files?.[0] || null)
            }
          />

          <div className="flex flex-row gap-[2px] items-center">
            <CircleAlert className="h-4" />
            <p className="text-[10px]">
              You have to follow example table structure in order to submit
              procurement
            </p>
          </div>

          <button
            className="btn"
            onClick={() => {
              downloadFileAtURL(CSV_FILE_URL);
            }}
          >
            Download Example Table Structure
          </button>
        </div>

        <div className="grid gap-4 mt-36 max-w-sm mx-auto">
          <AlertDialog>
            <AlertDialogTrigger className="btn">
              Save Procurement Data
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogDescription>
                  After the data saved, the system will automatically check the
                  price on the market. Are you sure want to save the data?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSave}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger className="btn">Cancel</AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogDescription>
                  Are you sure want to cancel input the data?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  );
}

export default AddProcurement;
