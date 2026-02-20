import { CSSProperties, FormEvent, useEffect, useMemo, useRef } from 'react';
import { Bot, Search, Send, Maximize2, Minimize2, X } from 'lucide-react';

type AdvisorMessage = { id: string; role: 'assistant' | 'user'; text: string };

interface DiscoverSearchAssistantProps {
  queryInput: string;
  onQueryInputChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  quickChips: string[];
  onQuickChipPress: (value: string) => void;
  starterChip: string;
  onStarterChipPress: () => void;
  advisorActive: boolean;
  advisorCollapsed: boolean;
  onToggleAdvisorCollapse: () => void;
  advisorMessages: AdvisorMessage[];
  contextualChips: string[];
  onContextChipPress: (value: string) => void;
  scenarioChips: string[];
  onScenarioChipPress: (value: string) => void;
  advisorFullscreen: boolean;
  onToggleAdvisorFullscreen: () => void;
  onCloseAdvisor: () => void;
}

export function DiscoverSearchAssistant({
  queryInput,
  onQueryInputChange,
  onSubmit,
  quickChips,
  onQuickChipPress,
  starterChip,
  onStarterChipPress,
  advisorActive,
  advisorCollapsed,
  onToggleAdvisorCollapse,
  advisorMessages,
  contextualChips,
  onContextChipPress,
  scenarioChips,
  onScenarioChipPress,
  advisorFullscreen,
  onToggleAdvisorFullscreen,
  onCloseAdvisor,
}: DiscoverSearchAssistantProps) {
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);
  const compactQuickChips = useMemo(() => {
    const unique = Array.from(new Set(quickChips.filter(Boolean)));
    return unique.slice(0, 2);
  }, [quickChips]);

  const compactScenarioChip = useMemo(() => scenarioChips.find(Boolean) ?? '', [scenarioChips]);

  useEffect(() => {
    if (!advisorActive || advisorCollapsed) return;
    const node = messagesScrollRef.current;
    if (!node) return;
    // Keep newest message visible at the bottom in both compact and fullscreen modes.
    node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [advisorActive, advisorCollapsed, advisorFullscreen, advisorMessages]);

  const advisorBody = (
    <>
      <div className="mb-1.5 flex items-center justify-between">
        <button
          onClick={onToggleAdvisorCollapse}
          className="text-[11px] font-medium text-zinc-600 transition-colors duration-200 hover:text-zinc-800 ui-pressable ui-focus-ring"
        >
          {advisorCollapsed ? 'باز کردن مشاوره' : 'بستن مشاوره'}
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleAdvisorFullscreen}
            className="w-7 h-7 rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors duration-200 flex items-center justify-center ui-pressable ui-focus-ring"
            aria-label={advisorFullscreen ? 'Exit fullscreen advisor' : 'Open fullscreen advisor'}
          >
            {advisorFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onCloseAdvisor}
            className="w-7 h-7 rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors duration-200 flex items-center justify-center ui-pressable ui-focus-ring"
            aria-label="Close advisor"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!advisorCollapsed && (
        <>
          <div
            ref={messagesScrollRef}
            className={`space-y-2 overflow-y-auto px-0.5 ${advisorFullscreen ? 'max-h-[70vh]' : 'max-h-44'}`}
          >
            {advisorMessages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[86%] rounded-2xl px-3 py-2 text-xs leading-5 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-zinc-900 to-black text-white'
                      : 'bg-gradient-to-r from-zinc-100 to-white text-zinc-800 border border-zinc-200'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>
          {contextualChips.length > 0 && (
            <div className="mt-2 flex gap-1.5 overflow-x-auto no-scrollbar">
              {contextualChips.map((item) => (
                <button
                  key={item}
                  onClick={() => onContextChipPress(item)}
                  className="shrink-0 rounded-full bg-zinc-100/90 border border-zinc-200/70 px-2.5 py-1 text-[11px] font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-200/80 ui-pressable ui-focus-ring"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      <div className="sticky top-0 z-20 bg-zinc-50/95 backdrop-blur-lg">
        <div
          className="px-3 pt-12 pb-2"
          style={
            {
              '--discover-search-bg': 'var(--discover-surface, rgba(255,255,255,0.96))',
              '--discover-search-shadow': '0 10px 24px rgba(15,23,42,0.08)',
              '--discover-search-shadow-focus': '0 14px 30px rgba(15,23,42,0.15)',
            } as CSSProperties
          }
        >
          <form
            onSubmit={onSubmit}
            // Premium AI-entry treatment: single calm surface with soft elevation and no harsh field borders.
            className="group w-full h-11 rounded-2xl border border-zinc-200/55 flex items-center gap-2 px-2.5 text-left shadow-[var(--discover-search-shadow)] bg-[var(--discover-search-bg)] transition-all duration-200 focus-within:shadow-[var(--discover-search-shadow-focus)] focus-within:-translate-y-[1px] ui-focus-ring"
          >
            <span className="w-6.5 h-6.5 rounded-full bg-zinc-100/85 text-zinc-500 flex items-center justify-center transition-colors duration-200 group-focus-within:bg-zinc-200/70 group-focus-within:text-zinc-700">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              value={queryInput}
              onChange={(e) => onQueryInputChange(e.target.value)}
              placeholder="Search or ask for suggestions"
              className="flex-1 bg-transparent text-[13px] font-medium tracking-[0.01em] text-zinc-800 outline-none placeholder:text-zinc-400/90 placeholder:font-normal"
            />
            <button
              type="button"
              onClick={onStarterChipPress}
              className="w-7 h-7 rounded-full border border-zinc-200/80 bg-white text-zinc-600 flex items-center justify-center transition-all duration-200 hover:text-zinc-900 hover:border-zinc-300 group-focus-within:bg-zinc-50 ui-pressable ui-focus-ring"
              aria-label="Open assistant"
            >
              <Bot className="w-3.5 h-3.5" />
            </button>
            <button
              type="submit"
              className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center transition-all duration-200 hover:bg-black ui-pressable ui-focus-ring"
              aria-label="Submit search"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-2 grid grid-cols-3 gap-1.5">
            <button
              onClick={onStarterChipPress}
              className="min-w-0 rounded-xl px-2.5 py-1.5 text-[11px] font-medium text-zinc-800 border border-sky-200/75 bg-gradient-to-r from-sky-100/90 to-emerald-100/90 transition-all duration-200 hover:from-sky-100 hover:to-emerald-100 ui-pressable ui-focus-ring"
            >
              <span className="block truncate">{starterChip}</span>
            </button>
            {compactQuickChips.map((chip) => (
              <button
                key={chip}
                onClick={() => onQuickChipPress(chip)}
                className="min-w-0 rounded-xl bg-white/95 border border-zinc-200/80 px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 transition-all duration-200 hover:bg-zinc-100/80 ui-pressable ui-focus-ring"
              >
                <span className="block truncate">{chip}</span>
              </button>
            ))}
            {compactQuickChips.length < 2 && compactScenarioChip ? (
              <button
                onClick={() => onScenarioChipPress(compactScenarioChip)}
                className="min-w-0 rounded-xl bg-white/95 border border-emerald-200/80 px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 transition-all duration-200 hover:bg-emerald-50/70 ui-pressable ui-focus-ring"
              >
                <span className="block truncate">{compactScenarioChip}</span>
              </button>
            ) : null}
          </div>

          {advisorActive && !advisorFullscreen && (
            <div className="mt-2 rounded-xl border border-zinc-200/80 bg-white/95 p-2.5 shadow-[0_8px_20px_rgba(15,23,42,0.06)] ui-surface">
              {advisorBody}
            </div>
          )}
        </div>
      </div>

      {advisorActive && advisorFullscreen && (
        <div className="fixed inset-0 z-[80] bg-gradient-to-b from-zinc-50 to-white">
          <div className="max-w-[414px] mx-auto h-full px-3 pt-12 pb-3 flex flex-col">
            <div className="rounded-2xl border border-zinc-200 bg-white/92 backdrop-blur-md p-3 shadow-[0_20px_45px_rgba(0,0,0,0.12)] flex-1">
              {advisorBody}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
