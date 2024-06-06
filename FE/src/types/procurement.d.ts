// export type procurement = {
//   id: string;
//   procurement: string;
//   division: string;
//   amount: string;
// };

export type Procurement = {
  procurement_id: string;
  procurement_name: string;
  applicant_division: string;
  proc_number: number;
  amount: number;
  file_name: string;
  createdAt: string;
  updateAt: string | null;
};

export type procurementItem = {
  name: string;
  price: string;
  market_price: string;
};

