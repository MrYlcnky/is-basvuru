import { useState } from "react";
import CountryCitySelect from "../Selected/CountryCitySelect";
import NationalitySelect from "../Selected/NationalitySelect";

export default function PersonalInformation() {
  const [, setBirth] = useState({ country: "", city: "" }); //birth
  const [, setResidence] = useState({ country: "", city: "" }); //residence
  const [, setNationality] = useState(""); //nationality

  return (
    <div className="bg-gray-50 rounded-b-lg p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ad */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-bold text-gray-700 mb-1"
          >
            Ad
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Adınızı giriniz"
            autoComplete="given-name"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Soyad */}
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-bold text-gray-700 mb-1"
          >
            Soyad
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Soyadınızı giriniz"
            autoComplete="family-name"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* E-posta */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold text-gray-700 mb-1"
          >
            E-posta
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="ornek@mail.com"
            autoComplete="email"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Telefon */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-bold text-gray-700 mb-1"
          >
            Telefon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            inputMode="tel"
            placeholder="05xx xxx xx xx"
            autoComplete="tel-national"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* WhatsApp Telefon */}
        <div>
          <label
            htmlFor="whatsappPhone"
            className="block text-sm font-bold text-gray-700 mb-1"
          >
            WhatsApp Telefon
          </label>
          <input
            type="tel"
            id="whatsappPhone"
            name="whatsappPhone"
            inputMode="tel"
            placeholder="+90 5xx xxx xx xx"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>
        {/* Adres */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-bold text-gray-700 mb-1"
          >
            Adres
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Mahalle / Cadde / No"
            autoComplete="address-line1"
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Cinsiyet */}
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-bold text-gray-700 mb-1"
          >
            Cinsiyet
          </label>
          <select
            id="gender"
            name="gender"
            className="block w-full h-[43px] rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            defaultValue=""
          >
            <option value="" disabled>
              Seçiniz
            </option>
            <option value="female">Kadın</option>
            <option value="male">Erkek</option>
          </select>
        </div>

        {/* Medeni Durum */}
        <div>
          <label
            htmlFor="maritalStatus"
            className="block text-sm font-bold text-gray-700 mb-1"
          >
            Medeni Durum
          </label>
          <select
            id="maritalStatus"
            name="maritalStatus"
            className="block w-full h-[43px] rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            defaultValue=""
          >
            <option value="" disabled>
              Seçiniz
            </option>
            <option value="single">Bekâr</option>
            <option value="married">Evli</option>
            <option value="divorced">Boşanmış</option>
            <option value="widowed">Dul</option>
          </select>
        </div>

        {/* Doğum Tarihi */}
        <div>
          <label
            htmlFor="birthDate"
            className="block text-sm font-bold text-gray-700 mb-1"
          >
            Doğum Tarihi
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            onFocus={(e) => e.target.showPicker && e.target.showPicker()}
            onClick={(e) => e.target.showPicker && e.target.showPicker()}
            className="block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer"
          />
        </div>

        {/* Ülke / Şehir Select */}
        {/*Doğum yeri Ülke Şehir*/}
        <CountryCitySelect
          countryLabel="Ülke (Doğum)"
          cityLabel="Şehir (Doğum Yeri)"
          countryId="countryOfBirth"
          cityId="birthPlace"
          onChange={setBirth}
          className=""
        />

        {/* Yaşadığı yer (ülke/şehir) */}
        <CountryCitySelect
          countryLabel="Yaşadığı Ülke"
          cityLabel="Yaşadığı Şehir"
          countryId="residenceCountry"
          cityId="residenceCity"
          onChange={setResidence}
          className=""
        />

        {/* Uyruğu */}
        <NationalitySelect
          label="Uyruğu"
          id="nationality"
          name="nationality"
          defaultValue=""
          className=""
          onChange={setNationality}
        />

        {/* Cinsiyet */}
        <div>
          <label
            htmlFor="children"
            className="block text-sm font-bold text-gray-700 mb-1"
          >
            Çocuk Sayısı
          </label>
          <select
            id="children"
            name="children"
            className="block w-full h-[43px] rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            defaultValue=""
          >
            <option value="" disabled>
              Seçiniz
            </option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">Daha Fazla</option>
          </select>
        </div>
      </div>
    </div>
  );
}
