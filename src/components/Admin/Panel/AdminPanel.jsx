import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faBell,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faHouse,
  faUsers,
  faCalendarDays,
  faChartLine,
  faGear,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Dark-themed Navbar + Left Sidebar (collapsible + mobile drawer)
 * - TailwindCSS only (no extra libs)
 * - Navbar (sticky) + Sidebar (desktop: collapsible, mobile: drawer)
 * - Body intentionally empty for your pages
 */
export default function AdminShell() {
  const [drawerOpen, setDrawerOpen] = useState(false); // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [active, setActive] = useState("overview");

  const navItems = [
    { id: "overview", label: "Genel Bakış", icon: faHouse },
    { id: "users", label: "Kullanıcılar", icon: faUsers },
    { id: "reservations", label: "Rezervasyonlar", icon: faCalendarDays },
    { id: "finance", label: "Finans", icon: faChartLine },
    { id: "settings", label: "Ayarlar", icon: faGear },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
        <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-white/5"
              aria-label="Menüyü aç"
            >
              <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <img
                src="/src/images/group.png"
                alt="Group Logo"
                className="h-10 w-auto"
              />
            </div>
          </div>

          {/* Search */}
          <div className="hidden md:flex items-center gap-3 w-full max-w-md">
            <div className="relative flex-1">
              <input
                placeholder="Ara (kullanıcı, rezervasyon, log...)"
                className="w-full rounded-lg bg-neutral-900 border border-white/10 pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <FontAwesomeIcon
                icon={faSearch}
                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="relative w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center cursor-pointer"
              aria-label="Bildirimler"
            >
              <FontAwesomeIcon icon={faBell} className="w-6 h-6" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-fuchsia-500 rounded-full" />
            </button>
            <button
              aria-label="Profil menüsü"
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 ring-2 ring-white/10 flex items-center justify-center hover:opacity-90 cursor-pointer"
            >
              <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT WRAPPER */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6">
        {/* SIDEBAR (desktop) */}
        <aside
          className={`hidden lg:flex flex-col transition-[width] duration-300 ease-in-out mt-6 rounded-2xl border border-white/10 bg-neutral-950/60 backdrop-blur ${
            collapsed ? "w-[84px]" : "w-64"
          }`}
        >
          {/* Collapse header */}
          <div className="p-3 flex items-center justify-between border-b border-white/10">
            <span
              className={`text-sm font-semibold transition-opacity ${
                collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              Menü
            </span>
            <button
              onClick={() => setCollapsed((v) => !v)}
              className="ml-auto w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center"
              aria-label="Menüyü daralt/genişlet"
              title={collapsed ? "Genişlet" : "Daralt"}
            >
              {collapsed ? (
                <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
              ) : (
                <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Nav items */}
          <nav className="p-2 space-y-1">
            {navItems.map(({ id, label, icon }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 border border-white/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    className={`w-5 h-5 ${
                      isActive
                        ? "text-indigo-400"
                        : "text-neutral-400 group-hover:text-neutral-200"
                    }`}
                  />
                  <span
                    className={`whitespace-nowrap transition-[opacity,transform] duration-200 ${
                      collapsed
                        ? "opacity-0 -translate-x-2 pointer-events-none"
                        : "opacity-100 translate-x-0"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Help / bottom card */}
          <div className={`mt-auto p-3 ${collapsed ? "hidden" : "block"}`}>
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-neutral-900 to-neutral-950 p-3">
              <p className="text-xs text-neutral-300">
                Yardım mı gerekiyor?{" "}
                <a
                  className="text-indigo-300 hover:text-indigo-200 underline underline-offset-4"
                  href="#"
                >
                  BT ile iletişime geç
                </a>
                .
              </p>
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-72 bg-neutral-950 border-r border-white/10 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Menü</span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-9 h-9 rounded-lg hover:bg-white/5"
                  aria-label="Menüyü kapat"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
                </button>
              </div>
              <nav className="space-y-1">
                {navItems.map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActive(id);
                      setDrawerOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm hover:bg-white/5 ${
                      active === id ? "bg-white/10" : ""
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={icon}
                      className="w-5 h-5 text-neutral-300"
                    />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* BODY (boş) */}
        <main className="flex-1 mt-6">
          {/* Buraya sayfa içerikleri gelecek */}
          <div className="rounded-2xl border border-white/10 bg-neutral-950/40 min-h-[320px] flex items-center justify-center text-neutral-500">
            Body (boş)
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="mt-8 border-t border-white/10 bg-neutral-950/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-xs text-neutral-400">
          <span>© {new Date().getFullYear()} Chamada Group</span>
          <span>v1.0.0 • Dark</span>
        </div>
      </footer>
    </div>
  );
}
