/**
 * Official Smagizh logo, taken from the client's approved artwork
 * (public/brand/*.png, transparent background, original colours).
 *
 * The "S" mark and the multicolour "Smagizh" wordmark are images so they are
 * pixel-identical to the approved logo; the tagline is live text so it stays
 * crisp at small sizes and can switch to white on dark backgrounds.
 */

export const LOGO_SRC = {
  full: '/brand/smagizh-logo.png',
  mark: '/brand/smagizh-mark.png',
  wordmark: '/brand/smagizh-wordmark.png',
}

export function LogoMark({ className = 'h-10 w-auto' }) {
  return <img src={LOGO_SRC.mark} alt="" aria-hidden="true" className={`${className} select-none`} draggable="false" />
}

/**
 * variant="light" -> light backgrounds (header, admin login)
 * variant="dark"  -> dark backgrounds (footer, admin sidebar)
 */
export default function Logo({ variant = 'light', size = 'md', showText = true, showTagline = true, className = '' }) {
  const dark = variant === 'dark'
  const sizes = {
    sm: { mark: 'h-8', word: 'h-[22px]', tag: 'text-[9px]' },
    md: { mark: 'h-11', word: 'h-7', tag: 'text-[10.5px]' },
    lg: { mark: 'h-14', word: 'h-9', tag: 'text-xs' },
  }[size]

  return (
    <span className={`flex items-center gap-2 ${className}`} role="img" aria-label="Smagizh - Your Business Growth Partner">
      <LogoMark className={`${sizes.mark} w-auto shrink-0`} />
      {showText && (
        <span className="flex flex-col items-start leading-none">
          <img
            src={LOGO_SRC.wordmark}
            alt=""
            aria-hidden="true"
            draggable="false"
            className={`${sizes.word} w-auto select-none`}
          />
          {showTagline && (
            <span
              className={`mt-1 whitespace-nowrap font-semibold tracking-tight ${sizes.tag} ${
                dark ? 'text-white/80' : 'text-[#1B2A6B]'
              }`}
            >
              Your Business Growth Partner
            </span>
          )}
        </span>
      )}
    </span>
  )
}
