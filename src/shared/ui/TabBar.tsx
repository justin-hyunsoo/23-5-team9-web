import { Button } from './Button';

export interface Tab<T extends string = string> {
  id: T;
  label: string;
}

interface TabBarProps<T extends string = string> {
  tabs: Tab<T>[];
  activeTab: T;
  onTabChange: (tabId: T) => void;
}

export function TabBar<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
}: TabBarProps<T>) {
  return (
    <div className="flex gap-2 mb-[30px] border-b border-border-base pb-0">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          variant="ghost"
          className={`
            border-b-2 rounded-none
            ${activeTab === tab.id
              ? 'border-primary text-text-heading font-bold'
              : 'border-transparent text-text-secondary font-normal hover:text-text-heading'
            }
          `}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
