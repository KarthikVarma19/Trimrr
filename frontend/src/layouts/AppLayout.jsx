import Header from "../components/Header.jsx";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
        <Header />
        <main className="py-4">
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <span className="font-serif text-base text-foreground">trimrr</span>
          <span>
            Built by Karthik Varma · React, Spring Boot &amp; PostgreSQL
          </span>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
