import Link from "next/link";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div className="fixed inset-x-0 top-0 h-fit bg-zinc-100 border-b border-zinc-300  z-[10] py-2">
      <div className="container flex justify-between h-full gap-2 mx-auto max-w-7xl item-center">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="w-8 h-8 sm:h-6 sm:w-6"></Icons.logo>
          <p className="hidden text-sm font-medium text-zinc-700 md:block">
            Breadit
          </p>
        </Link>
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
