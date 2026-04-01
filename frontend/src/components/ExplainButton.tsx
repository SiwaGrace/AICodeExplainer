type ExplainButtonProps = {
  isLoading: boolean;
  disabled: boolean;
  activeMode: { icon: string; btn: string } | undefined;
  onClick: () => void;
};

export const ExplainButton = ({
  isLoading,
  disabled,
  activeMode,
  onClick,
}: ExplainButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-3 w-full relative group overflow-hidden bg-lime-400 disabled:bg-gray-800 hover:bg-lime-300 text-gray-950 disabled:text-gray-600 py-4 rounded-xl transition-all text-sm tracking-widest uppercase shadow-lg shadow-lime-400/10 disabled:shadow-none active:scale-[0.99] disabled:cursor-not-allowed"
      style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="flex gap-1">
            <span className="loading-dot w-1.5 h-1.5 rounded-full bg-gray-950 inline-block" />
            <span className="loading-dot w-1.5 h-1.5 rounded-full bg-gray-950 inline-block" />
            <span className="loading-dot w-1.5 h-1.5 rounded-full bg-gray-950 inline-block" />
          </span>
          Analyzing...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <span className="text-lg">{activeMode?.icon}</span>
          {activeMode?.btn}
        </span>
      )}
      {/* Shimmer */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent" />
    </button>
  );
};
