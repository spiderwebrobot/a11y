import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  /** Accessible name for the tablist. */
  label: string;
  items: TabItem[];
  defaultSelectedId?: string;
  styles?: { tabs?: string; tablist?: string; tab?: string; panel?: string };
}

/**
 * WAI-ARIA APG Tabs pattern with automatic activation.
 * https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 *
 * - Only the selected tab is in the tab order (roving tabindex).
 * - Left/Right move between tabs and wrap; Home/End jump to first/last.
 * - The panel is focusable so keyboard users can reach content without
 *   focusable children.
 */
const Tabs = ({ label, items, defaultSelectedId, styles }: TabsProps) => {
  const baseId = useId();
  const [selectedId, setSelectedId] = useState(
    defaultSelectedId ?? items[0]?.id,
  );
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const select = (index: number) => {
    const item = items[(index + items.length) % items.length];
    setSelectedId(item.id);
    tabRefs.current.get(item.id)?.focus();
  };

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const keyToIndex: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: items.length - 1,
    };
    if (event.key in keyToIndex) {
      event.preventDefault();
      select(keyToIndex[event.key]);
    }
  };

  return (
    <div className={styles?.tabs}>
      <div role="tablist" aria-label={label} className={styles?.tablist}>
        {items.map((item, index) => {
          const selected = item.id === selectedId;
          return (
            <button
              key={item.id}
              ref={(el) => {
                if (el) tabRefs.current.set(item.id, el);
                else tabRefs.current.delete(item.id);
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              className={`button ${styles?.tab}`}
              onClick={() => setSelectedId(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          tabIndex={0}
          hidden={item.id !== selectedId}
          className={styles?.panel}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
