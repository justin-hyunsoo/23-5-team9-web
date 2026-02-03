import { cn } from '@/shared/lib/cn';

export interface SegmentedTab<T extends string = string> {
  id: T;
  label: string;
}

interface SegmentedTabBarProps<T extends string = string> {
  tabs: SegmentedTab<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
  className?: string;
}

export function SegmentedTabBar<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  className,
}: SegmentedTabBarProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex p-1 rounded-full bg-bg-box max-w-full',
        className
      )}
      role="tablist"
      aria-label="tabs"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'px-4 py-2 text-sm font-bold rounded-full transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
              isActive
                ? 'bg-primary text-text-inverse shadow-sm'
                : 'bg-transparent text-text-secondary hover:bg-bg-box-light'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
