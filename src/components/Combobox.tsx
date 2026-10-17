import { useEffect, useId, useMemo, useState, type KeyboardEvent } from "react";

interface ComboboxProps {
  label: string;
  options: string[];
  onSelect?: (value: string) => void;
  styles?: {
    combobox?: string;
    field?: string;
    listbox?: string;
    option?: string;
  };
}

/**
 * Editable combobox with list autocomplete (ARIA 1.2).
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/
 *
 * DOM focus never leaves the input. The "current" option is communicated with
 * aria-activedescendant, so screen readers announce it while the user keeps
 * typing.
 *
 * Keys: ArrowDown/ArrowUp open and move, Enter selects, Escape closes (or
 * clears if already closed), Alt+ArrowDown opens without moving.
 */
const Combobox = ({ label, options, onSelect, styles }: ComboboxProps) => {
  const id = useId();
  const listboxId = `${id}-listbox`;
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const filtered = useMemo(
    () =>
      options.filter((option) =>
        option.toLowerCase().includes(value.trim().toLowerCase()),
      ),
    [options, value],
  );
  const expanded = open && filtered.length > 0;
  const optionId = (index: number) => `${id}-option-${index}`;

  // Focus stays in the input, so the browser won't scroll the active option
  // into view for us.
  useEffect(() => {
    if (activeIndex >= 0)
      document
        .getElementById(optionId(activeIndex))
        ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const commit = (option: string) => {
    setValue(option);
    setOpen(false);
    setActiveIndex(-1);
    onSelect?.(option);
  };

  const move = (delta: number) => {
    if (!open) setOpen(true);
    if (filtered.length === 0) return;
    setActiveIndex((current) => {
      if (current === -1) return delta > 0 ? 0 : filtered.length - 1;
      return (current + delta + filtered.length) % filtered.length;
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (event.altKey) setOpen(true);
        else move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "Enter":
        if (expanded && activeIndex >= 0) {
          event.preventDefault();
          commit(filtered[activeIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        if (expanded) {
          setOpen(false);
          setActiveIndex(-1);
        } else {
          setValue("");
        }
        break;
    }
  };

  return (
    <div className={styles?.combobox}>
      <label htmlFor={`${id}-input`}>{label}</label>
      <div className={styles?.field}>
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listboxId}
          aria-activedescendant={
            expanded && activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          autoComplete="off"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={onKeyDown}
          onBlur={() => setOpen(false)}
        />
      </div>
      <ul
        id={listboxId}
        role="listbox"
        aria-label={label}
        className={styles?.listbox}
        hidden={!expanded}
      >
        {filtered.map((option, index) => (
          <li
            key={option}
            id={optionId(index)}
            role="option"
            aria-selected={index === activeIndex}
            className={styles?.option}
            // mousedown fires before the input's blur; preventing it keeps
            // the listbox open long enough for the click to land.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => commit(option)}
          >
            {option}
          </li>
        ))}
      </ul>
      <div role="status" className="visually-hidden">
        {open && value
          ? `${filtered.length} result${filtered.length === 1 ? "" : "s"} available.`
          : ""}
      </div>
    </div>
  );
};

export default Combobox;
