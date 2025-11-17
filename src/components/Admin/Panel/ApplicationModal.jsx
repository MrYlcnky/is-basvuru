// src/components/Admin/Panel/ApplicationModal.jsx
import React, { useMemo, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faGavel,
  faXmark,
  faHistory,
  faCheckCircle,
  faBan,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import ReadOnlyApplicationView from "./ReadOnlyApplicationView";
import Swal from "sweetalert2";

// --- Akış Tanımları (Aynı) ---
const STAGES = [
  { key: "departman_muduru", label: "Departman Müdürü", role: "dm" },
  { key: "genel_mudur", label: "Genel Müdür", role: "gm" },
  { key: "ik", label: "İnsan Kaynakları", role: "ik" },
];

const STAGES_MAP = {
  departman_muduru: { role: "dm", next: "genel_mudur" },
  genel_mudur: { role: "gm", next: "ik" },
  ik: { role: "ik", next: "tamamlandi" },
  tamamlandi: { role: null, next: null },
};

const getAuthRoleForCheck = (role) => {
  if (role === "admin" || role === "ik_spv" || role === "ik_user") return "ik";
  return role;
};

// YENİ: İK SPV veya Admin mi kontrolü
const isIKSupervisor = (role) => {
  return role === "admin" || role === "ik_spv";
};
// --- /Akış Tanımları ---

export default function ApplicationModal({
  data,
  auth,
  onClose,
  onAction,
  currentStage = "departman_muduru",
}) {
  const [note, setNote] = useState("");
  const [activeTab, setActiveTab] = useState("summary");

  // ESC tuşu ile kapatma (Aynı)
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // Onay Akışı için Notları Çekme (Aynı)
  const { stageIndex, approvalNotes } = useMemo(() => {
    const stageIndex = Math.max(
      0,
      STAGES.findIndex((s) => s.key === currentStage)
    );
    const approvalNotes = (data.notes || []).filter(
      (n) => n.action === "ONAYLANDI"
    );
    return { stageIndex, approvalNotes };
  }, [currentStage, data.notes]);

  // Not zorunluluğu kontrolü (Aynı)
  const validateNote = () => {
    if (!note || note.trim().length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Açıklama Zorunlu",
        text: `İşlemi tamamlamak için lütfen 'Açıklama Notu' alanını doldurun.`,
        background: "#1F2937",
        color: "#E5E7EB",
        confirmButtonColor: "#3B82F6",
      });
      return false;
    }
    return true;
  };

  // 1. Standart Onay/Red İşlemi (Aynı)
  const handleApprovalClick = (actionType) => {
    const userRoleStage = getAuthRoleForCheck(auth?.role);
    const currentStageLabel =
      STAGES.find((s) => s.key === currentStage)?.label || "Bilinmeyen Aşama";

    if (userRoleStage !== STAGES_MAP[currentStage].role) {
      Swal.fire({
        icon: "error",
        title: "İşlem Yetkiniz Yok",
        text: `Bu başvuru şu anda "${currentStageLabel}" aşamasında onay bekliyor. Sadece yetkili kullanıcı işlem yapabilir.`,
        background: "#1F2937",
        color: "#E5E7EB",
        confirmButtonColor: "#3B82F6",
      });
      return;
    }

    if (!validateNote()) return;
    onAction?.(actionType, note);
  };

  // 2. Revize Talebi İşlemi (Aynı)
  const handleRevisionRequestClick = () => {
    if (!validateNote()) return;
    onAction?.("request_revision", note);
  };

  // 3. YENİ: Revize Karar İşlemi
  const handleRevisionDecisionClick = (actionType) => {
    if (!validateNote()) return;
    onAction?.(actionType, note); // "approve_revision" veya "reject_revision"
  };

  // --- GÜNCELLENDİ (İK SPV Revize Mantığı Geri Geldi) ---
  // Buton görünürlüklerini belirle
  const canTakeAction =
    data.status === "Bekleyen" &&
    getAuthRoleForCheck(auth?.role) === STAGES_MAP[currentStage]?.role;

  // Revizeyi SADECE tamamlanmışsa ve İK SPV DEĞİLSE iste
  const canRequestRevision =
    (data.status === "Onaylanan" || data.status === "Reddedilen") &&
    !isIKSupervisor(auth?.role);

  // Revizeye SADECE İK SPV/Admin karar verebilir
  const canDecideRevision =
    data.status === "Revize Talebi" && isIKSupervisor(auth?.role);

  // Revize bölümünün tamamını göster
  const showRevisionSection =
    canRequestRevision || canDecideRevision || data.status === "Revize Talebi";
  // --- /GÜNCELLENDİ ---

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 " aria-hidden />
      <div className="relative w-full max-w-6xl h-full max-h-[95vh] flex flex-col">
        <div className="rounded-2xl border border-gray-700 bg-gray-900/90 shadow-2xl overflow-hidden flex flex-col flex-1">
          {/* Başlık (Aynı) */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700 bg-gray-800/50">
            <div>
              <h3 className="text-lg font-semibold text-white">{data.name}</h3>
              <div className="text-xs text-gray-400">
                {data.id} • {data.date}
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700/60 text-gray-200 cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="mr-2 w-3 h-3" />
              Kapat
            </button>
          </div>

          {/* Sekme Butonları (Aynı) */}
          <div className="flex-shrink-0 px-5 pt-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <TabButton
                icon={faGavel}
                label="Özet & Karar"
                isActive={activeTab === "summary"}
                onClick={() => setActiveTab("summary")}
              />
              <TabButton
                icon={faFileLines}
                label="Tüm Başvuru Formu"
                isActive={activeTab === "details"}
                onClick={() => setActiveTab("details")}
              />
            </div>
          </div>

          {/* Sekme İçerikleri */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* Sekme 1 (Özet & Karar) */}
            <div className={activeTab === "summary" ? "block" : "hidden"}>
              {/* 1. Onay Akışı (Dinamik Notlu) (Aynı) */}
              <Section title="Onay Akışı">
                <ol className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  {STAGES.map((s, i) => {
                    const approverNote = approvalNotes[i];
                    const isCompleted = i < stageIndex;
                    const isActive =
                      i === stageIndex && data.status === "Bekleyen";
                    const isRevision = data.status === "Revize Talebi"; // YENİ

                    return (
                      <li
                        key={s.key}
                        className="flex-1 flex items-center gap-3 p-4 rounded-lg bg-gray-800 border border-gray-700"
                      >
                        <span
                          className={`flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold
                            ${
                              isCompleted
                                ? "bg-emerald-500 border-emerald-400 text-white"
                                : isActive
                                ? "bg-amber-500 border-amber-400 text-white animate-pulse"
                                : isRevision // YENİ
                                ? "bg-blue-500 border-blue-400 text-white"
                                : "bg-gray-700 border-gray-600 text-gray-400"
                            }`}
                        >
                          {i + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-gray-100">
                            {s.label}
                          </div>
                          {isCompleted && approverNote ? (
                            <div className="text-xs text-emerald-300">
                              Onay: {approverNote.user}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">
                              {isActive
                                ? "Güncel aşama"
                                : isRevision // YENİ
                                ? "Revize bekleniyor"
                                : "Bekliyor"}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </Section>

              {/* 2. Karar & Açıklama (Aynı) */}
              <Section title="Karar & Açıklama">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="decisionNote"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Açıklama Notu (Tüm işlemler için zorunlu)
                    </label>
                    <textarea
                      id="decisionNote"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Lütfen işlem (onay, red, revize) için bir açıklama giriniz..."
                      className="w-full min-h-[120px] rounded-xl bg-gray-800/60 border border-gray-700 p-3 text-sm text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-1 flex flex-col justify-between">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Karar Ver
                    </label>

                    {/* Durum 1: Başvuru "Bekleyen" statüsünde */}
                    {canTakeAction && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleApprovalClick("reject")}
                            className="h-12 rounded-xl border border-rose-500/50 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 cursor-pointer transition-colors"
                          >
                            Reddet
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApprovalClick("approve")}
                            className="h-12 rounded-xl border border-emerald-500/50 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 cursor-pointer transition-colors"
                          >
                            Onayla
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                          (Sıra: DM → GM → İK)
                        </p>
                      </div>
                    )}

                    {/* Durum 2: Karar verilmiş veya sıra sende değil */}
                    {!canTakeAction && data.status === "Bekleyen" && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800 text-gray-400 text-sm">
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="text-amber-400"
                        />
                        <span>Sıradaki onayı bekliyor.</span>
                      </div>
                    )}

                    {/* Durum 3: Akış tamamlanmış */}
                    {!canTakeAction &&
                      (data.status === "Onaylanan" ||
                        data.status === "Reddedilen") && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800 text-gray-400 text-sm">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="text-emerald-400"
                          />
                          <span>Bu başvuru karara bağlanmıştır.</span>
                        </div>
                      )}

                    {/* YENİ: Durum 4: Revize bekleniyor (ve sen SPV değilsin) */}
                    {!canTakeAction &&
                      data.status === "Revize Talebi" &&
                      !canDecideRevision && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800 text-gray-400 text-sm">
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="text-blue-400"
                          />
                          <span>İK SPV revize onayı bekleniyor.</span>
                        </div>
                      )}
                  </div>
                </div>
              </Section>

              {/* --- 3. GÜNCELLENDİ (İK SPV Revize Mantığı Geri Geldi) --- */}
              {showRevisionSection && (
                <Section title="Karar Değiştirme Talebi">
                  <div className="flex flex-col items-center">
                    {/* Durum 1: Başvuru "Onaylı"/"Red" (SPV/Admin hariç) */}
                    {canRequestRevision && (
                      <div className="w-full max-w-sm space-y-2 text-center">
                        <p className="text-sm text-gray-300 mb-3">
                          Verilen kararda bir hata olduğunu düşünüyorsanız,
                          açıklama girerek revize talebi oluşturabilirsiniz.
                        </p>
                        <button
                          type="button"
                          onClick={handleRevisionRequestClick}
                          className="h-12 w-full rounded-xl border border-yellow-500/50 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 cursor-pointer transition-colors flex items-center justify-center gap-2"
                        >
                          <FontAwesomeIcon icon={faHistory} />
                          Revize Talebi Oluştur
                        </button>
                        <p className="text-xs text-gray-500">
                          (Bu talep İK SPV onayına gidecektir)
                        </p>
                      </div>
                    )}

                    {/* Durum 2: "Revize Talebi" modunda (Sadece SPV/Admin görür) */}
                    {canDecideRevision && (
                      <div className="w-full max-w-md space-y-2 text-center">
                        <p className="text-sm text-gray-300 mb-3">
                          Bu başvuru için bir revize talebi alındı. Talebi
                          onaylarsanız süreç, talep edenin adımına geri döner.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              handleRevisionDecisionClick("reject_revision")
                            }
                            className="h-12 rounded-xl border border-rose-500/50 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 cursor-pointer transition-colors"
                          >
                            <FontAwesomeIcon icon={faBan} className="mr-2" />
                            Revizeyi Reddet
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleRevisionDecisionClick("approve_revision")
                            }
                            className="h-12 rounded-xl border border-emerald-500/50 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 cursor-pointer transition-colors"
                          >
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="mr-2"
                            />
                            Revizeyi Onayla
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Durum 3: Revize bekleniyor (ve sen SPV değilsin) */}
                    {data.status === "Revize Talebi" && !canDecideRevision && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-800 text-gray-400 text-sm">
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="text-blue-400"
                        />
                        <span>İK SPV revize onayı bekleniyor.</span>
                      </div>
                    )}
                  </div>
                </Section>
              )}
              {/* --- /GÜNCELLENDİ --- */}

              {/* 4. Özetler & Notlar (Aynı) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <Section title="Başvuru Özeti">
                  <Row label="Şubeler" value={data.branches.join(", ")} />
                  <Row label="Alanlar" value={data.areas.join(", ")} />
                  <Row
                    label="Departmanlar"
                    value={data.departments.join(", ")}
                  />
                  <Row label="Pozisyonlar" value={data.roles.join(", ")} />
                </Section>

                <Section title="İşlem Geçmişi / Notlar">
                  <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
                    {(data.notes || []).length > 0 ? (
                      [...data.notes].reverse().map((note, index) => (
                        <div
                          key={index}
                          className="text-sm border-b border-gray-700/50 pb-3 last:border-b-0"
                        >
                          <p className="text-gray-100">{note.note}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-xs font-medium text-gray-400">
                              - {note.user}
                            </span>
                            <span className="text-xs text-gray-500">
                              {note.date} ({note.action})
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        Henüz bir işlem notu yok.
                      </p>
                    )}
                  </div>
                </Section>
              </div>
            </div>

            {/* Sekme 2: Tüm Başvuru Formu (Aynı) */}
            <div className={activeTab === "details" ? "block" : "hidden"}>
              <ReadOnlyApplicationView data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Modal İçi Yardımcı Bileşenler (Aynı) ---

function TabButton({ icon, label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-t-lg border-b-2 text-sm font-medium transition-all focus:outline-none
            ${
              isActive
                ? "border-blue-400 bg-gray-800/70 text-white"
                : "border-transparent text-gray-400 hover:bg-gray-800/40 hover:text-gray-200"
            }`}
    >
      <FontAwesomeIcon icon={icon} className="w-4 h-4" />
      {label}
    </button>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-gray-700 bg-gray-800/40 mb-5">
      <h4 className="font-semibold px-4 py-3 border-b border-gray-700 text-gray-100">
        {title}
      </h4>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Row({ label, value, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 py-1.5">
      <div className="text-gray-400 text-sm min-w-[140px] shrink-0">
        {label}
      </div>
      <div className="flex-1 text-sm text-gray-100">{value || children}</div>
    </div>
  );
}
