// src/components/Admin/Panel/CVTemplate.jsx
import React from "react";
import { mockCVData } from "../../../api/mockCVData";
import {
  faUser,
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faGraduationCap,
  faAward,
  faLaptopCode,
  faLanguage,
  faBriefcase,
  faPhoneVolume,
  faUserCog,
  faFileSignature,
  faHistory,
  faPenSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from "../../Users/modalHooks/dateUtils";

// === YARDIMCI BİLEŞENLER (PDF Şablonu için) ===

// Ana Başlık (örn: İŞ DENEYİMİ)
const Section = ({ title, icon, children }) => (
  // --- GÜNCELLEME: Kesilmeyi önlemek için paddingTop/Bottom eklendi ---
  <div
    className="pdf-section"
    style={{
      marginTop: "12px", // Azaltıldı
      paddingTop: "12px", // Tampon bölge
      paddingBottom: "12px", // Tampon bölge
      breakInside: "avoid",
    }}
  >
    <h2
      style={{
        display: "flex",
        alignItems: "center",
        fontSize: "1.125rem", // 18px
        fontWeight: "700",
        color: "#1F2937", // text-gray-800
        borderBottom: "2px solid #D1D5DB", // border-gray-300
        paddingBottom: "4px",
        marginBottom: "12px",
      }}
    >
      <FontAwesomeIcon
        icon={icon}
        style={{
          width: "20px",
          height: "20px",
          marginRight: "12px",
          color: "#4B5563", // text-gray-600
        }}
      />
      {title.toUpperCase()}
    </h2>
    <div style={{ fontSize: "0.875rem", color: "#374151" }}>{children}</div>
  </div>
);
// --- /GÜNCELLEME ---

// Etiket-Değer çifti (örn: Adı: Mehmet)
const Row = ({ label, value, colSpan = false }) => (
  <div
    style={{
      display: "flex",
      marginBottom: "6px",
      gridColumn: colSpan ? "span 3 / span 3" : "span 1 / span 1",
    }}
  >
    <span
      style={{
        width: "33.3333%",
        minWidth: "120px",
        fontWeight: "600",
        color: "#4B5563", // text-gray-600
      }}
    >
      {label}
    </span>
    <span
      style={{ width: "66.6667%", color: "#1F2937", wordBreak: "break-word" }}
    >
      {value || "-"}
    </span>
  </div>
);

// Tablo (Eğitim, Deneyim vb. için)
const Table = ({ headers, rows }) => {
  if (rows.length === 0) {
    return (
      <p
        style={{ fontSize: "0.875rem", color: "#6B7280", fontStyle: "italic" }}
      >
        Veri girilmemiş.
      </p>
    );
  }
  return (
    <table
      style={{
        minWidth: "100%",
        fontSize: "0.875rem",
        borderCollapse: "collapse",
        border: "1px solid #D1D5DB", // border-gray-300
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#F3F4F6" }}>
          {" "}
          {/* bg-gray-100 */}
          {headers.map((h, i) => (
            <th
              key={i}
              style={{
                padding: "8px 12px",
                textAlign: "left",
                fontWeight: "600",
                color: "#4B5563", // text-gray-600
                border: "1px solid #D1D5DB",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            style={{
              borderBottom: "1px solid #E5E7EB", // border-gray-200
              breakInside: "avoid", // CSS denemesi
            }}
          >
            {row.map((cell, j) => (
              <td
                key={j}
                style={{
                  padding: "8px 12px",
                  color: "#1F2937", // text-gray-800
                  border: "1px solid #D1D5DB",
                }}
              >
                {cell || "-"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
// === /YARDIMCI BİLEŞENLER ===

export default function CVTemplate({ data }) {
  const cv = data || mockCVData;
  const {
    personal,
    jobDetails,
    experience,
    education,
    languages,
    computer,
    certificates,
    references,
    otherInfo,
    notes,
  } = cv;

  return (
    <div
      id="cv-to-print"
      style={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        color: "#333333",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* === 1. BAŞLIK (Ad, Foto, İletişim) === */}
      <header
        className="pdf-section" // Etiket
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          paddingBottom: "24px",
          borderBottom: "2px solid #6B7280",
          paddingTop: "12px", // Tampon bölge
        }}
      >
        <div style={{ width: "75%" }}>
          <h1
            style={{
              fontSize: "2.25rem",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            {personal.ad} {personal.soyad}
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              fontWeight: "300",
              color: "#374151",
              marginTop: "8px",
            }}
          >
            {cv.roles.join(" / ")}
          </p>

          <div
            style={{
              marginTop: "24px",
              fontSize: "0.875rem",
              color: "#4B5563",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <FontAwesomeIcon
                icon={faPhone}
                style={{ width: "16px", height: "16px", marginRight: "12px" }}
              />
              <span>{personal.telefon}</span>
              {personal.whatsapp && (
                <span style={{ marginLeft: "16px" }}>
                  (WhatsApp: {personal.whatsapp})
                </span>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                style={{ width: "16px", height: "16px", marginRight: "12px" }}
              />
              <span>{personal.eposta}</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                style={{
                  width: "16px",
                  height: "16px",
                  marginRight: "12px",
                  marginTop: "4px",
                }}
              />
              <span>{personal.adres}</span>
            </div>
          </div>
        </div>
        <div
          style={{ width: "25%", display: "flex", justifyContent: "flex-end" }}
        >
          {personal.foto ? (
            <img
              src={personal.foto}
              alt="Profil"
              style={{
                width: "128px",
                height: "160px",
                objectFit: "cover",
                border: "4px solid #E5E7EB",
                borderRadius: "0.25rem",
              }}
              crossOrigin="anonymous"
            />
          ) : (
            <div
              style={{
                width: "128px",
                height: "160px",
                border: "4px solid #E5E7EB",
                borderRadius: "0.25rem",
                backgroundColor: "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesomeIcon
                icon={faUser}
                style={{ width: "64px", height: "64px", color: "#9CA3AF" }}
              />
            </div>
          )}
        </div>
      </header>

      {/* === 1. KİŞİSEL BİLGİLER === */}
      <Section title="Kişisel Bilgiler" icon={faUser}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px 24px",
          }}
        >
          <Row label="Doğum Tarihi" value={formatDate(personal.dogumTarihi)} />
          <Row label="Cinsiyet" value={personal.cinsiyet} />
          <Row label="Medeni Durum" value={personal.medeniDurum} />
          <Row label="Çocuk Sayısı" value={personal.cocukSayisi} />
          <Row label="Uyruk" value={personal.uyruk} />
          <Row
            label="Doğum Yeri"
            value={`${personal.dogumSehir}, ${personal.dogumUlke}`}
          />
          <Row
            label="İkamet Yeri"
            value={`${personal.ikametSehir}, ${personal.ikametUlke}`}
            colSpan={true}
          />
        </div>
      </Section>

      {/* === 2. EĞİTİM BİLGİLERİ === */}
      <Section title="Eğitim Bilgileri" icon={faGraduationCap}>
        <Table
          headers={[
            "Seviye",
            "Okul",
            "Bölüm",
            "Başlangıç",
            "Bitiş",
            "Durum",
            "GANO",
          ]}
          rows={(education || []).map((e) => [
            e.seviye,
            e.okul,
            e.bolum,
            formatDate(e.baslangic),
            formatDate(e.bitis),
            e.diplomaDurum,
            `${e.gano || "-"} / ${e.notSistemi}`,
          ])}
        />
      </Section>

      {/* === 3. SERTİFİKALAR === */}
      <Section title="Sertifika ve Eğitimler" icon={faAward}>
        <Table
          headers={[
            "Eğitim Adı",
            "Kurum",
            "Süre",
            "Veriliş Tarihi",
            "Geçerlilik Tarihi",
          ]}
          rows={(certificates || []).map((c) => [
            c.ad,
            c.kurum,
            c.sure,
            formatDate(c.verilisTarihi),
            formatDate(c.gecerlilikTarihi),
          ])}
        />
      </Section>

      {/* === 4. BİLGİSAYAR BİLGİLERİ === */}
      <Section title="Bilgisayar Bilgileri" icon={faLaptopCode}>
        <Table
          headers={["Program Adı", "Yetkinlik"]}
          rows={(computer || []).map((c) => [c.programAdi, c.yetkinlik])}
        />
      </Section>

      {/* === 5. YABANCI DİL === */}
      <Section title="Yabancı Dil Bilgisi" icon={faLanguage}>
        <Table
          headers={[
            "Dil",
            "Konuşma",
            "Dinleme",
            "Okuma",
            "Yazma",
            "Nasıl Öğrenildi",
          ]}
          rows={(languages || []).map((l) => [
            l.dil,
            l.konuşma,
            l.dinleme,
            l.okuma,
            l.yazma,
            l.ogrenilenKurum,
          ])}
        />
      </Section>

      {/* === 6. İŞ DENEYİMLERİ === */}
      <Section title="İş Deneyimleri" icon={faBriefcase}>
        <Table
          headers={[
            "Şirket",
            "Departman",
            "Pozisyon",
            "Başlangıç",
            "Bitiş",
            "Ayrılış Nedeni",
          ]}
          rows={(experience || []).map((e) => [
            e.isAdi,
            e.departman,
            e.pozisyon,
            formatDate(e.baslangicTarihi),
            e.halenCalisiyor ? "Devam Ediyor" : formatDate(e.bitisTarihi),
            e.ayrilisSebebi,
          ])}
        />
      </Section>

      {/* === 7. REFERANSLAR === */}
      <Section title="Referanslar" icon={faPhoneVolume}>
        <Table
          headers={["Ad Soyad", "Kurum", "Görev", "Telefon", "Tipi"]}
          rows={(references || []).map((r) => [
            `${r.referansAdi} ${r.referansSoyadi}`,
            r.referansIsYeri,
            r.referansGorevi,
            r.referansTelefon,
            r.calistigiKurum,
          ])}
        />
      </Section>

      {/* === 8. DİĞER KİŞİSEL BİLGİLER === */}
      <Section title="Diğer Kişisel Bilgiler" icon={faUserCog}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px 24px",
          }}
        >
          <Row label="KKTC Belgesi" value={otherInfo.kktcGecerliBelge} />
          <Row label="Askerlik Durumu" value={otherInfo.askerlik} />
          <Row
            label="Ehliyet"
            value={`${otherInfo.ehliyet} (${(
              otherInfo.ehliyetTurleri || []
            ).join(", ")})`}
          />
          <Row
            label="Boy / Kilo"
            value={`${otherInfo.boy} cm / ${otherInfo.kilo} kg`}
          />
          <Row label="Sigara Kullanımı" value={otherInfo.sigara} />
          <Row
            label="Dava Durumu"
            value={`${otherInfo.davaDurumu} (${otherInfo.davaNedeni || "N/A"})`}
          />
          <Row
            label="Kalıcı Rahatsızlık"
            value={`${otherInfo.kaliciRahatsizlik} (${
              otherInfo.rahatsizlikAciklama || "N/A"
            })`}
            colSpan={true}
          />
        </div>
      </Section>

      {/* === 9. İŞ BAŞVURU DETAYLARI === */}
      <Section title="İş Başvuru Detayları" icon={faFileSignature}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "16px 24px",
          }}
        >
          <Row
            label="Şubeler"
            value={jobDetails.subeler?.map((o) => o.label).join(", ")}
          />
          <Row
            label="Alanlar"
            value={jobDetails.alanlar?.map((o) => o.label).join(", ")}
          />
          <Row
            label="Departmanlar"
            value={jobDetails.departmanlar?.map((o) => o.label).join(", ")}
          />
          <Row
            label="Pozisyonlar"
            value={jobDetails.departmanPozisyonlari
              ?.map((o) => o.label)
              .join(", ")}
          />
          <Row
            label="Programlar"
            value={jobDetails.programlar?.map((o) => o.label).join(", ")}
          />
          <Row
            label="Kağıt Oyunları"
            value={
              jobDetails.kagitOyunlari?.map((o) => o.label).join(", ") || "-"
            }
          />
          <Row label="Lojman Talebi" value={jobDetails.lojman} />
          <Row
            label="Tercih Nedeni"
            value={jobDetails.tercihNedeni}
            colSpan={true}
          />
        </div>
      </Section>

      {/* === 10. İŞLEM GEÇMİŞİ (NOTLAR) === */}
      <Section title="İşlem Geçmişi" icon={faHistory}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {(notes || []).length > 0 ? (
            notes.map((note, index) => (
              <div
                key={index}
                style={{
                  fontSize: "0.875rem",
                  borderBottom: "1px solid #E5E7EB",
                  paddingBottom: "12px",
                  breakInside: "avoid",
                }}
              >
                <p style={{ color: "#1F2937", fontStyle: "italic" }}>
                  "{note.note}"
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      color: "#4B5563",
                    }}
                  >
                    - {note.user}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                    {note.date} ({note.action})
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p
              style={{
                fontSize: "0.875rem",
                color: "#6B7280",
                fontStyle: "italic",
              }}
            >
              Henüz bir işlem notu yok.
            </p>
          )}
        </div>
      </Section>

      {/* === 11. İMZA ALANI === */}
      <Section title="Onay ve İmzalar" icon={faPenSquare}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Arial, sans-serif",
            fontSize: "0.875rem", // 14px
            color: "#374151", // text-gray-700
          }}
        >
          {/* İmza 1: Departman Müdürü */}
          <div style={{ width: "30%", textAlign: "center" }}>
            <div
              style={{
                borderBottom: "1px solid #4B5563", // border-gray-600
                height: "40px",
                marginBottom: "8px",
              }}
            >
              {/* İmza için boş alan */}
            </div>
            <p style={{ fontWeight: "600", color: "#1F2937" }}>
              Departman Müdürü
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#4B5563",
                fontStyle: "italic",
              }}
            >
              (İmza)
            </p>
          </div>

          {/* İmza 2: Genel Müdür */}
          <div style={{ width: "30%", textAlign: "center" }}>
            <div
              style={{
                borderBottom: "1px solid #4B5563",
                height: "40px",
                marginBottom: "8px",
              }}
            >
              {/* İmza için boş alan */}
            </div>
            <p style={{ fontWeight: "600", color: "#1F2937" }}>Genel Müdür</p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#4B5563",
                fontStyle: "italic",
              }}
            >
              (İmza)
            </p>
          </div>

          {/* İmza 3: İnsan Kaynakları */}
          <div style={{ width: "30%", textAlign: "center" }}>
            <div
              style={{
                borderBottom: "1px solid #4B5563",
                height: "40px",
                marginBottom: "8px",
              }}
            >
              {/* İmza için boş alan */}
            </div>
            <p style={{ fontWeight: "600", color: "#1F2937" }}>
              İnsan Kaynakları
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "#4B5563",
                fontStyle: "italic",
              }}
            >
              (İmza)
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
