import Tabs, { type TabItem } from "./Tabs";
import styles from "./Tabs.module.css";

const items: TabItem[] = [
  { id: "profile", label: "Profile", content: <p>A profile view</p> },
  { id: "security", label: "Security", content: <p>Security settings</p> },
  { id: "billing", label: "Billing", content: <p>Billing information</p> },
];

/**
 * Builds the tab items client-side so JSX content doesn't have to be
 * serialized across the Astro island boundary.
 */
const AccountTabs = () => {
  return (
    <section className="inline-bumper">
      <header className="container">
        <h2 id="tabs-heading">Tabs</h2>
      </header>
      <div className="container">
        <Tabs label="Account settings" items={items} styles={styles} />
      </div>
    </section>
  );
};

export default AccountTabs;
