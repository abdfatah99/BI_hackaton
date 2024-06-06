// import App from "@/App.tsx";
import { LoaderFunctionArgs, createBrowserRouter } from "react-router-dom";
import ProcurementPage from "./procurement/page";
import ErrorPage from "./error-page";
import AddProcurement from "./procurement/add-procurement/page";
import ProcurementDetail from "./procurement/procurement-detail/page";
import Vendor from "./vendor/page";
import Tender from "./tender/page";
// import Contract from "./contract/page";
import Layout from "./layout";
import {
  getProcurementData,
  getProcurementDataDetail,
  getProductOfProcurement,
} from "@/services/procurement";
import { Procurement } from "procurement";
import Home from "./home/page";
import { vendor } from "vendor";
import { getListOfVendor, getVendorDetail } from "@/services/vendor";
import VendorDetailPage from "./vendor/vendor-detail/page";
import AddVendorPage from "./vendor/add-vendor/page";
import TenderDetail from "./tender/tender-detail/page";
import {
  getDetailProposedTenderPrice,
  getListOfTender,
  // getTenderDesiredVendor,
  getTenderDetail,
  // getTenderProposedPrice,
} from "@/services/tender";
import {
  TAddTenderParticipant,
  TTender,
  TTenderProposedPrice,
  // TTenderDesiredVendor,
  // TTenderProposedPrice,
} from "tender";
import AddTender from "./tender/add-tender/page";
import TenderProposedDetail from "./tender/tender-detail/tender-propose-detail/page";
import { Product } from "product";
import EditVendor from "./vendor/edit-vendor/page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "procurement",
        element: <ProcurementPage />,
        loader: async () => {
          // const data: procurement[] = getProcurementData();
          return getProcurementData() as Promise<Procurement[]>;
        },
      },
      {
        path: "procurement/add-procurement",
        element: <AddProcurement />,
        loader: async () => {
          return getDetailProposedTenderPrice;
        },
      },
      {
        path: "procurement/:id",
        element: <ProcurementDetail />,
        loader: async ({
          params,
        }: LoaderFunctionArgs): Promise<{
          procurementInfo: Procurement;
          productOfProcurement: Product[];
        }> => {
          const { id } = params;
          if (!id) {
            throw new Error("ID parameter is required");
          }

          // get procurement details and products concurrently
          const [procurementInfo, productOfProcurement] = await Promise.all([
            // Detail informatoin about the Procurement
            getProcurementDataDetail(id) as Promise<Procurement>,

            // Product that requested by the applicant division via the procurement
            getProductOfProcurement(id) as Promise<Product[]>,
          ]);

          return { procurementInfo, productOfProcurement };
        },
      },
      {
        path: "vendor",
        element: <Vendor />,
        loader: async () => {
          return getListOfVendor() as Promise<vendor[]>;
        },
      },
      {
        path: "vendor/:vendor_id",
        element: <VendorDetailPage />,
        loader: async ({
          params,
        }: LoaderFunctionArgs): Promise<vendor | undefined> => {
          const { vendor_id } = params;
          if (!vendor_id) {
            throw new Error("NIB parameter is required");
          }

          return getVendorDetail(vendor_id) as Promise<vendor>;
        },
      },
      {
        path: "vendor/add-vendor",
        element: <AddVendorPage />,
      },
      {
        path: "vendor/edit-vendor/:vendor_id",
        element: <EditVendor />,
        loader: async ({
          params,
        }: LoaderFunctionArgs): Promise<vendor | undefined> => {
          const { vendor_id } = params;
          if (!vendor_id) {
            throw new Error("Vendor Id parameter is required");
          }

          return getVendorDetail(vendor_id) as Promise<vendor>;
        },
      },
      {
        path: "tender",
        element: <Tender />,
        loader: async () => {
          return getListOfTender() as Promise<Procurement[]>;
        },
      },
      {
        path: "tender/:id_procurement",
        element: <TenderDetail />,
        loader: async ({ params }: LoaderFunctionArgs) => {
          // In this case, tender is is Procurement id
          const { id_procurement } = params;
          if (!id_procurement) {
            throw new Error("Tender ID is required");
          }

          return getTenderDetail(id_procurement) as Promise<TTender[]>;
        },
      },
      {
        path: "tender/:procurement_id/:vendor_id",
        element: <TenderProposedDetail />,
        loader: async ({ params }: LoaderFunctionArgs) => {
          const { procurement_id, vendor_id } = params;

          if (!procurement_id || !vendor_id) {
            throw new Error("Procurement id and vendor id is required");
          }

          return getDetailProposedTenderPrice(
            procurement_id,
            vendor_id
          ) as Promise<TTenderProposedPrice[]>;
        },
      },
      {
        path: "tender/:id_procurement/add-tender",
        element: <AddTender />,
        loader: async ({
          params,
        }: LoaderFunctionArgs): Promise<TAddTenderParticipant> => {
          const { id_procurement } = params;

          if (!id_procurement) {
            throw new Error("Procurement id required");
          }

          const listOfVendor = (await getListOfVendor()) as vendor[];

          return { id_procurement, listOfVendor };
        },
      },
      // {
      //   path: "contract",
      //   element: <Contract />,
      //   loader: async () => {
      //     return getListOfTender() as TTender[];
      //   },
      // },
    ],
  },
]);

export default router;
