import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom"; // Router kullanıyorsan

// ----- Statik "DB" -----
const STATIC_USERS = [
  {
    username: "admin",
    password: "123456",
    role: "admin",
    name: "Chamada Manager",
  },
  { username: "hr", password: "hr2025", role: "hr", name: "İK Sorumlusu" },
  { username: "it", password: "it2025", role: "it", name: "BT Uzmanı" },
];

export default function Login() {
  const navigate = useNavigate(); // Router yoksa sil ve fallback'i kullan
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const fakeAuth = ({ username, password }) => {
    // "DB" kontrolü
    const user = STATIC_USERS.find(
      (u) => u.username === username && u.password === password
    );
    return user || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // küçük bir fake gecikme (API taklidi)
    setTimeout(() => {
      const user = fakeAuth(form);
      setLoading(false);

      if (!user) {
        setError("Kullanıcı adı veya şifre hatalı.");
        return;
      }

      // Basit oturum bilgisi (gerçekte token vb. tutulur)
      sessionStorage.setItem(
        "authUser",
        JSON.stringify({
          username: user.username,
          role: user.role,
          name: user.name,
          loginAt: new Date().toISOString(),
        })
      );

      // Role göre yönlendirme
      const target = user.role === "admin" ? "/adminpanel" : "/panel";

      // React Router ile
      if (navigate) {
        navigate(target, { replace: true });
      } else {
        // Fallback: Router yoksa bunu aç
        // window.location.href = target;
      }
    }, 500);
  };

  return (
    <div className="bg-gray-500 min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-[960px] sm:max-w-[1100px] lg:max-w-[1200px] h-auto lg:h-[600px] bg-gray-900 [box-shadow:0_2px_10px_-3px_rgba(6,81,237,0.3)] p-4 sm:p-6 lg:p-8 rounded-md">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch gap-6 sm:gap-8 h-full">
          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto w-full p-3 sm:p-4 md:p-6 max-w-md"
          >
            <div className="mb-6 sm:mb-8 mt-6 sm:mt-10 lg:mt-16 flex justify-center">
              <a href="#" className="inline-block">
                <img
                  src="src/images/group.png"
                  alt="logo"
                  className="w-28 sm:w-32 md:w-40"
                />
              </a>
            </div>

            <div className="space-y-5 sm:space-y-6">
              {/* Kullanıcı Adı */}
              <div>
                <label className="text-slate-100 text-sm font-medium mb-2 block">
                  Kullanıcı Adı
                </label>
                <div className="relative flex items-center">
                  <input
                    name="username"
                    type="text"
                    required
                    value={form.username}
                    onChange={handleChange}
                    className="w-full text-sm text-slate-100 placeholder-slate-400 bg-slate-800 focus:bg-slate-800 pl-4 pr-10 py-3 rounded-md border border-slate-700 focus:border-indigo-400 outline-none transition-all"
                    placeholder="Kullanıcı Adı"
                    autoComplete="username"
                  />
                  <FontAwesomeIcon
                    icon={faUser}
                    className="absolute right-4 w-[18px] h-[18px] text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Şifre */}
              <div>
                <label className="text-slate-100 text-sm font-medium mb-2 block">
                  Şifre
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="w-full text-sm text-slate-100 placeholder-slate-400 bg-slate-800 focus:bg-slate-800 pl-4 pr-10 py-3 rounded-md border border-slate-700 focus:border-indigo-400 outline-none transition-all"
                    placeholder="Şifrenizi girin"
                    autoComplete="current-password"
                  />
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute right-4 w-[18px] h-[18px] text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Hata mesajı */}
              {error && (
                <div
                  className="text-red-300 bg-red-900/20 border border-red-800/40 rounded-md px-3 py-2 text-sm"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              {/* Giriş Yap butonu */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-md text-white text-sm font-medium py-3 px-4 transition-colors
                    ${
                      loading
                        ? "bg-indigo-700 cursor-not-allowed opacity-80"
                        : "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700"
                    }`}
                >
                  <FontAwesomeIcon
                    icon={faRightToBracket}
                    className={`w-4 h-4 ${loading ? "animate-pulse" : ""}`}
                  />
                  {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </button>
              </div>
            </div>
          </form>

          {/* Sağ panel */}
          <div className="w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-full">
            <div className="relative rounded-md overflow-hidden w-full h-full bg-gradient-to-br from-slate-900 to-indigo-950">
              <div
                className="absolute inset-0 opacity-15 sm:opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />
              <div className="absolute inset-0 px-5 sm:px-8 lg:px-10 py-6 sm:py-8 flex items-center justify-center">
                <div className="max-w-md text-center">
                  <div className="mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">🗝️</span>
                  </div>
                  <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-semibold">
                    Yönetim Girişi
                  </h2>
                  <p className="text-slate-300 mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed">
                    Lütfen kurumsal bilgilerinizle giriş yapınız. Yetkisiz
                    erişimler engellenir.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* /Sağ panel */}
        </div>
      </div>
    </div>
  );
}
