import Tabs, { type TabItem } from "./Tabs";

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
  return <Tabs label="Account settings" items={items} />;
};

export default AccountTabs;
