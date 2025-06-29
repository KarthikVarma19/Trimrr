import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex flex-col items-center">
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10 w-full">
        Made with 💗 by Karthik Varma
      </div>
    </div>
  );
};

export default AppLayout;
