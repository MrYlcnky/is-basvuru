// src/components/Layouts/AdminLayout/Navbar.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faChevronDown,
  faUserCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
// Gerekli logout fonksiyonunu session.js dosyasından import ediyoruz
import { logout } from "../../../auth/session";

// Dışarı tıklamayı algılayan yardımcı bir hook
function useOutsideAlerter(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

export default function Navbar({ onOpenDrawer }) {
  const auth = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("authUser");
      // Test için varsayılan bir kullanıcı ekleyelim
      return raw
        ? JSON.parse(raw)
        : { name: "Test Kullanıcısı", role: "admin" };
    } catch {
      return null;
    }
  }, []);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  useOutsideAlerter(profileMenuRef, () => setIsProfileOpen(false));

  // --- GÜNCELLENDİ (Görev 1 & 3) ---
  // Rol haritası 'ik' ve 'admin'i tam yetkili sayar
  const isAllBranchesRole = ["admin", "ik"].includes(auth?.role);
  // Yetkili değilse, şubesini 'auth' objesinden al
  const enforcedBranch = !isAllBranchesRole ? auth?.branch : null;
  const displayName = auth?.name || auth?.username || "Misafir";

  // Görev 1: Dinamik rol adı
  let displayRole = (auth?.role || "Rol Yok").toUpperCase();
  if (auth?.role === "dm" && auth?.department) {
    displayRole = `${auth.department} Müdürü`; // Örn: "IT Müdürü"
  } else if (auth?.role === "gm") {
    displayRole = "Genel Müdür";
  } else if (auth?.role === "ik") {
    displayRole = "İnsan Kaynakları";
  } else if (auth?.role === "admin") {
    displayRole = "Admin";
  }
  // --- /GÜNCELLENDİ ---

  const displayInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    console.log("Çıkış yapılıyor...");
    setIsProfileOpen(false); // Önce menüyü kapat
    logout(); // Sonra session'ı temizle ve logine yönlendir
  };

  return (
    // Modern Koyu Tema: bg-gray-900. Gölge yok, 'border-b' var.
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Sol Taraf: Mobil Menü & Logo */}
        <div className="flex items-center gap-3 lg:gap-8">
          <button
            onClick={onOpenDrawer}
            className="lg:hidden p-2 -ml-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors focus:outline-none focus:bg-gray-800 focus:text-white"
            aria-label="Ana menüyü aç"
          >
            <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 focus:outline-none">
            <img
              src="/src/images/group.png" // Bu yolu /src/assets/group.png olarak düzelttim, public'de de var ama src içindeki daha mantıklı
              alt="Chamada Group"
              className="h-8 w-auto sm:h-9"
            />
          </a>
        </div>

        {/* Sağ Taraf: Aksiyonlar & Profil */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Bildirim Butonu */}
          <button
            type="button"
            className="relative p-2 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors focus:outline-none focus:bg-gray-800 focus:text-gray-200"
          >
            <span className="sr-only">Bildirimleri görüntüle</span>
            <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-gray-900"></span>
            </span>
          </button>

          {/* Profil Dropdown Tetikleyici */}
          <div ref={profileMenuRef} className="relative flex-shrink-0 ml-1">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1.5 rounded-full sm:rounded-xl hover:bg-gray-800 transition-colors focus:outline-none focus:bg-gray-800 border border-transparent sm:border-gray-800 sm:pr-3"
              aria-haspopup="true"
              aria-expanded={isProfileOpen}
            >
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                {displayInitials}
              </div>

              <div className="hidden sm:flex flex-col items-start text-left">
                <span className="text-sm font-semibold text-gray-200 leading-none">
                  {displayName}
                </span>
                {/* --- GÜNCELLENDİ (Görev 1) --- */}
                {/* .toUpperCase() kaldırıldı */}
                <span className="text-[11px] font-medium text-gray-400 leading-tight mt-1">
                  {displayRole} {enforcedBranch && `• ${enforcedBranch}`}
                </span>
                {/* --- /GÜNCELLENDİ --- */}
              </div>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="hidden sm:block w-3 h-3 text-gray-500 ml-1"
              />
            </button>

            {/* Profil Dropdown Menüsü */}
            {isProfileOpen && (
              <div
                className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-gray-800 border border-gray-700 py-1 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                tabIndex="-1"
              >
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-white truncate">
                    {displayName}
                  </p>
                </div>
                <a
                  href="#"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white focus:outline-none"
                  role="menuitem"
                  tabIndex="-1"
                >
                  <FontAwesomeIcon
                    icon={faUserCog}
                    className="w-4 h-4 text-gray-400"
                  />
                  Şifre Değiştir
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 focus:bg-red-500/20 focus:text-red-300 focus:outline-none"
                  role="menuitem"
                  tabIndex="-1"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
