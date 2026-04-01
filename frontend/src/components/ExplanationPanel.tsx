import { EXPLANATION_MODES } from "./constants";

type ExplanationPanelProps = {
  mode: string;
  explanation: string;
  isLoading: boolean;
  copiedExplanation: boolean;
  onCopy: () => void;
  onClear: () => void;
};

const renderLine = (line: string, i: number) => {
  if (line.startsWith("**") && line.endsWith("**")) {
    return (
      <p
        key={i}
        className="text-lime-400 mt-4 mb-1 first:mt-0"
        style={{ fontWeight: 600 }}
      >
        {line.replace(/\*\*/g, "")}
      </p>
    );
  }
  if (line.match(/^\d+\./)) {
    return (
      <div key={i} className="flex gap-2 mb-1.5 text-gray-400">
        <span className="text-lime-400/60 shrink-0">
          {line.match(/^\d+/)?.[0]}.
        </span>
        <span
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/^\d+\./, "")
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/`(.*?)`/g, "<code>$1</code>"),
          }}
        />
      </div>
    );
  }
  if (!line.trim()) return <div key={i} className="h-2" />;
  return (
    <p
      key={i}
      className="mb-1.5 text-gray-400"
      dangerouslySetInnerHTML={{
        __html: line
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/`(.*?)`/g, "<code>$1</code>"),
      }}
    />
  );
};

export const ExplanationPanel = ({
  mode,
  explanation,
  isLoading,
  copiedExplanation,
  onCopy,
  onClear,
}: ExplanationPanelProps) => {
  const activeMode = EXPLANATION_MODES.find((m) => m.id === mode);

  return (
    <div className="border border-gray-800 rounded-2xl overflow-hidden bg-gray-900 flex flex-col min-h-96">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center gap-2">
          {explanation && (
            <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />
          )}
          <span className="text-xs font-code text-gray-500">
            {explanation ? `explanation · ${activeMode?.label}` : "output"}
          </span>
        </div>
        {explanation && (
          <button
            onClick={onCopy}
            className="text-xs font-code text-gray-600 hover:text-gray-300 border border-gray-800 hover:border-gray-600 rounded-lg px-2 py-1 transition-all"
          >
            {copiedExplanation ? "✓ copied" : "copy"}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto">
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col gap-3 animate-fade-in">
            <div className="flex items-center gap-2 text-lime-400 text-sm font-code mb-4">
              <span className="flex gap-1">
                <span className="loading-dot w-1.5 h-1.5 rounded-full bg-lime-400 inline-block" />
                <span className="loading-dot w-1.5 h-1.5 rounded-full bg-lime-400 inline-block" />
                <span className="loading-dot w-1.5 h-1.5 rounded-full bg-lime-400 inline-block" />
              </span>
              Reading your code...
            </div>
            {[80, 60, 90, 50, 70].map((w, i) => (
              <div
                key={i}
                className="h-3 rounded bg-gray-800 animate-pulse"
                style={{ width: `${w}%`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}

        {/* Explanation */}
        {!isLoading && explanation && (
          <div className="animate-fade-in explanation-content text-sm font-code text-gray-300 leading-relaxed">
            {explanation.split("\n").map((line, i) => renderLine(line, i))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !explanation && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
            <div className="w-16 h-16 rounded-2xl border border-gray-800 flex items-center justify-center text-2xl bg-gray-950">
              {activeMode?.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm font-code">
                {activeMode?.desc}
              </p>
              <p className="text-gray-700 text-xs font-code mt-1">
                Paste code on the left, then click explain
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {explanation && !isLoading && (
        <div className="px-4 py-2.5 border-t border-gray-800 bg-gray-950 flex items-center justify-between">
          <span className="text-xs font-code text-gray-700">
            {explanation.split(" ").length} words · gemini-2.0-flash
          </span>
          <button
            onClick={onClear}
            className="text-xs font-code text-gray-700 hover:text-red-400 transition-colors"
          >
            clear ×
          </button>
        </div>
      )}
    </div>
  );
};
