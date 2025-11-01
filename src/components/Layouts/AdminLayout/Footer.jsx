import React from "react";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-white/10 bg-neutral-950/60 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-xs text-neutral-400">
        <span>© {new Date().getFullYear()} Chamada Group</span>
        <span>v1.0.0 • Dark</span>
      </div>
    </footer>
  );
}
