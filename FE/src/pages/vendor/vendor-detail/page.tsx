import BackButton from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { deleteVendorData } from "@/services/vendor";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { vendor } from "vendor";

function VendorDetailPage() {
  const vendorDetail = useLoaderData() as vendor;

  const navigate = useNavigate();

  const handleDeleteVendorData = async () => {
    try {
      const status = await deleteVendorData(vendorDetail.vendor_id);

      if (status) {
        toast({
          title: "Vendor Deleted",
        });
        navigate("/vendor");
      }
    } catch (error) {
      console.log("error to delete vendor data", error);
      toast({
        title: "Error to delete vendor data",
        description: `${error}`,
      });
    }
  };

  return (
    <div className="container pt-4">
      <BackButton href="/vendor" />

      <h1 className="text-xl font-bold mt-4">Vendor Details</h1>

      <table className="w-full mt-4 table-fixed">
        <tbody>
          <tr className="">
            <th className="font-normal text-left align-top">Company Name</th>
            <td className="align-top w-min pr-2">:</td>
            <td className="align-top">{vendorDetail.company_name}</td>
          </tr>

          <tr className="">
            <th className="font-normal text-left align-top">NIB</th>
            <td className="align-top w-min pr-2">:</td>
            <td className="align-top">{vendorDetail.nib}</td>
          </tr>

          <tr>
            <th className="font-normal text-left align-top">Email</th>
            <td className="align-top w-min pr-2">:</td>
            <td className="align-top">{vendorDetail.email}</td>
          </tr>
          <tr>
            <th className="font-normal text-left align-top">Phone Number</th>
            <td className="align-top w-min pr-2">:</td>
            <td className="align-top">{vendorDetail.phone}</td>
          </tr>
        </tbody>
      </table>

      <div className="grid">
        <Link to={`/vendor/edit-vendor/${vendorDetail.vendor_id}`}>
          <Button className="mt-8 w-full">Edit Vendor Data</Button>
        </Link>
        <Button
          className="mt-8 w-full"
          variant="destructive"
          onClick={handleDeleteVendorData}
        >
          Delete Vendor Data
        </Button>
      </div>
    </div>
  );
}

export default VendorDetailPage;
