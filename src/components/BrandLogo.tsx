import { useState } from 'react';

export function BrandLogo({
  brandName = 'DYD AI',
  logoUrl = '/assets/aistudio/image_fa46e441.png',
  light = false,
}: {
  brandName?: string;
  logoUrl?: string;
  light?: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  if (logoUrl && !imgError) {
    return (
      <span
        className={`inline-flex items-center whitespace-nowrap shrink-0 ${
          light ? 'bg-white px-3 py-1.5 rounded-xl shadow-sm' : ''
        }`}
      >
        <img
          src={logoUrl}
          alt={brandName}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-9 sm:h-10 w-auto max-w-[190px] object-contain"
        />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
      <svg
        width="36"
        height="36"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="dydLogoGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#092A20" />
            <stop offset="60%" stopColor="#006A4E" />
            <stop offset="100%" stopColor="#D92B2B" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#dydLogoGrad)" />
        <path
          d="M32 13L49 22.8V41.2L32 51L15 41.2V22.8L32 13Z"
          stroke="#FFFFFF"
          strokeWidth="2.8"
          strokeLinejoin="round"
        />
        <path
          d="M32 13V25M49 22.8L38 29M49 41.2L38 35M32 51V39M15 41.2L26 35M15 22.8L26 29"
          stroke="#34D399"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="32" cy="32" r="5.5" fill="#FFFFFF" />
      </svg>
      <span
        className={`font-display text-xl font-extrabold tracking-tight ${
          light ? 'text-white' : 'text-[#092A20]'
        }`}
      >
        {brandName}
      </span>
    </span>
  );
}
