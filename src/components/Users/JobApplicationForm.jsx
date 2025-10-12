import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faGraduationCap,
  faPlus,
  faAward,
  faLaptopCode,
  faLanguage,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";

import PersonalInformation from "./usersComponents/PersonalInformation";
import EducationTable from "./usersComponents/EducationTable";
import CertificateTable from "./usersComponents/CertificatesTable";
import ComputerInformationTable from "./usersComponents/ComputerInformationTable";
import LanguageTable from "./usersComponents/LanguageTable";
import JobExperiencesTable from "./usersComponents/JobExperiencesTable";

export default function JobApplicationForm() {
  const educationTableRef = useRef(null);
  const certificatesTableRef = useRef(null);
  const computerInformationTableRef = useRef(null);
  const languageTableRef = useRef(null);
  const jobExperiencesTableRef = useRef(null);

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-500 via-gray-500 to-gray-500 pb-8 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.4)] border border-gray-400/20">
      {/* Başlık */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 py-16 sm:py-20 shadow-2xl rounded-2xl">
        {/* Parlak vurgu efekti */}
        <div className="absolute inset-0 bg-gradient-to-tr  via-transparent to-transparent" />

        {/* İçerik */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          {/* Ana başlık */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-wide text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.3)]">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-amber-200 ">
              CHAMADA GROUP
            </span>
            <span className="block mt-2 text-gray-300 font-light">
              İŞ BAŞVURU FORMU
            </span>
          </h1>

          {/* Alt açıklama */}
          <p className="mt-6 text-lg sm:text-xl font-medium text-gray-300">
            <span className="text-amber-300 font-semibold">Lütfen</span> tüm
            bilgilerinizi dikkatli ve eksiksiz doldurunuz.
          </p>

          {/* Alt çizgi */}
          <div className="mt-6 mx-auto w-28 h-[2.5px] bg-gradient-to-r from-gray-200 via-amber-300 to-gray-200 rounded-full shadow-md" />
        </div>

        {/* Alt ışık efekti */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-100/10 blur-3xl rounded-full" />
      </div>

      {/* Uyarı Kutusu 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-start sm:items-center gap-3 sm:gap-4 rounded-md border border-red-400 bg-red-100 px-4 sm:px-5 py-3 text-red-800">
          <svg
            className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-red-600 shrink-0"
            fill="currentColor"
            viewBox="0 0 18 18"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4h2v2h-2v-2zm0-8h2v6h-2V6z"
            />
          </svg>
          <span className="text-sm sm:text-base leading-relaxed">
            <strong>Dikkat! </strong>
            <br className="hidden sm:block" />
            Formu doldurmadan önce lütfen metni dikkatle okuyunuz. Bu başvuru
            yalnızca başvuran kişi tarafından eksiksiz şekilde doldurulmalıdır.
            Lütfen hiçbir alanı boş bırakmayınız!
          </span>
        </div>
      </div>
      */}

      {/* Kişisel Bilgiler */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center gap-3 sm:gap-4 bg-gray-800 rounded-t-lg px-4 sm:px-6 py-4">
          <FontAwesomeIcon
            icon={faUser}
            className="text-amber-50 text-2xl sm:text-3xl"
          />
          <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-amber-50">
            Kişisel Bilgiler
          </h4>
        </div>
        <div>
          <PersonalInformation />
        </div>
      </div>

      {/* Eğitim Bilgileri */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Başlık satırı + Ekle butonu aynı hizada */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 bg-gray-800 rounded-t-lg px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faGraduationCap}
              className="text-amber-50 text-2xl sm:text-3xl"
            />
            <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-amber-50">
              Eğitim Bilgileri
            </h4>
          </div>
          {/*Ekle Butonu */}
          <div>
            <button
              type="button"
              onClick={() => educationTableRef.current?.openCreate()}
              aria-label="Eğitim bilgisi ekle"
              className="inline-flex items-center justify-center px-3 py-2 sm:px-5 sm:py-2.5 
                      bg-green-600 hover:bg-green-700 active:bg-green-800
                      text-white font-semibold rounded-lg transition 
                      duration-150 ease-in-out focus:outline-none
                      active:scale-95 cursor-pointer shadow-sm"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2 text-white" />
              <span className="text-sm sm:text-base ">Ekle</span>
            </button>
          </div>
        </div>

        <div>
          <EducationTable ref={educationTableRef} />
        </div>
      </div>

      {/* Sertifika ve Eğitimler*/}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Başlık + Ekle */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 bg-gray-800 rounded-t-lg px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faAward}
              className="text-amber-50 text-2xl sm:text-3xl"
            />
            <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-amber-50">
              Sertifika ve Eğitimler
            </h4>
          </div>

          {/*Ekle Butonu */}
          <div>
            <button
              type="button"
              onClick={() => certificatesTableRef.current?.openCreate()}
              aria-label="Sertifika ve Eğitim bilgisi ekle"
              className="inline-flex items-center justify-center px-3 py-2 sm:px-5 sm:py-2.5 
                      bg-green-600 hover:bg-green-700 active:bg-green-800
                      text-white font-semibold rounded-lg transition 
                      duration-150 ease-in-out focus:outline-none
                      active:scale-95 cursor-pointer shadow-sm"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2 text-white" />
              <span className="text-sm sm:text-base ">Ekle</span>
            </button>
          </div>
          {/*Ekle Butonu Div */}
        </div>
        {/* Başlık+ Ekle butonu  div*/}

        <div>
          <CertificateTable ref={certificatesTableRef} />
        </div>
      </div>

      {/* Bilgisayar Bilgileri*/}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Başlık + Ekle */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 bg-gray-800 rounded-t-lg px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faLaptopCode}
              className="text-amber-50 text-2xl sm:text-3xl"
            />
            <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-amber-50">
              Bilgisayar Bilgileri
            </h4>
          </div>

          {/*Ekle Butonu */}
          <div>
            <button
              type="button"
              onClick={() => computerInformationTableRef.current?.openCreate()}
              aria-label="Sertifika ve Eğitim bilgisi ekle"
              className="inline-flex items-center justify-center px-3 py-2 sm:px-5 sm:py-2.5 
                      bg-green-600 hover:bg-green-700 active:bg-green-800
                      text-white font-semibold rounded-lg transition 
                      duration-150 ease-in-out focus:outline-none
                      active:scale-95 cursor-pointer shadow-sm"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2 text-white" />
              <span className="text-sm sm:text-base ">Ekle</span>
            </button>
          </div>
        </div>

        <div>
          <ComputerInformationTable ref={computerInformationTableRef} />
        </div>
      </div>

      {/* Yabancı Dil Bilgisi*/}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Başlık + Ekle */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 bg-gray-800 rounded-t-lg px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faLanguage}
              className="text-amber-50 text-2xl sm:text-3xl"
            />
            <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-amber-50">
              Yabancı Dil Bilgisi
            </h4>
          </div>

          {/*Ekle Butonu */}
          <div>
            <button
              type="button"
              onClick={() => languageTableRef.current?.openCreate()}
              aria-label="Sertifika ve Eğitim bilgisi ekle"
              className="inline-flex items-center justify-center px-3 py-2 sm:px-5 sm:py-2.5 
                      bg-green-600 hover:bg-green-700 active:bg-green-800
                      text-white font-semibold rounded-lg transition 
                      duration-150 ease-in-out focus:outline-none
                      active:scale-95 cursor-pointer shadow-sm"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2 text-white" />
              <span className="text-sm sm:text-base ">Ekle</span>
            </button>
          </div>
        </div>

        <div>
          <LanguageTable ref={languageTableRef} />
        </div>
      </div>

      {/* İş Deneyimleri*/}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Başlık + Ekle */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 bg-gray-800 rounded-t-lg px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon
              icon={faBriefcase}
              className="text-amber-50 text-2xl sm:text-3xl"
            />
            <h4 className="text-lg sm:text-xl md:text-2xl font-semibold text-amber-50">
              İş Deneyimleri
            </h4>
          </div>

          {/*Ekle Butonu */}
          <div>
            <button
              type="button"
              onClick={() => jobExperiencesTableRef.current?.openCreate()}
              aria-label="Sertifika ve Eğitim bilgisi ekle"
              className="inline-flex items-center justify-center px-3 py-2 sm:px-5 sm:py-2.5 
                      bg-green-600 hover:bg-green-700 active:bg-green-800
                      text-white font-semibold rounded-lg transition 
                      duration-150 ease-in-out focus:outline-none
                      active:scale-95 cursor-pointer shadow-sm"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2 text-white" />
              <span className="text-sm sm:text-base ">Ekle</span>
            </button>
          </div>
        </div>

        <div>
          <JobExperiencesTable ref={jobExperiencesTableRef} />
        </div>
      </div>
    </div>
  );
}
