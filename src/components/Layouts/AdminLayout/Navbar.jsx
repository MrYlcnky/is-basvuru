import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faBell,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function Navbar({ onOpenDrawer }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
      <div className="h-16 max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <button
            onClick={onOpenDrawer}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md hover:bg-white/5"
            aria-label="Menüyü aç"
          >
            <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
          </button>

          {/* Logo */}
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

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            className="relative w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center cursor-pointer"
            aria-label="Bildirimler"
          >
            <FontAwesomeIcon icon={faBell} className="w-6 h-6" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-fuchsia-500 rounded-full" />
          </button>

          {/* Profile */}
          <button
            aria-label="Profil menüsü"
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 ring-2 ring-white/10 flex items-center justify-center hover:opacity-90 cursor-pointer"
          >
            <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
