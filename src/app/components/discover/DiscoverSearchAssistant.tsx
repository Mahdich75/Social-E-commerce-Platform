import { CSSProperties, FormEvent } from 'react';
import { Bot, Search, Send } from 'lucide-react';

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
}: DiscoverSearchAssistantProps) {
  return (
    <div className="sticky top-0 z-20 bg-zinc-50/95 backdrop-blur-lg">
      <div
        className="px-3 pt-12 pb-2"
        style={
          {
            '--discover-search-bg': 'var(--discover-surface, rgba(255,255,255,0.92))',
            '--discover-search-shadow': 'var(--discover-shadow-soft, 0 6px 18px rgba(0,0,0,0.08))',
          } as CSSProperties
        }
      >
        <form
          onSubmit={onSubmit}
          className="w-full h-11 rounded-2xl border border-zinc-200 flex items-center gap-2 px-3 text-left shadow-[var(--discover-search-shadow)] bg-[var(--discover-search-bg)] ui-focus-ring"
        >
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            value={queryInput}
            onChange={(e) => onQueryInputChange(e.target.value)}
            placeholder="Search or ask for suggestions"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
          />
          <button
            type="button"
            onClick={onStarterChipPress}
            className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center ui-pressable ui-focus-ring"
            aria-label="Open assistant"
          >
            <Bot className="w-3.5 h-3.5" />
          </button>
          <button
            type="submit"
            className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center ui-pressable ui-focus-ring"
            aria-label="Submit search"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <button
          onClick={onStarterChipPress}
          className="mt-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-zinc-800 border border-sky-200 bg-gradient-to-r from-sky-100 to-emerald-100 ui-pressable ui-focus-ring"
        >
          {starterChip}
        </button>

        <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickChips.map((chip) => (
            <button
              key={chip}
              onClick={() => onQuickChipPress(chip)}
              className="shrink-0 rounded-full bg-white border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 ui-pressable ui-focus-ring"
            >
              {chip}
            </button>
          ))}
        </div>

        {advisorActive && (
          <div className="mt-2 rounded-xl border border-zinc-200 bg-white p-2.5 ui-surface">
            <button
              onClick={onToggleAdvisorCollapse}
              className="mb-2 text-[11px] font-semibold text-zinc-600 ui-pressable ui-focus-ring"
            >
              {advisorCollapsed ? 'باز کردن مشاوره' : 'بستن مشاوره'}
            </button>

            {!advisorCollapsed && (
              <>
                <div className="space-y-2 max-h-44 overflow-y-auto px-0.5">
                  {advisorMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <p
                        className={`max-w-[86%] rounded-xl px-2.5 py-1.5 text-xs leading-5 ${
                          message.role === 'user' ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-800'
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
                        className="shrink-0 rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 ui-pressable ui-focus-ring"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

