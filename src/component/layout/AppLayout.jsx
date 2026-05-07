import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="min-h-svh bg-[#f6f7fb] text-[#1d2939]">
      <AppSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="lg:pl-[252px]">
        <AppHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="px-4 py-6 md:px-6 xl:px-8">
          <div className="mx-auto max-w-[1380px]">
            <Outlet />

            <footer className="mt-8 border-t border-[#e6ebf0] pt-5 text-center text-xs text-[#8b97a6]">
              {`© ${new Date().getFullYear()} EthioTech. All rights reserved.`}
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AppLayout;
