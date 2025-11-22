// src/api/mockCVData.js

export const mockCVData = {
  // Yönetim paneli için üst veriler
  id: "A-998877",
  name: "Mehmet Yılmaz",
  appliedAt: "2025-11-20",
  approvalStage: "ik_degerlendirme",
  status: "Değerlendiriliyor",
  notes: [
    {
      user: "İK Bot",
      note: "Otomatik veri çekme testi başarılı.",
      date: "2025-11-20",
      action: "SİSTEM",
    }
  ],

  // 1. Kişisel Bilgiler (PersonalInformation.jsx)
  // Lokasyon formatı: "İl/İlçe" (TR için) veya "Şehir/Bölge" (Yurt dışı için)
  personal: {
    ad: "Mehmet",
    soyad: "Yılmaz",
    eposta: "mehmet@gmail.com",
    telefon: "+905551234567",
    whatsapp: "+905551234567",
    adres: "Cumhuriyet Mahallesi, Atatürk Caddesi No: 10 D: 5",
    cinsiyet: "Erkek",
    medeniDurum: "Evli",
    dogumTarihi: "1990-05-15",
    uyruk: "Türkiye", 
    cocukSayisi: "1",
    foto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    
    // Lokasyonlar
    dogumUlke: "Türkiye",
    dogumSehir: "Ankara/Çankaya", // Otomatik ayrıştırılacak
    
    ikametUlke: "Türkiye",
    ikametSehir: "İstanbul/Kadıköy" // Otomatik ayrıştırılacak
  },

  // 2. Eğitim Bilgileri (EducationTable.jsx)
  education: [
    {
      id: 1,
      seviye: "Lisans",
      okul: "İstanbul Teknik Üniversitesi",
      bolum: "Bilgisayar Mühendisliği",
      baslangic: "2008-09-01",
      bitis: "2012-06-15",
      diplomaDurum: "Mezun",
      notSistemi: "4",
      gano: "3.50",
    },
    {
      id: 2,
      seviye: "Yüksek Lisans",
      okul: "Boğaziçi Üniversitesi",
      bolum: "Yazılım Mühendisliği",
      baslangic: "2013-09-01",
      bitis: "2015-06-20",
      diplomaDurum: "Mezun",
      notSistemi: "4",
      gano: "3.80",
    }
  ],

  // 3. Sertifikalar (CertificatesTable.jsx)
  certificates: [
    {
      id: 1,
      ad: "İleri Düzey Java",
      kurum: "Udemy",
      sure: "40 Saat",
      verilisTarihi: "2020-01-15",
      gecerlilikTarihi: null,
    },
    {
      id: 2,
      ad: "İlk Yardım Sertifikası",
      kurum: "Kızılay",
      sure: "16 Saat",
      verilisTarihi: "2022-05-10",
      gecerlilikTarihi: "2025-05-10",
    }
  ],

  // 4. Bilgisayar Bilgileri (ComputerInformationTable.jsx)
  computer: [
    { id: 1, programAdi: "Microsoft Excel", yetkinlik: "İyi" },
    { id: 2, programAdi: "Adobe Photoshop", yetkinlik: "Orta" },
    { id: 3, programAdi: "VS Code", yetkinlik: "İyi" }
  ],

  // 5. Yabancı Dil (LanguageTable.jsx)
  languages: [
    {
      id: 1,
      dil: "İngilizce",
      konusma: "C1", 
      dinleme: "C1",
      okuma: "C1",
      yazma: "C1",
      ogrenilenKurum: "Üniversite Hazırlık",
    },
    {
      id: 2,
      dil: "Almanca",
      konusma: "B1",
      dinleme: "B1",
      okuma: "B2",
      yazma: "B1",
      ogrenilenKurum: "Goethe Institut",
    }
  ],

  // 6. İş Deneyimleri (JobExperiencesTable.jsx)
  experience: [
    {
      id: 1,
      isAdi: "Tech Solutions A.Ş.",
      departman: "Yazılım",
      pozisyon: "Kıdemli Geliştirici",
      gorev: "Backend sistemlerinin geliştirilmesi ve bakımı.",
      ucret: "45000", 
      baslangicTarihi: "2018-02-01",
      halenCalisiyor: true,
      bitisTarihi: null,
      ayrilisSebebi: "",
      isUlke: "Türkiye",
      isSehir: "İstanbul"
    },
    {
      id: 2,
      isAdi: "Soft Yazılım Ltd.",
      departman: "Bilgi İşlem",
      pozisyon: "Junior Geliştirici",
      gorev: "Web arayüz kodlaması.",
      ucret: "20000",
      baslangicTarihi: "2015-07-01",
      halenCalisiyor: false,
      bitisTarihi: "2018-01-30",
      ayrilisSebebi: "Kariyer değişikliği",
      isUlke: "Türkiye",
      isSehir: "Ankara"
    }
  ],

  // 7. Referanslar (ReferencesTable.jsx)
  references: [
    {
      id: 1,
      calistigiKurum: "Harici", 
      referansAdi: "Ahmet",
      referansSoyadi: "Demir",
      referansIsYeri: "Tech Solutions A.Ş.",
      referansGorevi: "Takım Lideri",
      referansTelefon: "+905321112233",
    }
  ],

  // 8. Diğer Kişisel Bilgiler (OtherPersonalInformationTable.jsx)
  // "Evet", "Hayır" gibi standart değerler kullanıldı. 
  // Ancak OtherPersonalInformationTable içindeki "fillData" eski "Var/Yok" verilerini de otomatik düzeltecektir.
  otherInfo: {
    kktcGecerliBelge: "Çalışma İzni",
    davaDurumu: "Evet", // "Var" yerine "Evet" (Standart)
    davaNedeni: "Devam eden ticari dava", // Dava durumu evet ise neden zorunlu
    sigara: "Hayır",
    kaliciRahatsizlik: "Evet",
    rahatsizlikAciklama: "Hafif derecede miyop, gözlük kullanıyorum.",
    ehliyet: "Evet", 
    ehliyetTurleri: ["B", "A2"], 
    askerlik: "Yapıldı",
    boy: "180",
    kilo: "78"
  },

  // 9. İş Başvuru Detayları (JobApplicationDetails.jsx)
  jobDetails: {
    subeler: [
      { value: "Girne", label: "Girne" },
      { value: "Prestige", label: "Prestige" }
    ],
    alanlar: [
      { value: "Otel", label: "Otel" },
      { value: "Casino", label: "Casino" }
    ],
    departmanlar: [
      { value: "Otel Resepsiyon", label: "Otel Resepsiyon" },
      { value: "Casino Slot", label: "Casino Slot" }
    ],
    programlar: [
      { value: "Opera PMS", label: "Opera PMS" },
      { value: "Asist", label: "Asist" }
    ],
    departmanPozisyonlari: [
      { value: "Otel Resepsiyon::Receptionist", label: "Receptionist", dept: "Otel Resepsiyon" },
      { value: "Casino Slot::Slot Attendant", label: "Slot Attendant", dept: "Casino Slot" }
    ],
    kagitOyunlari: [], 
    lojman: "Evet",
    tercihNedeni: "Kurumsal yapısı, vizyonu ve kariyer imkanları sebebiyle."
  },
};