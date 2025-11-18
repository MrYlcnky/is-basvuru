// Sidebar.jsx
import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({
  collapsed,
  setCollapsed,
  active,
  setActive,
  navItems,
}) {
  // hangi gruplar açık? (id -> boolean)
  const initialOpen = useMemo(() => {
    const state = {};
    (navItems || []).forEach((it) => {
      if (it.children?.length) state[it.id] = true; // parentları varsayılan açık
    });
    return state;
  }, [navItems]);

  const [openGroups, setOpenGroups] = useState(initialOpen);

  const toggleGroup = (id) => setOpenGroups((s) => ({ ...s, [id]: !s[id] }));

  const isItemActive = (itemId, children) => {
    if (active === itemId) return true;
    if (children?.length) {
      return children.some((c) => active === c.id);
    }
    return false;
  };

  return (
    <aside
      className={`hidden lg:flex flex-col transition-[width] duration-300 ease-in-out mt-6 rounded-2xl border border-white/10 bg-neutral-950/60 backdrop-blur ${
        collapsed ? "w-[84px]" : "w-64"
      }`}
    >
      {/* Collapse header */}
      <div className="p-3 flex items-center justify-between border-b border-white/10">
        <span
          className={`text-sm font-semibold transition-opacity ${
            collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          Menü
        </span>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto w-9 h-9 rounded-lg hover:bg-white/5 flex items-center justify-center"
          aria-label="Menüyü daralt/genişlet"
          title={collapsed ? "Genişlet" : "Daralt"}
        >
          {collapsed ? (
            <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
          ) : (
            <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Nav items */}
      <nav className="p-2 space-y-1">
        {(navItems || []).map(({ id, label, icon, children }) => {
          const hasChildren = Array.isArray(children) && children.length > 0;
          const activeHere = isItemActive(id, children);

          // Parent button classes
          const baseParent =
            "group w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors border";
          const parentStyle = activeHere
            ? "bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 border-white/10"
            : "hover:bg-white/5 border-transparent";

          // Chevron rotation
          const chevronRot =
            hasChildren && openGroups[id] ? "rotate-180" : "rotate-0";

          return (
            <div key={id} className="relative">
              {/* Parent row */}
              <button
                onClick={() => (hasChildren ? toggleGroup(id) : setActive(id))}
                className={`${baseParent} ${parentStyle}`}
              >
                {/* Active left rail */}
                <span
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-full ${
                    activeHere
                      ? "bg-indigo-400"
                      : "bg-transparent group-hover:bg-white/20"
                  }`}
                />
                {/* Icon */}
                <FontAwesomeIcon
                  icon={icon}
                  className={`w-5 h-5 ${
                    activeHere
                      ? "text-indigo-400"
                      : "text-neutral-400 group-hover:text-neutral-200"
                  }`}
                />
                {/* Label */}
                <span
                  className={`whitespace-nowrap transition-[opacity,transform] duration-200 ${
                    collapsed
                      ? "opacity-0 -translate-x-2 pointer-events-none"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  {label}
                </span>
                {/* Chevron (children varsa ve collapsed değilse) */}
                {hasChildren && !collapsed && (
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`ml-auto w-3.5 h-3.5 text-neutral-400 transition-transform ${chevronRot}`}
                  />
                )}

                {/* Tooltip (collapsed iken) */}
                {collapsed && (
                  <span
                    className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-md
                               text-xs bg-neutral-900 text-neutral-100 border border-white/10
                               opacity-0 -translate-x-2 transition-all
                               group-hover:opacity-100 group-hover:translate-x-0"
                  >
                    {label}
                  </span>
                )}
              </button>

              {/* Children list (collapsed değilken göster) */}
              {hasChildren && !collapsed && (
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                    openGroups[id]
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="mt-1 pl-9 pr-2 space-y-1">
                      {children.map((child) => {
                        const childActive = active === child.id;
                        return (
                          <li key={child.id}>
                            <button
                              onClick={() => setActive(child.id)}
                              className={`w-full flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] border transition-colors
                                ${
                                  childActive
                                    ? "bg-white/10 border-white/10 text-neutral-100"
                                    : "hover:bg-white/5 border-transparent text-neutral-300"
                                }`}
                              title={child.label}
                            >
                              {/* küçük dot */}
                              <span
                                className={`inline-block h-1.5 w-1.5 rounded-full ${
                                  childActive
                                    ? "bg-indigo-400"
                                    : "bg-neutral-500"
                                }`}
                              />
                              <span className="truncate">{child.label}</span>
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
    </aside>
  );
}
