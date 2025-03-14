import React from 'react';

export const CompanyProfileItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline">
    <span className="font-medium text-gray-700 dark:text-gray-300 w-full sm:w-20 text-xs sm:text-sm">{label}:</span>
    <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{value}</span>
  </div>
);

export const MarketPositionItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline">
    <span className="font-medium text-gray-700 dark:text-gray-300 w-full sm:w-28 text-xs sm:text-sm">{label}:</span>
    <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{value}</span>
  </div>
);

export const PricingItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline">
    <span className="font-medium text-gray-700 dark:text-gray-300 w-full sm:w-16 text-xs sm:text-sm">{label}:</span>
    <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{value}</span>
  </div>
);

export const ProductDetailSection = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <span className="font-medium text-gray-700 dark:text-gray-300 text-xs sm:text-sm">{title}:</span>
    <ul className="list-disc pl-4 mt-1 sm:mt-2 space-y-1">
      {items.map((item: string, i: number) => (
        <li key={i} className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          {item}
        </li>
      ))}
    </ul>
  </div>
);
