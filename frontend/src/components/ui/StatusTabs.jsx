import React from 'react';
import Tabs from './Tabs.jsx';

const DEFAULT_STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Hidden', value: 'HIDDEN' },
  { label: 'Archived', value: 'ARCHIVED' },
];

/**
 * Reusable StatusTabs component
 */
export default function StatusTabs({ activeValue, onChange, tabs = DEFAULT_STATUS_TABS }) {
  return (
    <Tabs
      activeValue={activeValue}
      onChange={onChange}
      tabs={tabs}
    />
  );
}
