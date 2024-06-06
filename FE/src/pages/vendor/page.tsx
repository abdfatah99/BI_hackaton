import { TableContainer } from "@/components/mollecule/Table";
import BackButton from "@/components/ui/back-button";
import { Link, useLoaderData } from "react-router-dom";
import { vendor } from "vendor";
import { columns } from "./columns-vendor";
import { Button } from "@/components/ui/button";

function Vendor() {
  const listOfVendor = useLoaderData() as vendor[];

  return (
    <div className="container pt-4">
      <BackButton href="/" />

      <h1 className="text-xl font-bold mt-4">List of Vendor</h1>

      <div className="mt-4">
        <TableContainer columns={columns} data={listOfVendor} />
      </div>

      <Link to={"/vendor/add-vendor"}>
        <Button className="w-full mt-6">Add Data Vendor</Button>
      </Link>
    </div>
  );
}

export default Vendor;
