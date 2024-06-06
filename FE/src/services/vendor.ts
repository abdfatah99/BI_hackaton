import { vendor } from "./../types/vendor.d";

export async function getListOfVendor(): Promise<vendor[]> {
  const responseListOfVendor = await fetch(`${import.meta.env.VITE_BE}/vendor`);

  if (!responseListOfVendor.ok) {
    throw new Error("Failed to fetch list of vendor");
  }

  const listOfVendor = await responseListOfVendor.json();
  return listOfVendor;
}

export async function getVendorDetail(
  vendor_id: string
): Promise<vendor | null> {
  const responseVendorInfo = await fetch(
    `${import.meta.env.VITE_BE}/vendor/${vendor_id}`
  );

  if (!responseVendorInfo.ok) {
    throw new Error("Failed to fetch vendor info");
  }

  const vendorDetail = await responseVendorInfo.json();
  return vendorDetail;
}

export async function deleteVendorData(vendor_id: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BE}/vendor/${vendor_id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Delete Procurement Failed");
  }

  return { delete: true };
}
