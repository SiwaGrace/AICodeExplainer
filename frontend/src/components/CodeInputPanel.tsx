import { LANGUAGES } from "./constants";

type CodeInputPanelProps = {
  code: string;
  language: string;
  copied: boolean;
  onCodeChange: (val: string) => void;
  onLanguageChange: (val: string) => void;
  onCopy: () => void;
  onClear: () => void;
};

export const CodeInputPanel = ({
  code,
  language,
  copied,
  onCodeChange,
  onLanguageChange,
  onCopy,
  onClear,
}: CodeInputPanelProps) => {
  const lineCount = code ? code.split("\n").length : 0;
  const charCount = code.length;

  return (
    <div className="border border-gray-800 rounded-2xl overflow-hidden bg-gray-900 flex flex-col flex-1">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <span className="text-gray-600 text-xs font-code">your_code.js</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-gray-400 text-xs rounded-lg px-2 py-1 font-code focus:outline-none focus:border-lime-400/40 cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

          {code && (
            <button
              onClick={onCopy}
              className="text-xs font-code text-gray-600 hover:text-gray-300 border border-gray-800 hover:border-gray-600 rounded-lg px-2 py-1 transition-all"
            >
              {copied ? "✓ copied" : "copy"}
            </button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative flex-1">
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder={`// Paste your code here...\nfunction binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    arr[mid] < target ? left = mid + 1 : right = mid - 1;\n  }\n  return -1;\n}`}
          className="w-full h-80 bg-transparent text-gray-300 placeholder-gray-700 p-4 text-sm font-code resize-none focus:outline-none leading-relaxed"
          spellCheck={false}
        />
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-800 bg-gray-950">
        <div className="flex gap-4 text-xs font-code text-gray-600">
          <span>
            <span className="text-gray-500">{lineCount}</span> lines
          </span>
          <span>
            <span className="text-gray-500">{charCount}</span> chars
          </span>
        </div>
        {code && (
          <button
            onClick={onClear}
            className="text-xs font-code text-gray-700 hover:text-red-400 transition-colors"
          >
            clear ×
          </button>
        )}
      </div>
    </div>
  );
};
