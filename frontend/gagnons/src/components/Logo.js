import React from "react";

export default function Logo({ className = "", size = "default", showText = true }) {
  const sizes = {
    small: "w-8 h-8",
    default: "w-10 h-10",
    large: "w-12 h-12",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <svg
          className={sizes[size]}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>

          {/* Cercle principal avec effet de profondeur */}
          <circle
            cx="24"
            cy="24"
            r="18"
            fill="url(#logoGradient)"
            className="drop-shadow-lg"
          />
          
          {/* Graphique de tendance */}
          <path
            d="M12 30 L16 26 L20 28 L24 22 L28 24 L32 20 L36 22"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.8"
          />
          
          {/* Ballon stylisé au centre */}
          <circle
            cx="24"
            cy="24"
            r="6"
            fill="#0f172a"
            opacity="0.3"
          />
          <path
            d="M24 18 L20 24 L24 30 L28 24 Z"
            fill="#0f172a"
            opacity="0.5"
          />
          
          {/* Points de données */}
          <circle cx="16" cy="28" r="1.5" fill="#0f172a" opacity="0.6" />
          <circle cx="20" cy="28" r="1.5" fill="#0f172a" opacity="0.6" />
          <circle cx="28" cy="24" r="1.5" fill="#0f172a" opacity="0.6" />
          <circle cx="32" cy="22" r="1.5" fill="#0f172a" opacity="0.6" />
        </svg>
      </div>
      
      {showText && (
        <span className="text-gradient font-bold text-xl md:text-2xl tracking-tight">
          GagnerBet
        </span>
      )}
    </div>
  );
}
