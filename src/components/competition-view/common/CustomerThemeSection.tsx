import React from 'react';

interface CustomerThemeSectionProps {
  title: string;
  items: string[];
  type: 'positive' | 'negative';
}

const CustomerThemeSection: React.FC<CustomerThemeSectionProps> = ({ title, items, type }) => (
  <div
    className={`p-2 sm:p-3 rounded-lg ${
      type === 'positive'
        ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30'
        : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30'
    }`}
  >
    <span
      className={`font-medium text-xs sm:text-sm ${
        type === 'positive' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
      }`}
    >
      {title}:
    </span>
    <ul className="list-disc pl-4 mt-1 sm:mt-2 space-y-1">
      {items.map((theme: string, i: number) => (
        <li
          key={i}
          className={`text-xs sm:text-sm ${
            type === 'positive' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
          }`}
        >
          {theme}
        </li>
      ))}
    </ul>
  </div>
);

export default CustomerThemeSection;
