import { useState } from "react";
import axios from "axios";
import { EXPLANATION_MODES } from "../components/constants";
import { ModeSelector } from "../components/ModeSelector";
import { CodeInputPanel } from "../components/CodeInputPanel";
import { ExplainButton } from "../components/ExplainButton";
import { ExplanationPanel } from "../components/ExplanationPanel";

const CodeExplainer = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Auto Detect");
  const [mode, setMode] = useState("explain");
  const [explanation, setExplanation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedExplanation, setCopiedExplanation] = useState(false);

  const activeMode = EXPLANATION_MODES.find((m) => m.id === mode);

  const handleExplain = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    setExplanation("");
    try {
      const response = await axios.post(
        "http://localhost:9000/api/codeexplain",
        {
          code,
          mode,
          language:
            language === "Auto Detect" ? "javascript" : language.toLowerCase(),
        },
      );

      const data = response.data;

      if (data.explanation?.explanation) {
        setExplanation(data.explanation.explanation);
      } else if (typeof data.explanation === "string") {
        setExplanation(data.explanation);
      } else if (typeof data === "string") {
        setExplanation(data);
      } else {
        console.log("unexpected shape:", data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div
      className="min-h-screen bg-gray-950 text-gray-100 p-4 md:p-8"
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');
        .font-code { font-family: 'JetBrains Mono', monospace; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-fade-in { animation: fadeSlideIn 0.4s ease forwards; }
        .loading-dot:nth-child(1) { animation: pulse-dot 1.2s ease infinite 0s; }
        .loading-dot:nth-child(2) { animation: pulse-dot 1.2s ease infinite 0.2s; }
        .loading-dot:nth-child(3) { animation: pulse-dot 1.2s ease infinite 0.4s; }
        textarea::-webkit-scrollbar { width: 4px; }
        textarea::-webkit-scrollbar-track { background: transparent; }
        textarea::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }
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
              className="text-4xl md:text-5xl text-white tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
            >
              Code<span className="text-lime-400">.</span>Explainer
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-code">
              Paste code → understand everything
            </p>
          </div>
          <ModeSelector mode={mode} onModeChange={setMode} />
        </div>

        {/* Mobile mode selector is inside ModeSelector */}

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left panel */}
          <div className="flex flex-col">
            <CodeInputPanel
              code={code}
              language={language}
              copied={copied}
              onCodeChange={setCode}
              onLanguageChange={setLanguage}
              onCopy={handleCopyCode}
              onClear={() => setCode("")}
            />
            <ExplainButton
              isLoading={isLoading}
              disabled={!code.trim() || isLoading}
              activeMode={activeMode}
              onClick={handleExplain}
            />
          </div>

          {/* Right panel */}
          <ExplanationPanel
            mode={mode}
            explanation={explanation}
            isLoading={isLoading}
            copiedExplanation={copiedExplanation}
            onCopy={handleCopyExplanation}
            onClear={() => setExplanation("")}
          />
        </div>

        <p className="text-center text-gray-800 text-xs font-code mt-6 tracking-widest">
          CODE.EXPLAINER · POWERED BY GEMINI · FOR DEVELOPERS
        </p>
      </div>
    </div>
  );
};

export default CodeExplainer;
