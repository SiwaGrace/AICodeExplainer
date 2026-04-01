import { EXPLANATION_MODES } from "./constants";

type ModeSelectorProps = {
  mode: string;
  onModeChange: (id: string) => void;
};

export const ModeSelector = ({ mode, onModeChange }: ModeSelectorProps) => {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex gap-2">
        {EXPLANATION_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            title={m.desc}
            className={`px-3 py-2 rounded-lg text-xs font-code transition-all border ${
              mode === m.id
                ? "bg-lime-400/10 border-lime-400/40 text-lime-400"
                : "bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"
            }`}
          >
            <span className="mr-1">{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Mobile */}
      <div className="flex md:hidden gap-2 mb-4 overflow-x-auto pb-1">
        {EXPLANATION_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => onModeChange(m.id)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-code transition-all border ${
              mode === m.id
                ? "bg-lime-400/10 border-lime-400/40 text-lime-400"
                : "bg-gray-900 border-gray-800 text-gray-500"
            }`}
          >
            {m.icon} {m.label}
          </button>
        ))}
      </div>
    </>
  );
};
