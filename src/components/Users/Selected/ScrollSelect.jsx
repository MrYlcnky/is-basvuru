// components/Users/Selected/ScrollSelect.jsx
import { Fragment, useLayoutEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import {
  useFloating,
  offset,
  flip,
  size,
  autoUpdate,
  FloatingPortal,
} from "@floating-ui/react";

export default function ScrollSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Seçiniz",
  error,
  className = "",
  disabled = false,
  maxVisible = 4,
  itemHeight = 40,
  showError = true,
  // opsiyonel: menüye ekstra sınıf göndermek istersen
  menuClassName = "",
}) {
  const selected =
    options.find((o) => String(o.value) === String(value)) || null;
  const fire = (val) => onChange?.({ target: { name, value: val } });

  const { refs, floatingStyles, update } = useFloating({
    // >>> kritik: animationFrame ile ilk ölçümü daha doğru zamanla
    whileElementsMounted(reference, floating, _update) {
      return autoUpdate(reference, floating, _update, { animationFrame: true });
    },
    placement: "bottom-start",
    strategy: "fixed",
    middleware: [
      offset(4),
      flip({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${maxVisible * itemHeight}px`,
          });
        },
      }),
    ],
  });

  // Menü konumu hesaplanana kadar görünür etme (flicker/kayma fix)
  const [ready, setReady] = useState(false);
  useLayoutEffect(() => {
    setReady(false);
    // open olduğunda HeadlessUI Listbox, Options'ı render eder -> update et
    // bir frame sonra ready=true
    update?.();
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [update, options.length]); // seçenek sayısı değişince de tazele

  const BUTTON_BASE =
    "w-full h-[42px] rounded-lg border px-3 py-2 text-left focus:outline-none transition relative";
  const BUTTON_ENABLED = error
    ? "bg-white text-gray-900 border-gray-300 hover:border-black cursor-pointer"
    : "bg-white text-gray-900 border-gray-300 hover:border-black cursor-pointer";
  const BUTTON_DISABLED =
    "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed";

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-bold text-gray-700 mb-1">
          {label} <span className="text-red-500">*</span>
        </label>
      )}

      <Listbox
        value={selected?.value ?? ""}
        onChange={fire}
        disabled={disabled}
      >
        {({ open }) => (
          <div className="relative">
            <Listbox.Button
              ref={refs.setReference}
              className={`${BUTTON_BASE} ${
                disabled ? BUTTON_DISABLED : BUTTON_ENABLED
              } transition-none`}
              aria-disabled={disabled}
              tabIndex={disabled ? -1 : 0}
              data-disabled={disabled ? "true" : "false"}
            >
              <span
                className={
                  selected ? "" : disabled ? "text-gray-500" : "text-gray-400"
                }
              >
                {selected ? selected.label : placeholder}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <ChevronUpDownIcon
                  className={`h-4 w-4 ${
                    disabled ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </span>
            </Listbox.Button>

            {/* Panel */}
            <FloatingPortal>
              <Transition
                as={Fragment}
                show={open}
                // sadece fade-out; enter animasyonu vermiyoruz ki konum şaşmasın
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  ref={refs.setFloating}
                  // hazır olana kadar görünmez; hazır olduğunda görünür
                  style={{
                    ...floatingStyles,
                    visibility: ready ? "visible" : "hidden",
                  }}
                  className={`z-[1000] mt-2 rounded-lg border border-gray-200 bg-white shadow-lg overflow-y-auto focus:outline-none transition-none will-change-auto ${menuClassName}`}
                >
                  {options.map((opt) => (
                    <Listbox.Option
                      key={opt.value}
                      value={opt.value}
                      className={({ active }) =>
                        `relative cursor-pointer select-none px-3 py-2 text-sm ${
                          active ? "bg-gray-100" : "bg-white"
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {opt.label}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 right-3 flex items-center">
                              <CheckIcon className="h-4 w-4" />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </FloatingPortal>
          </div>
        )}
      </Listbox>

      {showError && error && (
        <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>
      )}
    </div>
  );
}
