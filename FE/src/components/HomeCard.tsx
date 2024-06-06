import { Link } from "react-router-dom";

interface IHomeCard {
  title: string;
  subTitle: string;
  logo: string;
  href: string;
}

function HomeCard({ title, subTitle, logo, href }: IHomeCard) {
  return (
    <Link
      className="flex flex-row justify-between p-4 rounded-xl shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
      to={href}
    >
      <div className="flex flex-col gap-1">
        <p className="text-base font-bold">{title}</p>
        <p className="text-[12px]">{subTitle}</p>
      </div>
      <img src={logo} alt="" className="h-[40px] w-10" />
    </Link>
  );
}

export default HomeCard;
