// src/components/Layouts/AdminLayout/Navbar.jsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom"; // YENİ: Sayfa yönlendirmesi için
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserCircle,
  faSignOutAlt,
  faKey,
  faClipboardList, // YENİ: Log ikonu
} from "@fortawesome/free-solid-svg-icons";
import {
  getApplications,
  getAuthRoleForCheck,
  updateApplicationStatus,
} from "../../../api/staticDB";
import { logout } from "../../../auth/session";
import ChangePasswordModal from "./ChangePasswordModal";
import ApplicationModal from "../../Admin/Panel/ApplicationModal";
import { formatDate } from "../../../utils/dateFormatter";
import Swal from "sweetalert2";

// Logo import edildi
import logo from "../../../assets/group.png";

// Dışarı tıklamayı algılayan yardımcı hook
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

export default function Navbar() {
  const navigate = useNavigate(); // YENİ: Hook tanımlandı
  const [auth, setAuth] = useState(null);
  const [allApplications, setAllApplications] = useState([]);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  // Modal kontrolü için State'ler
  const [selectedNotificationApp, setSelectedNotificationApp] = useState(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);

  const bellRef = useRef(null);
  const userMenuRef = useRef(null);
  useOutsideAlerter(bellRef, () => setIsBellOpen(false));
  useOutsideAlerter(userMenuRef, () => setIsUserMenuOpen(false));

  // Bildirimleri yenilemek için fonksiyon
  const refreshNotifications = () => {
    console.log("Navbar: Bildirimler yenileniyor...");
    const data = getApplications();
    setAllApplications(data);
  };

  useEffect(() => {
    // 1. Oturum bilgilerini al
    try {
      const raw = sessionStorage.getItem("authUser");
      setAuth(raw ? JSON.parse(raw) : null);
    } catch {
      setAuth(null);
    }

    // 2. İlk yüklemede verileri çek
    refreshNotifications();

    // 3. 'applicationsUpdated' sinyalini dinle
    window.addEventListener("applicationsUpdated", refreshNotifications);

    // 4. Temizleme
    return () => {
      window.removeEventListener("applicationsUpdated", refreshNotifications);
    };
  }, []);

  // Bildirim Çanı Mantığı
  const notifications = useMemo(() => {
    if (!auth || !allApplications.length) {
      return [];
    }
    const userCheckRole = getAuthRoleForCheck(auth.role);
    const targetStage = {
      dm: "departman_muduru",
      gm: "genel_mudur",
      ik: "ik",
    }[userCheckRole];
    if (!targetStage) {
      return [];
    }
    return allApplications.filter((app) => {
      if (app.status !== "Bekleyen") return false;
      if (app.approvalStage !== targetStage) return false;
      if (auth.role === "dm") {
        const appDepartments = app.departments || [];
        const appBranches = app.branches || [];
        if (auth.department && !appDepartments.includes(auth.department))
          return false;
        if (auth.branch && !appBranches.includes(auth.branch)) return false;
      }
      if (auth.role === "gm") {
        const appBranches = app.branches || [];
        if (auth.branch && !appBranches.includes(auth.branch)) return false;
      }
      return true;
    });
  }, [allApplications, auth]);

  // Bildirime tıklama işleyicisi (Modal açar)
  const handleNotificationClick = (app) => {
    setSelectedNotificationApp(app);
    setIsAppModalOpen(true);
    setIsBellOpen(false);
  };

  // Modal üzerinden işlem yapıldığında
  const handleModalAction = (actionType, note) => {
    if (!selectedNotificationApp) return;

    const result = updateApplicationStatus(
      selectedNotificationApp.id,
      actionType,
      note,
      auth
    );

    if (result.success) {
      let title = "İşlem Başarılı";
      let text = result.message;
      let icon = "success";

      if (actionType === "approve") {
        title = "Onaylandı";
      } else if (actionType === "reject") {
        title = "Reddedildi";
        icon = "error";
      } else if (actionType === "request_revision") {
        title = "Revize Talebi Gönderildi";
        icon = "info";
      } else if (actionType === "approve_revision") {
        title = "Revize Onaylandı";
        icon = "success";
      } else if (actionType === "reject_revision") {
        title = "Revize Reddedildi";
        icon = "warning";
      }

      Swal.fire(title, text, icon);

      refreshNotifications();
      window.dispatchEvent(new CustomEvent("applicationsUpdated"));
    } else {
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: result.message,
        confirmButtonColor: "#3B82F6",
      });
    }

    setIsAppModalOpen(false);
    setSelectedNotificationApp(null);
  };

  // YENİ: Logları görebilecek roller
  const canViewLogs = ["admin", "ik_spv", "ik_user"].includes(auth?.role);

  return (
    <>
      <nav className="bg-gray-800 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Sol Taraf (Logo) */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => navigate("/admin/panel")}
            >
              <img src={logo} alt="Chamda Group Logo" className="h-10 w-auto" />
            </div>

            {/* Sağ Taraf (İkonlar) */}
            <div className="flex items-center gap-4">
              {/* === YENİ: LOG BUTONU (Sadece yetkililer görür) === */}
              {canViewLogs && (
                <button
                  onClick={() => navigate("/admin/logs")}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none transition-colors"
                  title="İşlem Geçmişi / Loglar"
                >
                  <FontAwesomeIcon icon={faClipboardList} className="h-6 w-6" />
                </button>
              )}

              {/* === BİLDİRİM ÇANI === */}
              <div className="relative" ref={bellRef}>
                <button
                  onClick={() => setIsBellOpen(!isBellOpen)}
                  className="relative rounded-full p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none transition-colors"
                  title="Bildirimler"
                >
                  <span className="sr-only">Bildirimleri görüntüle</span>
                  <FontAwesomeIcon icon={faBell} className="h-6 w-6" />

                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                        {notifications.length}
                      </span>
                    </span>
                  )}
                </button>

                {/* Açılır Bildirim Menüsü */}
                {isBellOpen && (
                  <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="border-b border-gray-200 px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">
                        Onay Bekleyen Başvurular
                      </p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-gray-500">
                          Yeni bildiriminiz yok.
                        </p>
                      ) : (
                        notifications.map((app) => (
                          <div
                            key={app.id}
                            onClick={() => handleNotificationClick(app)}
                            className="flex gap-3 border-b border-gray-100 px-4 py-3 hover:bg-gray-50 group cursor-pointer transition-colors"
                          >
                            <div className="flex-1">
                              <p className="truncate text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <span className="font-mono text-xs text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                                  {app.id}
                                </span>
                                <span className="truncate">{app.name}</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1 pl-1">
                                {formatDate(app.date)}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* === /BİLDİRİM ÇANI === */}

              {/* === KULLANICI MENÜSÜ === */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-full p-1 text-gray-400 hover:text-white focus:outline-none transition-colors"
                >
                  <FontAwesomeIcon icon={faUserCircle} className="h-6 w-6" />
                  <span className="hidden sm:inline text-sm font-medium text-gray-300">
                    {auth ? auth.name : "Kullanıcı"}
                  </span>
                </button>

                {/* Açılır Kullanıcı Menüsü */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <button
                      onClick={() => {
                        setIsChangePasswordModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon
                        icon={faKey}
                        className="w-4 h-4 text-gray-500"
                      />
                      Şifre Değiştir
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        logout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon
                        icon={faSignOutAlt}
                        className="w-4 h-4 text-gray-500"
                      />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
              {/* === /KULLANICI MENÜSÜ === */}
            </div>
          </div>
        </div>
      </nav>

      {/* Şifre Değiştirme Modalı */}
      {isChangePasswordModalOpen && auth && (
        <ChangePasswordModal
          auth={auth}
          onClose={() => setIsChangePasswordModalOpen(false)}
        />
      )}

      {/* Başvuru İşlem Modalı */}
      {isAppModalOpen && selectedNotificationApp && (
        <ApplicationModal
          data={selectedNotificationApp}
          auth={auth}
          onClose={() => {
            setIsAppModalOpen(false);
            setSelectedNotificationApp(null);
          }}
          onAction={handleModalAction}
          currentStage={selectedNotificationApp.approvalStage}
        />
      )}
    </>
  );
}
