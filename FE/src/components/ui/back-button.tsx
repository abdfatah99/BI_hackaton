import leftArrow from "@/assets/left-arrow.svg";
import { Link } from "react-router-dom";

export default function BackButton({ href }: { href: string }) {
  return (
    <Link
      to={href}
      className="max-w-max flex flex-row gap-[6px] text-slate-500 items-center"
    >
      <img src={leftArrow} alt="" />
      <p>Back</p>
    </Link>
  );
}
