import listOfDesiredTender from "@/assets/data/list-of-tender-desired-vendor.json";
import { TTenderDesiredVendor, TTender, TTenderProposedPrice } from "tender";
import { Procurement } from "procurement";

// for tender page
export async function getListOfTender(): Promise<Procurement[]> {
  const response = await fetch(`${import.meta.env.VITE_BE}/tender`);

  if (!response.ok) {
    throw new Error("Failed to fetch list of tender data");
  }

  const listOfTender: Procurement[] = await response.json();

  return listOfTender;
}

// for tender-detail page
export async function getTenderDetail(
  procurement_id: string
): Promise<TTender[]> {
  const response = await fetch(
    `${import.meta.env.VITE_BE}/tender/${procurement_id}`
  );

  if (!response.ok) {
    throw new Error("SERVICE - getTenderDetail() Fail to Fetch");
  }

  const listOfTender: TTender[] = await response.json();

  return listOfTender;
}

export function getTenderDesiredVendor(): TTenderDesiredVendor[] {
  return listOfDesiredTender;
}

// export function getTenderProposedPrice(): TTenderProposedPrice[] {
//   return listOfProposedPrice;
// }

export async function addTender(procurement_id: string) {
  // change procurement is_tender status -> true
  const response = await fetch(
    `${import.meta.env.VITE_BE}/procurement/${procurement_id}/tender`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    throw new Error("SERVICE - Post data tender Failed");
  }

  return { post: true };
}

export async function getDetailProposedTenderPrice(
  id_procurement: string,
  id_vendor: string
): Promise<TTenderProposedPrice[]> {
  const response = await fetch(
    `${import.meta.env.VITE_BE}/tender/${id_procurement}/${id_vendor}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch detail product proposed price");
  }

  const data: TTenderProposedPrice[] = await response.json();
  return data;
}
