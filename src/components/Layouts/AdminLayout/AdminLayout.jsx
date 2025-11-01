// AdminLayout.jsx
import React, { useState, useMemo } from "react";
import { Outlet } from "react-router-dom"; // <-- EKLE
import { faGear, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import MobileMenuNavbar from "./MobileMenuNavbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("overview");

  const navItems = useMemo(
    () => [
      {
        id: "applications",
        label: "Tüm Başvurular",
        icon: faClipboardList, // istersen faClipboardList vb. ekleyebiliriz
        children: [
          { id: "applications/pending", label: "Bekleyen" },
          { id: "applications/approved", label: "Onaylanan" },
          { id: "applications/rejected", label: "Reddedilen" },
        ],
      },
      { id: "settings", label: "Ayarlar", icon: faGear },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Navbar onOpenDrawer={() => setDrawerOpen(true)} />

      <div className="flex-1 w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 flex gap-6">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          active={active}
          setActive={setActive}
          navItems={navItems}
        />

        {/* BODY */}
        <main className="flex-1 mt-6">
          <div className="rounded-2xl border h-full w-full border-white/10 bg-neutral-950/40 min-h-[320px]">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />

      <MobileMenuNavbar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active={active}
        setActive={(id) => {
          setActive(id);
          setDrawerOpen(false);
        }}
        navItems={navItems}
      />
    </div>
  );
}
