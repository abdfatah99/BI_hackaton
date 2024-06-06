import { vendor } from "vendor";

export type TTender = {
  procurement_id: string;
  procurement_name: string;
  proc_number: string;
  applicant_division: string;
  vendor_id: string;
  company_name: string;
  index_value: string;
};

export type TTenderDesiredVendor = {
  id: string;
  index: string;
  company_name: string;
};

export type TAddTenderParticipant = {
  id_procurement: string;
  listOfVendor: vendor[];
};

export type TTenderProposedPrice = {
  procurement_id: string;
  procurement_name: string;
  proc_number: string;
  applicant_division: string;
  product_name: string;
  price: string;
  market_price: string;
  company_name: string;
  vendor_id: string;
  nib: string;
  email: string;
  propose_vendor_price: string;
  approval_status: string;
};
