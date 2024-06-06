// import { procurement } from 'procurement';
// import procurementData from "@/assets/data/list-of-procurement.json";
import procurementItemData from "@/assets/data/office-stationery.json";
import { Procurement, procurementItem } from "procurement";
import { Product } from "product";

export async function getProcurementData(): Promise<Procurement[]> {
  const response = await fetch(`${import.meta.env.VITE_BE}/procurement`);

  if (!response.ok) {
    throw new Error("Failed to fetch procurement data");
  }

  const data: Procurement[] = await response.json();
  return data;
}

export async function getProcurementDataDetail(
  id: string
): Promise<Procurement> {
  const procurementDataResponse = await fetch(
    `${import.meta.env.VITE_BE}/procurement/${id}`
  );

  if (!procurementDataResponse.ok) {
    throw new Error("Failed to fetch procurement data");
  }

  const data: Procurement = await procurementDataResponse.json();
  return data;
}

export function getProcurementItemDetail(): procurementItem[] {
  // get all product data with procurement id is {id}

  return procurementItemData;
}

export async function getProductOfProcurement(id: string): Promise<Product[]> {
  const responseProduct = await fetch(
    `http://localhost:8000/procurement/${id}/product`
  );
  const productData: Product[] = await responseProduct.json();
  return productData;
}

export async function deleteProcurment(id: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BE}/procurement/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    // throw new Error("Failsed to Delete the procurement proposal");
    return new Error("Delete Procurement Failed");
  }

  return { delete: true };
}
