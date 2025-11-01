import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function MobileMenuNavbar({
  open,
  onClose,
  active,
  setActive,
  navItems = [],
}) {
  // Parent grupların açık/kapalı durumu
  const initialOpen = useMemo(() => {
    const s = {};
    navItems.forEach((it) => {
      if (it.children?.length) s[it.id] = true; // varsayılan açık
    });
    return s;
  }, [navItems]);
  const [openGroups, setOpenGroups] = useState(initialOpen);
  if (!open) return null;
  const isItemActive = (id, children) =>
    active === id ||
    (children?.length ? children.some((c) => active === c.id) : false);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* arka plan */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* çekmece */}
      <div className="absolute left-0 top-0 h-full w-72 bg-neutral-950 border-r border-white/10 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Menü</span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-white/5"
            aria-label="Menüyü kapat"
          >
            <FontAwesomeIcon icon={faXmark} className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ id, label, icon, children }) => {
            const hasChildren = Array.isArray(children) && children.length > 0;
            const activeHere = isItemActive(id, children);

            return (
              <div key={id}>
                {/* Parent satır */}
                <button
                  onClick={() => {
                    if (hasChildren) {
                      setOpenGroups((s) => ({ ...s, [id]: !s[id] }));
                    } else {
                      setActive(id);
                      onClose?.();
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm border transition
                    ${
                      activeHere
                        ? "bg-white/10 border-white/10"
                        : "hover:bg-white/5 border-transparent"
                    }`}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    className={`w-5 h-5 ${
                      activeHere ? "text-indigo-300" : "text-neutral-300"
                    }`}
                  />
                  <span className="flex-1 text-left">{label}</span>

                  {hasChildren && (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`w-4 h-4 text-neutral-400 transition-transform ${
                        openGroups[id] ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Children (accordion) */}
                {hasChildren && (
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                      openGroups[id]
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="mt-1 pl-8 pr-2 space-y-1">
                        {children.map((c) => {
                          const childActive = active === c.id;
                          return (
                            <li key={c.id}>
                              <button
                                onClick={() => {
                                  setActive(c.id);
                                  onClose?.();
                                }}
                                className={`w-full flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] border transition-colors
                                  ${
                                    childActive
                                      ? "bg-white/10 border-white/10 text-neutral-100"
                                      : "hover:bg-white/5 border-transparent text-neutral-300"
                                  }`}
                              >
                                <span
                                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                                    childActive
                                      ? "bg-indigo-400"
                                      : "bg-neutral-500"
                                  }`}
                                />
                                <span className="truncate">{c.label}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
