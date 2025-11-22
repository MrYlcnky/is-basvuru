import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faTimes,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CVTemplate from "./CVTemplate";

export default function CVViewModal({ applicationData, onClose }) {
  const templateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!templateRef.current) return;
    setIsDownloading(true);

    try {
      // 1. Şablonu Klonla (Orijinal görünümü bozmamak için)
      const originalElement = templateRef.current;
      const clone = originalElement.cloneNode(true);

      // A4 Boyutları (96 DPI için yaklaşık px değerleri)
      const A4_WIDTH_PX = 794;
      const A4_HEIGHT_PX = 1123;
      // Sayfa altından ne kadar pay bırakılacak (Kesilmeyi önlemek için güvenli alan)
      const PAGE_MARGIN_BOTTOM = 60;

      // Klon Ayarları (Görünmez ve A4 genişliğinde)
      clone.style.width = `${A4_WIDTH_PX}px`;
      clone.style.position = "absolute";
      clone.style.top = "-10000px";
      clone.style.left = "0";
      clone.style.zIndex = "-1";
      // Orijinal padding'i sıfırla, biz aşağıda yöneteceğiz
      clone.style.padding = "0";

      // Klonu body'ye ekle ki boyutları ölçebilelim
      document.body.appendChild(clone);

      // 2. AKILLI SAYFALAMA ALGORİTMASI
      // Klonun içindeki ana div'i bul (CVTemplate'in root div'i)
      const contentDiv = clone.firstElementChild;

      // İçerik div'ine padding verelim (Sayfa kenar boşlukları)
      contentDiv.style.padding = "40px"; // Sağ/Sol/Üst boşluk
      contentDiv.style.width = "100%";
      contentDiv.style.boxSizing = "border-box";

      // Tüm alt elemanları (Header, Section'lar) seç
      // Not: CVTemplate içinde her bölüm birer "div" veya "header" olarak duruyor
      const childNodes = Array.from(contentDiv.children);

      let currentHeight = 40; // Başlangıçtaki üst padding (40px)

      childNodes.forEach((child) => {
        const childHeight = child.offsetHeight;
        const style = window.getComputedStyle(child);
        const marginTop = parseInt(style.marginTop) || 0;
        const marginBottom = parseInt(style.marginBottom) || 0;

        // Elemanın toplam kapladığı alan (marginler dahil)
        const totalChildHeight = childHeight + marginTop + marginBottom;

        // Sayfa sonuna kalan mesafe
        // (Mevcut yükseklik % Sayfa Boyu) -> Sayfadaki mevcut konum
        const positionOnPage = currentHeight % A4_HEIGHT_PX;
        const remainingOnPage = A4_HEIGHT_PX - positionOnPage;

        // EĞER bu eleman mevcut sayfaya sığmıyorsa
        // (Ve eleman tek başına bir sayfadan büyük değilse)
        if (
          totalChildHeight > remainingOnPage - PAGE_MARGIN_BOTTOM &&
          totalChildHeight < A4_HEIGHT_PX
        ) {
          // Araya boşluk (Spacer) ekle
          const spacer = document.createElement("div");
          // Boşluk yüksekliği: Kalan mesafe + Bir sonraki sayfanın üst boşluğu (40px)
          const spacerHeight = remainingOnPage + 40;

          spacer.style.height = `${spacerHeight}px`;
          spacer.style.display = "block";
          spacer.style.width = "100%";
          // Debug için (görünmez yapıyoruz ama testte red yapabilirsiniz)
          spacer.style.backgroundColor = "transparent";

          // Boşluğu elemandan hemen önce ekle
          contentDiv.insertBefore(spacer, child);

          // Yüksekliği güncelle (Boşluk eklendiği için imleç yeni sayfanın başına atladı)
          // currentHeight += spacerHeight;
          // Yeni sayfa başındayız, child oraya yerleşecek.
          // Ancak matematiksel olarak currentHeight'i spacer kadar artırmamız yeterli.
          currentHeight += spacerHeight;
        }

        // Elemanın yüksekliğini ekle
        currentHeight += totalChildHeight;
      });

      // 3. Fotoğraf Çek (html2canvas)
      // Klonun son yüksekliğini al
      const totalHeight = clone.offsetHeight;

      const canvas = await html2canvas(clone, {
        scale: 2, // Yüksek kalite (Retina netliği)
        useCORS: true,
        width: A4_WIDTH_PX,
        height: totalHeight,
        windowWidth: A4_WIDTH_PX,
        windowHeight: totalHeight,
        // Arka planı beyaz yap (PNG transparan olmasın)
        backgroundColor: "#ffffff",
      });

      // Klonu temizle
      document.body.removeChild(clone);

      // 4. PDF Oluştur (jsPDF)
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = 210; // mm
      const pdfHeight = 297; // mm

      // Resmin PDF üzerindeki ölçeklenmiş boyutları
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeightInPdf = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = imgHeightInPdf;
      let position = 0;

      // İlk Sayfa
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeightInPdf);
      heightLeft -= pdfHeight;

      // Diğer Sayfalar (Varsa)
      while (heightLeft > 0) {
        position -= pdfHeight; // Bir sayfa boyu yukarı kaydır
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeightInPdf);
        heightLeft -= pdfHeight;
      }

      // 5. İndir
      pdf.save(`Basvuru_${applicationData?.name || "CV"}.pdf`);
    } catch (error) {
      console.error("PDF Hatası:", error);
      alert("PDF oluşturulurken bir sorun oluştu.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60  p-4 overflow-hidden">
      <div className="bg-white w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Başvuru Önizleme</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all
                ${
                  isDownloading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95"
                }
              `}
            >
              {isDownloading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Hazırlanıyor...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faDownload} /> PDF İndir
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="text-lg" />
            </button>
          </div>
        </div>

        {/* Content (Ekranda Gösterilen Önizleme) */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8 flex justify-center">
          {/* A4 Görünümü Simülasyonu */}
          <div
            className="bg-white shadow-2xl"
            style={{
              width: "210mm",
              minHeight: "297mm",
              // Ekranda da PDF gibi görünsün diye padding
              padding: "40px",
            }}
          >
            <div ref={templateRef}>
              <CVTemplate data={applicationData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
