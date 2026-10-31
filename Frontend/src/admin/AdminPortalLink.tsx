import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

type AdminPortalLinkProps = {
  className?: string;
};

export default function AdminPortalLink({
  className = "",
}: AdminPortalLinkProps) {
  return (
    <Link
      to="/admin/login"
      className={`${className} inline-flex min-h-11 items-center justify-center gap-2 rounded-full border !border-red-600 !bg-red-600 px-4
          text-xs font-bold !text-white shadow-md transition-all
         duration-300 ease-in-out hover:-translate-y-1 hover:scale-105
          hover:!border-red-700 hover:!bg-red-700 hover:shadow-lg active:scale-95`}
    >
      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
      Admin portal
    </Link>
  );
}
