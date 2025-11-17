// src/api/staticDB.js

// Admin girişi için statik kullanıcılar (Sizin sağladığınız liste)
const USERS = [
  {
    id: 2,
    username: "ik_spv",
    password: "123",
    role: "ik_spv",
    name: "Ayşe Yılmaz (İK SPV)",
  },
  {
    id: 3,
    username: "ik_user",
    password: "123",
    role: "ik_user",
    name: "Fatma Demir (İK)",
  },
  {
    id: 1,
    username: "admin",
    password: "123",
    role: "admin",
    name: "Admin",
  },
  {
    id: 4,
    username: "gm_girne",
    password: "123",
    role: "gm",
    name: "Sezgin Bingül (GM)",
    branch: "Girne",
  },
  {
    id: 5,
    username: "gm_prestige",
    password: "123",
    role: "gm",
    name: "Prestige Genel Müdür (GM)",
    branch: "Prestige",
  },
  {
    id: 6,
    username: "it_girne",
    password: "123",
    role: "dm",
    name: "Ulaş Gencan (IT Girne)",
    department: "IT",
    branch: "Girne",
  },
  {
    id: 10,
    username: "it_prestige",
    password: "123",
    role: "dm",
    name: "Mehmet Gencan (IT Prestige)",
    department: "IT",
    branch: "Prestige",
  },
  {
    id: 7,
    username: "fb_girne",
    password: "123",
    role: "dm",
    name: "Gökhan Evran (F&B Müdürü)",
    department: "Casino F&B",
    branch: "Girne",
  },
  {
    id: 9,
    username: "fb_prestige",
    password: "123",
    role: "dm",
    name: "Oktay Bey (F&B Müdürü)",
    department: "Casino F&B",
    branch: "Prestige",
  },
  {
    id: 8,
    username: "live_prestige",
    password: "123",
    role: "dm",
    name: "Murat Bilgin (Canlı Oyun Müdürü)",
    department: "Casino Canlı Oyun",
    branch: "Prestige",
  },
];

// --- GÜNCELLENDİ: 10 Adet IT Senaryosuna Göre Başvurular (Fotoğraflı) ---
const APPLICATIONS = [
  // === 1. GRUP: SADECE IT GİRNE (4 Adet) ===

  // 1.1: Bekleyen (DM Aşamasında)
  {
    id: "A-40001",
    name: "Ali Vural (IT Girne)",
    branches: ["Girne"],
    areas: ["Hotel"],
    departments: ["IT"],
    roles: ["IT Destek Uzmanı"],
    date: "2025-11-10",
    age: 28,
    status: "Bekleyen",
    notes: [
      {
        user: "Sistem",
        note: "Yeni başvuru alındı.",
        date: "2025-11-10",
        action: "BAŞVURU",
      },
    ],
    appliedAt: "2025-11-10",
    approvalStage: "departman_muduru", // Ulaş Gencan (it_girne) onayı bekliyor
    personal: {
      foto: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      ad: "Ali",
      soyad: "Vural",
      dogumTarihi: "1997-01-15",
    },
    education: [{ seviye: "Lisans" }],
    jobDetails: {
      departmanPozisyonlari: [
        { value: "IT::IT Destek Uzmanı", label: "IT Destek Uzmanı", dept: "IT" },
      ],
    },
  },

  // 1.2: Reddedilen (GM Tarafından)
  {
    id: "A-40002",
    name: "Burcu Eser (IT Girne)",
    branches: ["Girne"],
    areas: ["Hotel"],
    departments: ["IT"],
    roles: ["Yazılımcı"],
    date: "2025-11-09",
    age: 26,
    status: "Reddedilen",
    notes: [
      {
        user: "Sistem",
        note: "Yeni başvuru alındı.",
        date: "2025-11-09",
        action: "BAŞVURU",
      },
      {
        user: "Ulaş Gencan (IT Girne)",
        note: "Teknik mülakat olumlu.",
        date: "2025-11-09",
        action: "ONAYLANDI",
      },
      {
        user: "Sezgin Bingül (GM)",
        note: "Maaş beklentisi bütçe dışında.",
        date: "2025-11-10",
        action: "REDDEDİLDİ",
      },
    ],
    appliedAt: "2025-11-09",
    approvalStage: "tamamlandi",
    personal: {
      foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      ad: "Burcu",
      soyad: "Eser",
      dogumTarihi: "1999-05-10",
    },
    education: [{ seviye: "Lisans" }],
    jobDetails: {
      departmanPozisyonlari: [
        { value: "IT::Yazılımcı", label: "Yazılımcı", dept: "IT" },
      ],
    },
  },

  // 1.3: Onaylanan
  {
    id: "A-40003",
    name: "Can Yılmaz (IT Girne)",
    branches: ["Girne"],
    areas: ["Hotel"],
    departments: ["IT"],
    roles: ["Ağ Uzmanı"],
    date: "2025-11-08",
    age: 30,
    status: "Onaylanan",
    notes: [
      {
        user: "Sistem",
        note: "Yeni başvuru alındı.",
        date: "2025-11-08",
        action: "BAŞVURU",
      },
      {
        user: "Ulaş Gencan (IT Girne)",
        note: "Onaylandı.",
        date: "2025-11-08",
        action: "ONAYLANDI",
      },
      {
        user: "Sezgin Bingül (GM)",
        note: "Onaylandı.",
        date: "2025-11-09",
        action: "ONAYLANDI",
      },
      {
        user: "Fatma Demir (İK)",
        note: "Evraklar tamam, işe alım onaylandı.",
        date: "2025-11-10",
        action: "ONAYLANDI",
      },
    ],
    appliedAt: "2025-11-08",
    approvalStage: "tamamlandi",
    personal: {
      foto: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      ad: "Can",
      soyad: "Yılmaz",
      dogumTarihi: "1995-02-02",
    },
    education: [{ seviye: "Lisans" }],
    jobDetails: {
      departmanPozisyonlari: [
        { value: "IT::Ağ Uzmanı", label: "Ağ Uzmanı", dept: "IT" },
      ],
    },
  },

  // 1.4: Revize Talebi (İK SPV Onayı Bekliyor)
  {
    id: "A-40004",
    name: "Derya Sancak (IT Girne)",
    branches: ["Girne"],
    areas: ["Hotel"],
    departments: ["IT"],
    roles: ["IT Destek Uzmanı"],
    date: "2025-11-07",
    age: 29,
    status: "Revize Talebi", // Ayşe Yılmaz (ik_spv) onayı bekliyor
    approvalStage: "tamamlandi", // Süreç bitmişti
    reviseRequestedByRole: "gm", // Sezgin Bingül (gm_girne) talep etti
    notes: [
      {
        user: "Sistem",
        note: "Yeni başvuru alındı.",
        date: "2025-11-07",
        action: "BAŞVURU",
      },
      {
        user: "Ulaş Gencan (IT Girne)",
        note: "Onaylandı.",
        date: "2025-11-07",
        action: "ONAYLANDI",
      },
      {
        user: "Sezgin Bingül (GM)",
        note: "Onaylandı.",
        date: "2025-11-08",
        action: "ONAYLANDI",
      },
      {
        user: "Fatma Demir (İK)",
        note: "İşe alım tamamlandı.",
        date: "2025-11-08",
        action: "ONAYLANDI",
      },
      {
        user: "Sezgin Bingül (GM)",
        note: "Adayın referanslarında bir sorun tespit edildi, lütfen süreci GM adımına geri çekin.",
        date: "2025-11-10",
        action: "REQUEST_REVISION",
      },
    ],
    appliedAt: "2025-11-07",
    personal: {
      foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      ad: "Derya",
      soyad: "Sancak",
      dogumTarihi: "1996-03-03",
    },
    education: [{ seviye: "Ön Lisans" }],
    jobDetails: {
      departmanPozisyonlari: [
        { value: "IT::IT Destek Uzmanı", label: "IT Destek Uzmanı", dept: "IT" },
      ],
    },
  },

  // === 2. GRUP: SADECE IT PRESTIGE (4 Adet) ===

  // 2.1: Bekleyen (GM Aşamasında)
  {
    id: "A-50001",
    name: "Emre Taş (IT Prestige)",
    branches: ["Prestige"],
    areas: ["Casino"],
    departments: ["IT"],
    roles: ["Yazılımcı"],
    date: "2025-11-10",
    age: 31,
    status: "Bekleyen",
    notes: [
      {
        user: "Sistem",
        note: "Yeni başvuru alındı.",
        date: "2025-11-10",
        action: "BAŞVURU",
      },
      {
        user: "Mehmet Gencan (IT Prestige)",
        note: "Portfolyosu incelendi, GM onayına sunuldu.",
        date: "2025-11-10",
        action: "ONAYLANDI",
      },
    ],
    appliedAt: "2025-11-10",
    approvalStage: "genel_mudur", // Prestige GM onayı bekliyor
    personal: {
      foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      ad: "Emre",
      soyad: "Taş",
      dogumTarihi: "1994-01-01",
    },
    education: [{ seviye: "Lisans" }],
    jobDetails: {
      departmanPozisyonlari: [
        { value: "IT::Yazılımcı", label: "Yazılımcı", dept: "IT" },
      ],
    },
  },

  // 2.2: Reddedilen (DM Tarafından)
  {
    id: "A-50002",
    name: "Fatih Gün (IT Prestige)",
    branches: ["Prestige"],
    areas: ["Casino"],
    departments: ["IT"],
    roles: ["Ağ Uzmanı"],
    date: "2025-11-09",
    age: 40,
    status: "Reddedilen",
    notes: [
      {
        user: "Sistem",
        note: "Yeni başvuru alındı.",
        date: "2025-11-09",
        action: "BAŞVURU",
      },
      {
        user: "Mehmet Gencan (IT Prestige)",
        note: "Sertifikaları eksik.",
        date: "2025-11-09",
        action: "REDDEDİLDİ",
      },
    ],
    appliedAt: "2025-11-09",
    approvalStage: "tamamlandi",
    personal: {
      foto: null, // Foto yok
      ad: "Fatih",
      soyad: "Gün",
      dogumTarihi: "1985-10-10",
    },
    education: [{ seviye: "Lisans" }],
    jobDetails: {
      departmanPozisyonlari: [
        { value: "IT::Ağ Uzmanı", label: "Ağ Uzmanı", dept: "IT" },
      ],
    },
  },

  // 2.3: Onaylanan
  {
    id: "A-50003",
    name: "Gökçe Arı (IT Prestige)",
    branches: ["Prestige"],
    areas: ["Hotel"],
    departments: ["IT"],
    roles: ["IT Destek Uzmanı"],
    date: "2025-11-08",
    age: 25,
    status: "Onaylanan",
    notes: [
      {
        user: "Sistem",
        note: "Yeni başvuru alındı.",
        date: "2025-11-08",
        action: "BAŞVURU",
      },
      {
        user: "Mehmet Gencan (IT Prestige)",
        note: "Onaylandı.",
        date: "2025-11-08",
        action: "ONAYLANDI",
      },
      {
        user: "Prestige Genel Müdür (GM)",
        note: "Onaylandı.",
        date: "2025-11-09",
        action: "ONAYLANDI",
      },
      {
        user: "Ayşe Yılmaz (İK SPV)",
        note: "İşe alım tamamlandı.",
        date: "2025-11-10",
        action: "ONAYLANDI",
      },
    ],
    appliedAt: "2025-11-08",
    approvalStage: "tamamlandi",
    personal: {
      foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      ad: "Gökçe",
      soyad: "Arı",
      dogumTarihi: "2000-01-01",
    },
    education: [{ seviye: "Ön Lisans" }],
    jobDetails: {
      departmanPozisyonlari: [
        { value: "IT::IT Destek Uzmanı", label: "IT Destek Uzmanı", dept: "IT" },
      ],
    },
  },

  // 2.4: Revize Talebi (DM Talep Etti)
  {
    id: "A-50004",
    name: "Hale Jale (IT Prestige)",
    branches: ["Prestige"],
    areas: ["Casino"],
    departments: ["IT"],
    roles: ["Yazılımcı"],
    date: "2025-11-07",
    age: 33,
    status: "Revize Talebi", // Ayşe Yılmaz (ik_spv) onayı bekliyor
    approvalStage: "tamamlandi",
    reviseRequestedByRole: "dm", // Mehmet Gencan (it_prestige) talep etti
    notes: [
      {
        user: "Sistem",
        note: "Yeni başvuru alındı.",
        date: "2025-11-07",
        action: "BAŞVURU",
      },
      {
        user: "Mehmet Gencan (IT Prestige)",
        note: "Reddedildi, tecrübesi yok.",
        date: "2025-11-07",
        action: "REDDEDİLDİ",
      },
      {
        user: "Mehmet Gencan (IT Prestige)",
        note: "Yanlışlıkla reddettim, CV'yi tekrar inceledim. Lütfen DM adımına geri alın.",
        date: "2025-11-10",
        action: "REQUEST_REVISION",
      },
    ],
    appliedAt: "2025-11-07",
    personal: {
      foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      ad: "Hale",
      soyad: "Jale",
      dogumTarihi: "1992-04-04",
    },
    education: [{ seviye: "Lisans" }],
    jobDetails: {
      departmanPozisyonlari: [
        { value: "IT::Yazılımcı", label: "Yazılımcı", dept: "IT" },
      ],
    },
  },

  // === 3. GRUP: HEM GİRNE HEM PRESTIGE IT (2 Adet) ===

  // 3.1: Bekleyen (DM Aşamasında)
  // Hem Ulaş Gencan hem Mehmet Gencan görmeli
  {
    id: "A-90001",
    name: "İkili Başvuru (Bekleyen)",
    branches: ["Girne", "Prestige"],
    areas: ["Hotel", "Casino"],
    departments: ["IT"],
    roles: ["Ağ Uzmanı"],
    date: "2025-11-10",
    age: 38,
    status: "Bekleyen",
    notes: [
      {
        user: "Sistem",
        note: "Yeni başvuru alındı.",
        date: "2025-11-10",
        action: "BAŞVURU",
      },
    ],
    appliedAt: "2025-11-10",
    approvalStage: "departman_muduru",
    personal: {
      foto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      ad: "İkili",
      soyad: "Başvuru B.",
      dogumTarihi: "1987-08-08",
    },
    education: [{ seviye: "Lisans" }],
    jobDetails: {
      departmanPozisyonlari: [
        { value: "IT::Ağ Uzmanı", label: "Ağ Uzmanı", dept: "IT" },
      ],
    },
  },

  // 3.2: Onaylanan (Girne hattından onaylanmış)
  // Hem Ulaş Gencan hem Mehmet Gencan görmeli
  {
    id: "A-90002",
    name: "İkili Başvuru (Onaylı)",
    branches: ["Girne", "Prestige"],
    areas: ["Hotel", "Casino"],
    departments: ["IT"],
    roles: ["Yazılımcı"],
    date: "2025-11-05",
    age: 29,
    status: "Onaylanan",
    notes: [
      {
        user: "Sistem",
        note: "Yeni başvuru alındı.",
        date: "2025-11-05",
        action: "BAŞVURU",
      },
      {
        user: "Ulaş Gencan (IT Girne)",
        note: "Aday Girne için değerlendirildi ve onaylandı.",
        date: "2025-11-05",
        action: "ONAYLANDI",
      },
      {
        user: "Sezgin Bingül (GM)",
        note: "Onaylandı.",
        date: "2025-11-06",
        action: "ONAYLANDI",
      },
      {
        user: "Ayşe Yılmaz (İK SPV)",
        note: "İşe alım Girne şubesi üzerinden tamamlandı.",
        date: "2025-11-07",
        action: "ONAYLANDI",
      },
    ],
    appliedAt: "2025-11-05",
    approvalStage: "tamamlandi",
    personal: {
      foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
      ad: "İkili",
      soyad: "Başvuru O.",
      dogumTarihi: "1996-09-09",
    },
    education: [{ seviye: "Lisans" }],
    jobDetails: {
      departmanPozisyonlari: [
        { value: "IT::Yazılımcı", label: "Yazılımcı", dept: "IT" },
      ],
    },
  },
];
// --- /GÜNCELLENDİ ---

// --- Akış Tanımları (İK SPV Revize Mantığı) ---
const STAGES_MAP = {
  departman_muduru: { role: "dm", next: "genel_mudur" },
  genel_mudur: { role: "gm", next: "ik" },
  ik: { role: "ik", next: "tamamlandi" },
  tamamlandi: { role: null, next: null },
};

// Revize istendiğinde, rolü hangi aşamaya döndüreceğimizi belirler
const ROLE_TO_STAGE_MAP = {
  dm: "departman_muduru",
  gm: "genel_mudur",
  ik_spv: "ik",
  ik_user: "ik",
  admin: "ik",
};

// Yetki kontrolü için: admin ve ik_spv 'ik' rolü gibidir.
const getAuthRoleForCheck = (role) => {
  if (role === "admin" || role === "ik_spv" || role === "ik_user") return "ik";
  return role;
};

// İK SPV veya Admin mi kontrolü (Revize onayı için)
const isIKSupervisor = (role) => {
  return role === "admin" || role === "ik_spv";
};
// --- /Akış Tanımları ---

// --- FONKSİYONLAR ---

/**
 * 1. LOGIN
 */
export const dbLogin = (username, password) => {
  console.log(`[StaticDB] dbLogin denemesi: ${username}`);
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

/**
 * 2. GET APPLICATIONS
 */
export const getApplications = () => {
  console.log("[StaticDB] getApplications çağrıldı.");
  return JSON.parse(JSON.stringify(APPLICATIONS));
};

/**
 * 3. UPDATE STATUS (ONAY/RED/REVİZE)
 * (İK SPV Onaylı Revize Mantığı)
 */
export const updateApplicationStatus = (id, actionType, note, authUser) => {
  console.log(
    `[StaticDB] updateApplicationStatus çağrıldı: ${id}, ${actionType}, ${authUser.role}`
  );
  const application = APPLICATIONS.find((app) => app.id === id);
  if (!application) {
    return { success: false, message: "Başvuru bulunamadı." };
  }

  // Yeni not objesini oluştur
  const newNote = {
    user: authUser.name,
    note: note || "(Açıklama yok)",
    date: new Date().toISOString().split("T")[0],
    action: actionType.toUpperCase(),
  };

  // 1. REVİZE TALEBİ (İK SPV olmayanlar)
  if (actionType === "request_revision") {
    if (
      application.status !== "Onaylanan" &&
      application.status !== "Reddedilen"
    ) {
      return {
        success: false,
        message:
          "Sadece tamamlanmış (Onaylı/Red) başvurular için revize istenebilir.",
      };
    }
    // İK SPV/Admin kendi kendine revize isteyemez
    if (isIKSupervisor(authUser.role)) {
      return {
        success: false,
        message: "İK Supervisor/Admin revize talebi oluşturamaz, sadece onaylar.",
      };
    }
    application.status = "Revize Talebi"; // İK SPV'ye düşer
    application.reviseRequestedByRole = authUser.role; // Kimin istediğini sakla
    application.notes.push(newNote);
    return {
      success: true,
      message: "Revize talebi İK SPV onayına gönderildi.",
    };
  }

  // 2. REVİZE ONAYI (Sadece İK SPV / Admin)
  if (actionType === "approve_revision") {
    if (!isIKSupervisor(authUser.role)) {
      return { success: false, message: "Revize onay yetkiniz yok." };
    }
    if (application.status !== "Revize Talebi") {
      return { success: false, message: "Başvuru revize talebi modunda değil." };
    }

    const returnStage =
      ROLE_TO_STAGE_MAP[application.reviseRequestedByRole] || "departman_muduru";

    application.status = "Bekleyen"; // Süreç tekrar açıldı
    application.approvalStage = returnStage; // İsteyenin adımına döndü
    application.reviseRequestedByRole = null; // Talep rolünü temizle
    application.notes.push(newNote);
    return {
      success: true,
      message: `Revize onaylandı. Süreç ${returnStage} adımına geri alındı.`,
    };
  }

  // 3. REVİZE REDDİ (Sadece İK SPV / Admin)
  if (actionType === "reject_revision") {
    if (!isIKSupervisor(authUser.role)) {
      return { success: false, message: "Revize red yetkiniz yok." };
    }
    if (application.status !== "Revize Talebi") {
      return { success: false, message: "Başvuru revize talebi modunda değil." };
    }
    // Başvurunun 'notes' dizisindeki son 'ONAYLANDI' veya 'REDDEDİLDİ' kaydını bul
    const lastDecision = [...application.notes]
      .reverse()
      .find(
        (n) => n.action === "ONAYLANDI" || n.action === "REDDEDİLDİ"
      );
    // Son karara geri dön
    application.status =
      lastDecision?.action === "ONAYLANDI" ? "Onaylanan" : "Reddedilen";

    application.reviseRequestedByRole = null;
    application.notes.push(newNote);
    return { success: true, message: "Revize talebi reddedildi." };
  }

  // 4. STANDART AKIŞ (Onay/Red)
  const currentStageKey = application.approvalStage;
  const stageInfo = STAGES_MAP[currentStageKey];

  if (!stageInfo) {
    return { success: false, message: "Başvuru bilinmeyen bir aşamada." };
  }
  if (currentStageKey === "tamamlandi") {
    return {
      success: false,
      message: "Bu başvuru onay akışını zaten tamamlamış.",
    };
  }

  const authUserCheckRole = getAuthRoleForCheck(authUser.role);

  // Yetki Kontrolü
  if (stageInfo.role !== authUserCheckRole) {
    const requiredRoleLabel =
      USERS.find((u) => u.role === stageInfo.role)?.name || "Yetkili";
    return {
      success: false,
      message: `İşlem yetkiniz yok. Bu başvuru şu anda "${requiredRoleLabel}" onayı bekliyor.`,
    };
  }

  // İşlem
  if (actionType === "approve") {
    application.approvalStage = stageInfo.next;
    if (application.approvalStage === "tamamlandi") {
      application.status = "Onaylanan";
    }
  } else if (actionType === "reject") {
    application.status = "Reddedilen";
    application.approvalStage = "tamamlandi"; // Reddedilince akış durur
  }

  application.notes.push(newNote); // Notu her durumda ekle
  return { success: true, message: "Başvuru güncellendi." };
};

/**
 * 4. CREATE APPLICATION
 */
export const createApplication = (formData) => {
  console.log("[StaticDB] createApplication çağrıldı.");
  const newId = `A-${Math.floor(10000 + Math.random() * 90000)}`;

  const newApplication = {
    ...formData, // personal, education, jobDetails vb.
    id: newId,
    name: `${formData.personal.ad} ${formData.personal.soyad}`,
    branches: formData.jobDetails.subeler.map((s) => s.label),
    areas: formData.jobDetails.alanlar.map((a) => a.label),
    departments: formData.jobDetails.departmanlar.map((d) => d.label),
    roles: formData.jobDetails.departmanPozisyonlari.map((p) => p.label),
    date: new Date().toISOString().split("T")[0], // Bugünün tarihi
    age:
      new Date().getFullYear() -
      new Date(formData.personal.dogumTarihi).getFullYear(),
    status: "Bekleyen",
    notes: [
      {
        user: "Sistem",
        note: "Yeni başvuru alındı.",
        date: new Date().toISOString().split("T")[0],
        action: "BAŞVURU",
      },
    ],
    appliedAt: new Date().toISOString().split("T")[0],
    approvalStage: "departman_muduru", // Akışın başlangıcı
  };

  APPLICATIONS.unshift(newApplication); // Yeni başvuruyu en üste ekle

  return { success: true, newId: newId };
};