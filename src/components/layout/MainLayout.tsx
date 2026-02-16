import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import DesktopSidebar from "./DesktopSidebar";
import NotificationCenter from "./NotificationCenter";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex w-full">
      <DesktopSidebar />
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto relative">
        {/* Header bar with notification bell */}
        <div className="sticky top-0 z-40 flex items-center justify-end p-3 md:p-4">
          <NotificationCenter />
        </div>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
