// This is main layout
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

function layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default layout;
