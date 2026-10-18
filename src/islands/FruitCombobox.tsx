import { useState } from "react";
import Combobox from "../components/Combobox";
import styles from "./FruitCombobox.module.css";

const FRUITS = [
  "Apple",
  "Apricot",
  "Banana",
  "Blackberry",
  "Blueberry",
  "Cherry",
  "Grape",
  "Mango",
  "Orange",
  "Peach",
  "Pear",
];

/**
 * Builds the tab items client-side so JSX content doesn't have to be
 * serialized across the Astro island boundary.
 */
const FruitCombobox = () => {
  const [fruit, setFruit] = useState<string | null>(null);
  return (
    <section className="inline-bumper" aria-labelledby="combobox-heading">
      <header className="container">
        <h2 id="combobox-heading">Combobox</h2>
      </header>
      <div className="container">
        <Combobox
          label="Favorite fruit"
          options={FRUITS}
          onSelect={setFruit}
          styles={styles}
        />
        <p data-testid="combobox-result">
          {fruit ? `You picked ${fruit}.` : "Nothing picked yet."}
        </p>
      </div>
    </section>
  );
};

export default FruitCombobox;
