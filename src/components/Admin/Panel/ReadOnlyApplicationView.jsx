// src/components/Admin/Panel/ReadOnlyApplicationView.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGraduationCap,
  faAward,
  faLaptopCode,
  faLanguage,
  faBriefcase,
  faPhoneVolume,
  faUserCog,
  faFileSignature,
  faHistory, // YENİ
} from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../Users/modalHooks/dateUtils";

/**
 * Bu bileşen, Admin Panel'de bir başvurunun *tüm* verilerini
 * JobApplicationForm'a benzer bir yapıda, salt-okunur olarak gösterir.
 */
export default function ReadOnlyApplicationView({ data }) {
  if (!data) return null;

  const NA = <span className="text-gray-400 italic">Girilmemiş</span>;

  // 1. Kişisel Bilgiler
  const personal = data.personal || {};
  // 2. Eğitim
  const education = data.education || [];
  // 3. Sertifikalar
  const certificates = data.certificates || [];
  // 4. Bilgisayar
  const computer = data.computer || [];
  // 5. Dil
  const languages = data.languages || [];
  // 6. İş Deneyimi
  const experience = data.experience || [];
  // 7. Referanslar
  const references = data.references || [];
  // 8. Diğer Bilgiler
  const otherInfo = data.otherInfo || {};
  // 9. Başvuru Detayları
  const jobDetails = data.jobDetails || {};

  return (
    <div className="space-y-6 text-gray-300 p-1">
      {/* 1. KİŞİSEL BİLGİLER (Değişiklik yok) */}
      <Section icon={faUser} title="1. Kişisel Bilgiler">
        <div className="flex flex-col sm:flex-row gap-6 p-4">
          <div className="flex-shrink-0">
            <span className="text-xs font-semibold ml-6 text-gray-400 uppercase tracking-wider">
              FOTOĞRAF
            </span>
            {personal.foto ? (
              <img
                src={personal.foto}
                alt="Vesikalık"
                className="mt-1 w-28 h-28 rounded-lg object-cover border-2 border-gray-700"
              />
            ) : (
              <div className="mt-1 w-28 h-28 rounded-lg bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUser}
                  className="w-10 h-10 text-gray-600"
                />
              </div>
            )}
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
            <DisplayRow
              label="Ad Soyad"
              value={`${personal.ad || ""} ${personal.soyad || ""}`}
            />
            <DisplayRow
              label="Doğum Tarihi"
              value={formatDate(personal.dogumTarihi) || NA}
            />
            <DisplayRow label="Cinsiyet" value={personal.cinsiyet || NA} />
            <DisplayRow label="E-posta" value={personal.eposta || NA} />
            <DisplayRow label="Telefon" value={personal.telefon || NA} />
            <DisplayRow label="WhatsApp" value={personal.whatsapp || NA} />
            <DisplayRow
              label="Medeni Durum"
              value={personal.medeniDurum || NA}
            />
            <DisplayRow
              label="Çocuk Sayısı"
              value={personal.cocukSayisi || NA}
            />
            <DisplayRow label="Uyruk" value={personal.uyruk || NA} />
            <DisplayRow
              label="Doğum Yeri"
              value={`${personal.dogumUlke || ""} / ${
                personal.dogumSehir || ""
              }`}
            />
            <DisplayRow
              label="İkamet Yeri"
              value={`${personal.ikametUlke || ""} / ${
                personal.ikametSehir || ""
              }`}
            />
            <DisplayRow
              label="Adres"
              value={personal.adres || NA}
              className="md:col-span-3"
            />
          </div>
        </div>
      </Section>

      {/* 2. EĞİTİM BİLGİLERİ (Değişiklik yok) */}
      <Section icon={faGraduationCap} title="2. Eğitim Bilgileri">
        <DisplayTable
          headers={[
            "Seviye",
            "Okul",
            "Bölüm",
            "Başlangıç",
            "Bitiş",
            "Durum",
            "GANO",
          ]}
          rows={education.map((e) => [
            e.seviye,
            e.okul,
            e.bolum,
            formatDate(e.baslangic),
            formatDate(e.bitis),
            e.diplomaDurum,
            `${e.gano || "-"} / ${e.notSistemi || "4"}`,
          ])}
          emptyText="Eğitim bilgisi girilmemiş."
        />
      </Section>

      {/* 3. SERTİFİKALAR (Değişiklik yok) */}
      <Section icon={faAward} title="3. Sertifika ve Eğitimler">
        <DisplayTable
          headers={[
            "Eğitim Adı",
            "Kurum",
            "Süre",
            "Veriliş Tarihi",
            "Geçerlilik Tarihi",
          ]}
          rows={certificates.map((c) => [
            c.ad,
            c.kurum,
            c.sure,
            formatDate(c.verilisTarihi),
            formatDate(c.gecerlilikTarihi),
          ])}
          emptyText="Sertifika bilgisi girilmemiş."
        />
      </Section>

      {/* 4. BİLGİSAYAR (Değişiklik yok) */}
      <Section icon={faLaptopCode} title="4. Bilgisayar Bilgileri">
        <DisplayTable
          headers={["Program Adı", "Yetkinlik"]}
          rows={computer.map((c) => [c.programAdi, c.yetkinlik])}
          emptyText="Bilgisayar bilgisi girilmemiş."
        />
      </Section>

      {/* 5. YABANCI DİL (Değişiklik yok) */}
      <Section icon={faLanguage} title="5. Yabancı Dil Bilgisi">
        <DisplayTable
          headers={[
            "Dil",
            "Konuşma",
            "Dinleme",
            "Okuma",
            "Yazma",
            "Nasıl Öğrenildi",
          ]}
          rows={languages.map((l) => [
            l.dil,
            l.konuşma,
            l.dinleme,
            l.okuma,
            l.yazma,
            l.ogrenilenKurum,
          ])}
          emptyText="Yabancı dil bilgisi girilmemiş."
        />
      </Section>

      {/* 6. İŞ DENEYİMİ (Değişiklik yok) */}
      <Section icon={faBriefcase} title="6. İş Deneyimleri">
        <DisplayTable
          headers={[
            "Şirket",
            "Departman",
            "Pozisyon",
            "Başlangıç",
            "Bitiş",
            "Ayrılış Nedeni",
          ]}
          rows={experience.map((e) => [
            e.isAdi,
            e.departman,
            e.pozisyon,
            formatDate(e.baslangicTarihi),
            e.halenCalisiyor ? "Devam Ediyor" : formatDate(e.bitisTarihi),
            e.ayrilisSebebi,
          ])}
          emptyText="İş deneyimi girilmemiş."
        />
      </Section>

      {/* 7. REFERANSLAR (Değişiklik yok) */}
      <Section icon={faPhoneVolume} title="7. Referanslar">
        <DisplayTable
          headers={["Ad Soyad", "Kurum", "Görev", "Telefon", "Tipi"]}
          rows={references.map((r) => [
            `${r.referansAdi} ${r.referansSoyadi}`,
            r.referansIsYeri,
            r.referansGorevi,
            r.referansTelefon,
            r.calistigiKurum,
          ])}
          emptyText="Referans bilgisi girilmemiş."
        />
      </Section>

      {/* 8. DİĞER BİLGİLER (Değişiklik yok) */}
      <Section icon={faUserCog} title="8. Diğer Kişisel Bilgiler">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 p-4">
          <DisplayRow
            label="KKTC Belgesi"
            value={otherInfo.kktcGecerliBelge || NA}
          />
          <DisplayRow
            label="Askerlik Durumu"
            value={otherInfo.askerlik || NA}
          />
          <DisplayRow
            label="Ehliyet"
            value={`${otherInfo.ehliyet || NA} (${(
              otherInfo.ehliyetTurleri || []
            ).join(", ")})`}
          />
          <DisplayRow
            label="Boy / Kilo"
            value={`${otherInfo.boy || "-"} cm / ${otherInfo.kilo || "-"} kg`}
          />
          <DisplayRow label="Sigara Kullanımı" value={otherInfo.sigara || NA} />
          <DisplayRow
            label="Dava Durumu"
            value={`${otherInfo.davaDurumu || NA} (${
              otherInfo.davaNedeni || "Neden yok"
            })`}
          />
          <DisplayRow
            label="Kalıcı Rahatsızlık"
            value={`${otherInfo.kaliciRahatsizlik || NA} (${
              otherInfo.rahatsizlikAciklama || "Açıklama yok"
            })`}
          />
        </div>
      </Section>

      {/* 9. BAŞVURU DETAYLARI (Değişiklik yok) */}
      <Section icon={faFileSignature} title="9. İş Başvuru Detayları">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 p-4">
          <DisplayRow
            label="Şubeler"
            value={jobDetails.subeler?.map((o) => o.label).join(", ") || NA}
          />
          <DisplayRow
            label="Alanlar"
            value={jobDetails.alanlar?.map((o) => o.label).join(", ") || NA}
          />
          <DisplayRow
            label="Departmanlar"
            value={
              jobDetails.departmanlar?.map((o) => o.label).join(", ") || NA
            }
          />
          <DisplayRow
            label="Pozisyonlar"
            value={
              jobDetails.departmanPozisyonlari
                ?.map((o) => o.label)
                .join(", ") || NA
            }
          />
          <DisplayRow
            label="Programlar"
            value={jobDetails.programlar?.map((o) => o.label).join(", ") || NA}
          />
          <DisplayRow
            label="Kağıt Oyunları"
            value={
              jobDetails.kagitOyunlari?.map((o) => o.label).join(", ") || NA
            }
          />
          <DisplayRow label="Lojman Talebi" value={jobDetails.lojman || NA} />
          <DisplayRow
            label="Tercih Nedeni"
            value={jobDetails.tercihNedeni || NA}
            className="md:col-span-3"
          />
        </div>
      </Section>

      {/* --- YENİ (Madde 1): Not Geçmişi --- */}
      <Section icon={faHistory} title="10. İşlem Geçmişi / Notlar">
        <div className="p-4 space-y-4">
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
      {/* --- /YENİ --- */}
    </div>
  );
}

// --- Salt Okunur Alt Bileşenler ---

function Section({ icon, title, children }) {
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 shadow-sm overflow-hidden">
      <h4 className="flex items-center gap-3 px-4 py-3 border-b border-gray-700">
        <FontAwesomeIcon icon={icon} className="text-amber-300 w-5 h-5" />
        <span className="font-semibold text-base text-gray-100">{title}</span>
      </h4>
      <div className="bg-gray-900/30">{children}</div>
    </div>
  );
}

function DisplayRow({ label, value, className = "" }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm text-gray-100 mt-1">{value}</span>
    </div>
  );
}

function DisplayTable({ headers = [], rows = [], emptyText = "Veri yok." }) {
  if (rows.length === 0) {
    return <p className="p-4 text-sm text-gray-400 italic">{emptyText}</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-800/60">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-gray-900/20 divide-y divide-gray-800">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-3 text-gray-200 whitespace-nowrap"
                >
                  {cell || <span className="text-gray-500">-</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
