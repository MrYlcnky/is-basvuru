// src/api/mockCVData.js
// Bu dosya, PDF oluşturma özelliğini test etmek için
// JobApplicationForm'daki tüm alanları doldurulmuş
// sahte (mock) bir aday verisi içerir.

export const mockCVData = {
  // ReadOnlyApplicationView'in ihtiyaç duyduğu üst seviye veriler
  id: "A-12345",
  name: "Mehmet Örnek Aday",
  branches: ["Girne", "Prestige"],
  areas: ["Hotel", "Casino"],
  departments: ["IT", "Casino F&B"],
  roles: ["IT Destek Uzmanı", "Garson"],
  date: "2025-11-15",
  age: 30,
  appliedAt: "2025-11-15",
  approvalStage: "tamamlandi",
  status: "Onaylanan",
  notes: [
    {
      user: "Ulaş Gencan (IT Girne)",
      note: "Teknik bilgisi çok yerinde.",
      date: "2025-11-16",
      action: "ONAYLANDI",
    },
    {
      user: "Sezgin Bingül (GM)",
      note: "Mülakat olumlu geçti.",
      date: "2025-11-17",
      action: "ONAYLANDI",
    },
    {
      user: "Ayşe Yılmaz (İK SPV)",
      note: "İşe alım tamamlandı.",
      date: "2025-11-17",
      action: "ONAYLANDI",
    },
  ],

  // 1. Kişisel Bilgiler
  personal: {
    foto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    ad: "Mehmet Örnek",
    soyad: "Aday",
    dogumTarihi: "1995-05-20",
    cinsiyet: "Erkek",
    eposta: "mehmet.aday@mail.com",
    telefon: "+90 555 123 4567",
    whatsapp: "+90 555 123 4567",
    medeniDurum: "Bekâr",
    cocukSayisi: "0",
    uyruk: "T.C.",
    dogumUlke: "Türkiye",
    dogumSehir: "Ankara",
    ikametUlke: "KKTC",
    ikametSehir: "Girne",
    adres: "Girne Merkez, Ziya Rızkı Cad. No: 10 D: 5",
  },

  // 2. Eğitim Bilgileri
  education: [
    {
      id: 1,
      seviye: "Lisans",
      okul: "Orta Doğu Teknik Üniversitesi",
      bolum: "Bilgisayar Mühendisliği",
      baslangic: "2013-09-01",
      bitis: "2018-06-15",
      diplomaDurum: "Mezun",
      notSistemi: "4",
      gano: "3.20",
    },
    {
      id: 2,
      seviye: "Lise",
      okul: "Ankara Atatürk Lisesi",
      bolum: "Sayısal",
      baslangic: "2009-09-01",
      bitis: "2013-06-15",
      diplomaDurum: "Mezun",
      notSistemi: "100",
      gano: "85",
    },
  ],

  // 3. Sertifikalar
  certificates: [
    {
      id: 1,
      ad: "Cisco CCNA Routing and Switching",
      kurum: "Cisco Networking Academy",
      sure: "6 Ay",
      verilisTarihi: "2019-03-01",
      gecerlilikTarihi: "2022-03-01",
    },
    {
      id: 2,
      ad: "Microsoft Certified: Azure Fundamentals",
      kurum: "Microsoft",
      sure: "1 Ay",
      verilisTarihi: "2020-05-15",
      gecerlilikTarihi: null,
    },
  ],

  // 4. Bilgisayar Bilgileri
  computer: [
    { id: 1, programAdi: "Microsoft Office", yetkinlik: "Çok İyi" },
    { id: 2, programAdi: "Photoshop", yetkinlik: "Orta" },
    { id: 3, programAdi: "Opera (Otelcilik)", yetkinlik: "İyi" },
  ],

  // 5. Yabancı Dil
  languages: [
    {
      id: 1,
      dil: "İngilizce",
      konuşma: "C1",
      dinleme: "C1",
      okuma: "C2",
      yazma: "B2",
      ogrenilenKurum: "Okul ve Kurs",
    },
    {
      id: 2,
      dil: "Almanca",
      konuşma: "A2",
      dinleme: "B1",
      okuma: "B1",
      yazma: "A2",
      ogrenilenKurum: "Kendi kendine",
    },
  ],

  // 6. İş Deneyimleri
  experience: [
    {
      id: 1,
      isAdi: "ABC Teknoloji A.Ş.",
      departman: "IT",
      pozisyon: "Kıdemli Sistem Uzmanı",
      baslangicTarihi: "2020-01-10",
      halenCalisiyor: true,
      bitisTarihi: null,
      ayrilisSebebi: "",
      ulke: "Türkiye",
      sehir: "İstanbul",
    },
    {
      id: 2,
      isAdi: "XYZ Bilişim",
      departman: "IT",
      pozisyon: "IT Destek Uzmanı",
      baslangicTarihi: "2018-07-01",
      halenCalisiyor: false,
      bitisTarihi: "2019-12-31",
      ayrilisSebebi: "Daha iyi bir teklif",
      ulke: "Türkiye",
      sehir: "Ankara",
    },
  ],

  // 7. Referanslar
  references: [
    {
      id: 1,
      calistigiKurum: "Harici",
      referansAdi: "Ahmet",
      referansSoyadi: "Yılmaz",
      referansIsYeri: "ABC Teknoloji A.Ş.",
      referansGorevi: "IT Direktörü",
      referansTelefon: "+90 555 987 6543",
    },
  ],

  // 8. Diğer Kişisel Bilgiler
  otherInfo: {
    kktcGecerliBelge: "Çalışma İzni",
    askerlik: "Yapıldı",
    ehliyet: "Var",
    ehliyetTurleri: ["B", "A2"],
    boy: "180",
    kilo: "80",
    sigara: "Hayır",
    davaDurumu: "Hayır",
    davaNedeni: "",
    kaliciRahatsizlik: "Hayır",
    rahatsizlikAciklama: "",
  },

  // 9. İş Başvuru Detayları
  jobDetails: {
    subeler: [{ label: "Girne" }, { label: "Prestige" }],
    alanlar: [{ label: "Hotel" }, { label: "Casino" }],
    departmanlar: [{ label: "IT" }, { label: "Casino F&B" }],
    departmanPozisyonlari: [
      { label: "IT Destek Uzmanı" },
      { label: "Garson" },
    ],
    programlar: [{ label: "Opera" }, { label: "Excel" }],
    kagitOyunlari: [],
    lojman: "Evet",
    tercihNedeni: "Kariyer gelişimi ve şirketin vizyonu. Kariyer gelişimi ve şirketin vizyonu. Kariyer gelişimi ve şirketin vizyonu. Kariyer gelişimi ve şirketin vizyonu. Kariyer gelişimi ve şirketin vizyonu.",
  },
};