"use client";

import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
  type KeyboardEvent,
} from "react";

// ─── Types ───────────────────────────────────────────────
type TabsContextValue = {
  activeTab: string;
  onTabChange: (value: string) => void;
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error(`<${component} /> doit être utilisé à l'intérieur de <Tabs />`);
  }
  return ctx;
}

// ─── Props ───────────────────────────────────────────────
type TabsProps = {
  children: ReactNode;
  defaultValue: string;
  baseId?: string;
  className?: string;
  /** Contrôlé : valeur active */
  value?: string;
  onValueChange?: (value: string) => void;
};

type TabsListProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};

type TabsTriggerProps = {
  children: ReactNode;
  value: string;
  className?: string;
  disabled?: boolean;
};

type TabsContentProps = {
  children: ReactNode;
  value: string;
  className?: string;
  forceMount?: boolean;
};

// ─── Tabs Root ───────────────────────────────────────────
export function Tabs({
  children,
  defaultValue,
  baseId,
  className = "",
  value: controlledValue,
  onValueChange,
}: TabsProps) {
  const activeTab = controlledValue ?? defaultValue;

  const handleTabChange = useCallback(
    (tab: string) => {
      onValueChange?.(tab);
    },
    [onValueChange]
  );

  const ctx: TabsContextValue = {
    activeTab,
    onTabChange: handleTabChange,
    baseId: baseId ?? "tabs",
  };

  return (
    <TabsContext.Provider value={ctx}>
      <div className={className} data-tabs-root="">
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ─── Tabs List ───────────────────────────────────────────
export function TabsList({
  children,
  className = "",
  label = "Navigation par onglets",
}: TabsListProps) {
  const { activeTab, onTabChange, baseId } = useTabsContext("TabsList");

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const buttons = Array.from(
      e.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([disabled])'
      )
    );
    const currentIndex = buttons.findIndex(
      (btn) => btn.getAttribute("data-value") === activeTab
    );
    let nextIndex: number | null = null;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        nextIndex = (currentIndex + 1) % buttons.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = buttons.length - 1;
        break;
    }

    if (nextIndex !== null && buttons[nextIndex]) {
      buttons[nextIndex]?.click();
      buttons[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={`flex flex-wrap gap-1 ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Tabs Trigger ────────────────────────────────────────
export function TabsTrigger({
  children,
  value,
  className = "",
  disabled = false,
}: TabsTriggerProps) {
  const { activeTab, onTabChange, baseId } = useTabsContext("TabsTrigger");
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      id={`${baseId}-trigger-${value}`}
      data-value={value}
      aria-selected={isActive}
      aria-controls={`${baseId}-content-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={() => onTabChange(value)}
      className={`
        inline-flex items-center justify-center
        min-h-11 px-4 py-2.5
        text-sm font-medium
        rounded-xl
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
        disabled:opacity-50 disabled:pointer-events-none
        ${isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "bg-surface text-muted hover:bg-sidebar-hover hover:text-foreground border border-border"
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// ─── Tabs Content ────────────────────────────────────────
export function TabsContent({
  children,
  value,
  className = "",
  forceMount = false,
}: TabsContentProps) {
  const { activeTab, baseId } = useTabsContext("TabsContent");
  const isActive = activeTab === value;

  if (!isActive && !forceMount) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-content-${value}`}
      aria-labelledby={`${baseId}-trigger-${value}`}
      hidden={!isActive}
      className={`
        ${isActive ? "animate-in fade-in duration-200" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}