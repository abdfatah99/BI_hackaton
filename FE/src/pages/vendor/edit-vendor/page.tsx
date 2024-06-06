
import BackButton from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

import { useToast } from "@/components/ui/use-toast";
import { vendor } from "vendor";

function EditVendor() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [companyName, setCompanyName] = useState("");
  const [nib, setNib] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const vendorData = useLoaderData() as vendor;

  const vendor_id = vendorData.vendor_id

  useEffect(() => {
    setCompanyName(vendorData.company_name);
    setNib(vendorData.nib);
    setEmail(vendorData.email);
    setPhoneNumber(vendorData.phone);
  }, [vendorData]);

  const handleUpdateDataVendor = async () => {
    const formData = new FormData();
    formData.append("vendor_id", vendor_id)
    formData.append("company_name", companyName);
    formData.append("nib", nib);
    formData.append("email", email);
    formData.append("phone", phoneNumber);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BE}/vendor/${vendor_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response server:", response);
      toast({
        title: "Update Data Succesfully",
        description: "Vendor Data Saved",
      });
      navigate("/vendor");
    } catch (error) {
      toast({
        title: "Unable To Update Vendor Data",
        description: `${error}`,
      });
      console.log("Error for sending data vendor", error);
    }
  };

  return (
    <>
      <div className="container pt-4">
        <BackButton href="/vendor" />

        <h1 className="text-xl max-w-max font-bold mt-4 sm:mx-auto">
          Update Data Vendor
        </h1>

        <div className="grid w-full max-w-sm mx-auto items-center gap-3 mt-3">
          <Label htmlFor="company_name" className="font-semibold">
            Company Name
          </Label>
          <Input
            type="text"
            id="company_name"
            placeholder="company name"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
          />

          <Label htmlFor="nib" className="font-semibold">
            NIB
          </Label>
          <Input
            type="text"
            id="nib"
            placeholder="nib"
            value={nib}
            onChange={(event) => setNib(event.target.value)}
          />

          <Label htmlFor="email" className="font-semibold">
            Email
          </Label>
          <Input
            type="text"
            id="email"
            placeholder="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Label htmlFor="phone" className="font-semibold">
            Phone Number
          </Label>
          <Input
            type="text"
            id="phone"
            placeholder="phone number"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
          />

          <Button className="mt-6" onClick={handleUpdateDataVendor}>
            Save Data Vendor
          </Button>
        </div>
      </div>
    </>
  );
}

export default EditVendor;
