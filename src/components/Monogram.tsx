export function Monogram({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="48" cy="48" r="46" stroke="currentColor" strokeWidth="1" opacity="0.7" />
      <path
        d="M30 61V35h4.4l13.2 17.8L60.8 35H65v26h-4.6V43.5L47.6 60.7h-.2L34.6 43.5V61H30z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M67.5 57.5h-13v-3h13v3z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}
