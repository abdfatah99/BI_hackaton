// import { ReactComponent as navLogo } from "../assets/nav-icon-mobile.svg";

// import navLogo from "../assets/nav-icon-mobile.svg?react"
import navLogo from "@/assets/nav-icon-mobile.svg";
// import searchLogo from "../assets/search.svg";
import menuLogo from "@/assets/menu.svg";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { Toaster } from "./ui/toaster";

function Navbar() {
  return (
    <>
      <nav className="container h-16 flex flex-row justify-between">
        <div className="flex flex-row max-w-max items-center gap-1">
          <Link to="/">
            <img src={navLogo} alt="" />
          </Link>
          <p>eProcurement</p>
        </div>

        <div className="flex flex-row gap-3 items-center">
          <Sheet>
            <SheetTrigger>
              <img src={menuLogo} alt="" />
            </SheetTrigger>
            <SheetContent className="">
              <p>eProcurement</p>
              <div className="flex flex-col mt-5 gap-2">
                <Link
                  to="/procurement"
                  className="hover:bg-slate-100 p-1 rounded-sm"
                >
                  Procurement
                </Link>
                <Link
                  to="/vendor"
                  className="hover:bg-slate-100 p-1 rounded-sm"
                >
                  Vendor
                </Link>
                <Link
                  to="/tender"
                  className="hover:bg-slate-100 p-1 rounded-sm"
                >
                  Tender
                </Link>
                <Link
                  to="/contract"
                  className="hover:bg-slate-100 p-1 rounded-sm"
                >
                  Contract
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      <hr />

      <Toaster />
    </>
  );
}

export default Navbar;
