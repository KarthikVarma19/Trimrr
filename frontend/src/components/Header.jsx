import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button.jsx";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut } from "lucide-react";
import { UrlState } from "@/Context/context";
import useFetch from "@/hooks/useFetch";
import { logout } from "@/db/apiAuth";
import { BarLoader } from "react-spinners";

const Wordmark = () => (
  <Link to="/" className="group flex items-center gap-2">
    <span className="grid h-7 w-7 place-items-center rounded-md bg-primary font-serif text-lg leading-none text-primary-foreground">
      t
    </span>
    <span className="font-serif text-xl tracking-tight">trimrr</span>
  </Link>
);

const initials = (name, email) => {
  const source = name || email || "";
  return source.trim().charAt(0).toUpperCase() || "U";
};

const Header = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = UrlState();

  const { loading, fn: fnLogout } = useFetch(logout);

  return (
    <header className="sticky top-0 z-30 -mx-4 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:-mx-6 sm:px-6">
      <nav className="flex h-16 items-center justify-between">
        <Wordmark />

        {!user ? (
          <Button variant="outline" onClick={() => navigate("/auth")}>
            Log in
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-9 w-9 cursor-pointer border border-border">
                <AvatarImage
                  src={user?.user_metadata?.profile_pic}
                  className="object-cover"
                />
                <AvatarFallback className="bg-secondary text-sm font-medium">
                  {initials(
                    user?.user_metadata?.name,
                    user?.user_metadata?.email || user?.email
                  )}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="font-medium">
                  {user?.user_metadata?.name || "Your account"}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.user_metadata?.email || user?.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={() =>
                  fnLogout().then(() => {
                    fetchUser();
                    navigate("/");
                  })
                }
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>
      {loading && (
        <BarLoader
          className="absolute inset-x-0 bottom-0"
          width="100%"
          height={2}
          color="oklch(0.755 0.115 173)"
        />
      )}
    </header>
  );
};

export default Header;
