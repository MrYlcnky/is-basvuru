// src/components/Admin/Panel/CVViewModal.jsx
import React, { useState, useEffect } from "react"; // <--- GÜNCELLEME: useEffect eklendi
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faDownload,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

// PDF kütüphaneleri
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// CV şablonumuzu kullanıyoruz
import CVTemplate from "./CVTemplate";

// Test için oluşturduğumuz sahte CV verisini import et
import { mockCVData } from "../../../api/mockCVData";

export default function CVViewModal({ onClose, applicationData }) {
  const [isLoading, setIsLoading] = useState(false);

  // Prop olarak gelen 'applicationData'yı kullan, eğer yoksa (test aşaması) mock datayı kullan
  const cvData = applicationData || mockCVData;

  // --- YENİ: ESC tuşu ile kapatma ---
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    // Component kaldırıldığında event listener'ı temizle
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]); // 'onClose' prop'u değişirse hook'u yeniden kur
  // --- /YENİ ---

  const handleDownloadPDF = async () => {
    const cvElement = document.getElementById("cv-to-print");
    if (!cvElement) {
      console.error("Yazdırılacak CV elementi bulunamadı!");
      return;
    }

    setIsLoading(true);

    const sections = cvElement.querySelectorAll(".pdf-section");

    // PDF ayarları (A4 Portre: 210mm x 297mm)
    const pdf = new jsPDF("p", "mm", "a4");
    const A4_WIDTH_MM = 210;
    const A4_HEIGHT_MM = 297;
    const MARGIN_MM = 15; // Sayfa kenar boşluğu (mm)

    const pdfUsableWidth = A4_WIDTH_MM - MARGIN_MM * 2; // İçerik genişliği

    let yPosition = MARGIN_MM; // Mevcut dikey pozisyon (üst marjin ile başla)

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      try {
        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const pdfImgHeight = (imgHeight * pdfUsableWidth) / imgWidth;

        // --- GÜNCELLENMİŞ KESME KONTROLÜ ---
        const isTallerThanPage = pdfImgHeight > A4_HEIGHT_MM - MARGIN_MM * 2;
        const spaceLeftOnPage = A4_HEIGHT_MM - yPosition - MARGIN_MM;

        if (i > 0 && !isTallerThanPage && pdfImgHeight > spaceLeftOnPage) {
          pdf.addPage();
          yPosition = MARGIN_MM;
        }
        // --- /GÜNCELLENMİŞ KESME KONTROLÜ ---

        pdf.addImage(
          imgData,
          "PNG",
          MARGIN_MM,
          yPosition,
          pdfUsableWidth,
          pdfImgHeight
        );

        yPosition += pdfImgHeight + 5; // 5mm bölümler arası boşluk
      } catch (err) {
        console.error("PDF'e bölüm eklenirken hata oluştu:", err);
      }
    }

    pdf.save(`${cvData.name || "aday"}-CV.pdf`);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Arka plan overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal İçeriği */}
      <div className="relative w-full max-w-4xl h-full max-h-[95vh] flex flex-col rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl overflow-hidden">
        {/* Başlık */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-white">
              CV Önizleme: {cvData.name}
            </h3>
            <p className="text-xs text-gray-400">ID: {cvData.id}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isLoading}
              className="h-10 px-4 rounded-lg border border-emerald-700 bg-emerald-600/50 hover:bg-emerald-600/80 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <FontAwesomeIcon
                icon={isLoading ? faSpinner : faDownload}
                className={isLoading ? "animate-spin" : ""}
              />
              <span className="ml-2">
                {isLoading ? "Oluşturuluyor..." : "PDF İndir"}
              </span>
            </button>
            <button
              onClick={onClose}
              className="h-10 px-4 rounded-lg border border-gray-700 bg-gray-800 hover:bg-gray-700/60 text-gray-200 cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="mr-2 w-3 h-3" />
              Kapat
            </button>
          </div>
        </div>

        {/* Kaydırılabilir CV Alanı (Arka plan grid oldu) */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-200">
          {/* CVTemplate artık kendi beyaz arka planına ve ID'sine sahip */}
          <CVTemplate data={cvData} />
        </div>
      </div>
    </div>
  );
}
