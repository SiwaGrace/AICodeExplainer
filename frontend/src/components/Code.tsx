import { useState } from "react";
import axios from "axios";

const LANGUAGES = [
  "Auto Detect",
  "JavaScript",
  "TypeScript",
  "Python",
  "Rust",
  "Go",
  "Java",
  "C++",
  "SQL",
];

const EXPLANATION_MODES = [
  {
    id: "explain",
    label: "Explain",
    icon: "💡",
    desc: "Plain English breakdown",
    btn: "Explain This Code",
  },
  {
    id: "line-by-line",
    label: "Line by Line",
    icon: "📋",
    desc: "Step through each line",
    btn: "Break Down Line by Line",
  },
  {
    id: "complexity",
    label: "Complexity",
    icon: "📊",
    desc: "Time & space analysis",
    btn: "Analyze Complexity",
  },
  {
    id: "bugs",
    label: "Find Bugs",
    icon: "🐛",
    desc: "Spot potential issues",
    btn: "Hunt for Bugs",
  },
];

const Code = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Auto Detect");
  const [mode, setMode] = useState("explain");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedExplanation, setCopiedExplanation] = useState(false);

  const handleExplain = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setExplanation("");
    // Simulate API delay for UI demo
    try {
      const response = await axios.post(
        "http://localhost:9000/api/codeexplain",
        {
          code: code,
          mode: mode,
          language:
            language === "Auto Detect" ? "javascript" : language.toLowerCase(),
        },
      );

      const data = response.data;

      // check nested first, then top level
      if (data.explanation?.explanation) {
        setExplanation(data.explanation.explanation); // nested object
      } else if (typeof data.explanation === "string") {
        setExplanation(data.explanation); // direct string
      } else if (typeof data === "string") {
        setExplanation(data); // raw string
      } else {
        console.log("unexpected shape:", data); // debug unknown shape
      }
      setIsLoading(false);
    } catch (error) {}
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyExplanation = () => {
    navigator.clipboard?.writeText(explanation);
    setCopiedExplanation(true);
    setTimeout(() => setCopiedExplanation(false), 2000);
  };

  const lineCount = code ? code.split("\n").length : 0;
  const charCount = code.length;

  const activeMode = EXPLANATION_MODES.find((m) => m.id === mode);

  return (
    <div
      className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8"
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      }}
    >
      {/* Google Font Import via style tag workaround */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-code { font-family: 'JetBrains Mono', monospace; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-fade-in { animation: fadeSlideIn 0.4s ease forwards; }
        .loading-dot:nth-child(1) { animation: pulse-dot 1.2s ease infinite 0s; }
        .loading-dot:nth-child(2) { animation: pulse-dot 1.2s ease infinite 0.2s; }
        .loading-dot:nth-child(3) { animation: pulse-dot 1.2s ease infinite 0.4s; }
        .line-numbers {
          counter-reset: line;
        }
        .line-numbers > div {
          counter-increment: line;
        }
        .line-numbers > div::before {
          content: counter(line);
          display: inline-block;
          width: 2rem;
          text-align: right;
          margin-right: 1rem;
          color: #374151;
          font-size: 0.75rem;
          user-select: none;
        }
        textarea::-webkit-scrollbar { width: 4px; }
        textarea::-webkit-scrollbar-track { background: transparent; }
        textarea::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }
        .explanation-content p { margin-bottom: 0.75rem; }
        .explanation-content strong { color: #a3e635; font-weight: 600; }
        .explanation-content code {
          background: #1f2937;
          border: 1px solid #374151;
          border-radius: 3px;
          padding: 1px 5px;
          font-size: 0.8em;
          color: #86efac;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2 h-2 rounded-full bg-lime-400"
                style={{ animation: "pulse-dot 2s ease infinite" }}
              />
              <span className="text-lime-400 text-xs tracking-[0.3em] uppercase font-code">
                v1.0.0 · ready
              </span>
            </div>
            <h1
              className="font-display text-4xl md:text-5xl font-800 text-white tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
            >
              Code<span className="text-lime-400">.</span>Explainer
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-code">
              Paste code → understand everything
            </p>
          </div>

          {/* Mode selector */}
          <div className="hidden md:flex gap-2">
            {EXPLANATION_MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
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
        </div>

        {/* Mobile mode selector */}
        <div className="flex md:hidden gap-2 mb-4 overflow-x-auto pb-1">
          {EXPLANATION_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
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

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left panel — Code Input */}
          <div className="flex flex-col">
            <div className="border border-gray-800 rounded-2xl overflow-hidden bg-gray-900 flex flex-col flex-1">
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950">
                <div className="flex items-center gap-3">
                  {/* Traffic lights */}
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-gray-600 text-xs font-code">
                    your_code.js
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Language selector */}
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-gray-900 border border-gray-700 text-gray-400 text-xs rounded-lg px-2 py-1 font-code focus:outline-none focus:border-lime-400/40 cursor-pointer"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>

                  {/* Copy button */}
                  {code && (
                    <button
                      onClick={handleCopyCode}
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
                  onChange={(e) => setCode(e.target.value)}
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
                    onClick={() => setCode("")}
                    className="text-xs font-code text-gray-700 hover:text-red-400 transition-colors"
                  >
                    clear ×
                  </button>
                )}
              </div>
            </div>

            {/* Explain button */}
            <button
              onClick={handleExplain}
              disabled={!code.trim() || isLoading}
              className="mt-3 w-full relative group overflow-hidden bg-lime-400 disabled:bg-gray-800 hover:bg-lime-300 text-gray-950 disabled:text-gray-600 font-display font-700 py-4 rounded-xl transition-all text-sm tracking-widest uppercase shadow-lg shadow-lime-400/10 disabled:shadow-none active:scale-[0.99] disabled:cursor-not-allowed"
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
          </div>

          {/* Right panel — Explanation Output */}
          <div className="border border-gray-800 rounded-2xl overflow-hidden bg-gray-900 flex flex-col min-h-96">
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950">
              <div className="flex items-center gap-2">
                {explanation && (
                  <div className="w-1.5 h-1.5 rounded-full bg-lime-400" />
                )}
                <span className="text-xs font-code text-gray-500">
                  {explanation
                    ? `explanation · ${EXPLANATION_MODES.find((m2) => m2.id === mode)?.label}`
                    : "output"}
                </span>
              </div>
              {explanation && (
                <button
                  onClick={handleCopyExplanation}
                  className="text-xs font-code text-gray-600 hover:text-gray-300 border border-gray-800 hover:border-gray-600 rounded-lg px-2 py-1 transition-all"
                >
                  {copiedExplanation ? "✓ copied" : "copy"}
                </button>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 p-5 overflow-y-auto">
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

              {!isLoading && explanation && (
                <div className="animate-fade-in explanation-content text-sm font-code text-gray-300 leading-relaxed">
                  {explanation.split("\n").map((line, i) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return (
                        <p
                          key={i}
                          className="text-lime-400 font-600 mt-4 mb-1 first:mt-0"
                          style={{ fontWeight: 600 }}
                        >
                          {line.replace(/\*\*/g, "")}
                        </p>
                      );
                    }
                    if (line.match(/^\d+\./)) {
                      return (
                        <div
                          key={i}
                          className="flex gap-2 mb-1.5 text-gray-400"
                        >
                          <span className="text-lime-400/60 shrink-0">
                            {line.match(/^\d+/)?.[0]}.
                          </span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: line
                                .replace(/^\d+\./, "")
                                .replace(
                                  /\*\*(.*?)\*\*/g,
                                  "<strong>$1</strong>",
                                )
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
                  })}
                </div>
              )}

              {!isLoading && !explanation && (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-12">
                  <div className="w-16 h-16 rounded-2xl border border-gray-800 flex items-center justify-center text-2xl bg-gray-950">
                    {EXPLANATION_MODES.find((m2) => m2.id === mode)?.icon}
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-code">
                      {EXPLANATION_MODES.find((m2) => m2.id === mode)?.desc}
                    </p>
                    <p className="text-gray-700 text-xs font-code mt-1">
                      Paste code on the left, then click explain
                    </p>
                  </div>

                  {/* Decorative grid */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-30">
                    <div
                      className="absolute bottom-0 right-0 w-32 h-32"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, #4b5563 1px, transparent 1px)",
                        backgroundSize: "16px 16px",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Output footer */}
            {explanation && !isLoading && (
              <div className="px-4 py-2.5 border-t border-gray-800 bg-gray-950 flex items-center justify-between">
                <span className="text-xs font-code text-gray-700">
                  {explanation.split(" ").length} words · gemini-2.0-flash
                </span>
                <button
                  onClick={() => setExplanation("")}
                  className="text-xs font-code text-gray-700 hover:text-red-400 transition-colors"
                >
                  clear ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-800 text-xs font-code mt-6 tracking-widest">
          CODE.EXPLAINER · POWERED BY GEMINI · FOR DEVELOPERS
        </p>
      </div>
    </div>
  );
};

export default Code;
