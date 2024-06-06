import procurementLogo from "@/assets/home-logo/pengadaan-logo.svg";
import vendorLogo from "@/assets/home-logo/vendor-logo.svg";
import tenderLogo from "@/assets/home-logo/tender-logo.svg";
import contractLogo from "@/assets/home-logo/contract-logo.svg";
import HomeCard from "@/components/HomeCard";

function Home() {
  return (
    <>
      <main className="container mt-9">
        <div className="flex flex-col gap-4">
          <HomeCard
            title="Procurement"
            subTitle="List of Procurement"
            logo={procurementLogo}
            href="/procurement"
          />
          <HomeCard
            title="Vendor"
            subTitle="List of Vendor"
            logo={vendorLogo}
            href="/vendor"
          />
          <HomeCard
            title="Tender"
            subTitle="List of Tender"
            logo={tenderLogo}
            href="/tender"
          />
          <HomeCard
            title="Contract"
            subTitle="List of Contract"
            logo={contractLogo}
            href="contract"
          />
        </div>
      </main>
    </>
  );
}

export default Home;
