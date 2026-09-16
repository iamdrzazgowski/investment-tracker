import * as React from "react";

type NordwellLogoProps = {
  className?: string;
  showText?: boolean;
  inverse?: boolean;
};

export function NordwellLogo({
  className = "",
  showText = true,
  inverse = false,
}: NordwellLogoProps) {
  return (
    <div
      className={`relative flex items-center gap-2 ${className}`}
      aria-label="Nordwell"
    >
      <NordwellMark inverse={inverse} />

      {showText && (
        <span
          className={[
            "text-[15px] font-semibold tracking-tight",
            inverse ? "text-white" : "text-[#15151A]",
          ].join(" ")}
        >
          Nordwell
        </span>
      )}
    </div>
  );
}

type NordwellMarkProps = {
  inverse?: boolean;
};

function NordwellMark({ inverse = false }: NordwellMarkProps) {
  return (
    <svg
      viewBox="0 0 30 24"
      width="30"
      height="24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="
          M2.5 17.5
          C4.5 17.5 5.5 15.5 6.8 12
          C8.2 8.2 9.5 5.5 12 5.5
          C14.4 5.5 15.6 8.3 16.9 12.2
          C18.1 15.7 19.5 17.5 21.5 17.5
          C23.4 17.5 24.8 15.4 26 12.9
          C26.8 11.2 27.7 10.2 29 10.2
        "
        stroke={inverse ? "#FFFFFF" : "#15151A"}
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
