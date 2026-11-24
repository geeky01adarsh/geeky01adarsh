type Props = {
  children: string;
  className?: string;
};

export function Badge({ children, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-muted ${className}`}
    >
      {children}
    </span>
  );
}
