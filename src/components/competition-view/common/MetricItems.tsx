// export const CompanyProfileItem = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex flex-col sm:flex-row sm:items-baseline">
//     <span className="font-medium text-gray-700 dark:text-gray-300 w-full sm:w-20 text-xs sm:text-sm">{label}:</span>
//     <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">{value}</span>
//   </div>
// );

export const CompanyProfileItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline py-1 px-2 rounded-md transition-colors">
    <span className="font-medium text-gray-700 dark:text-gray-300 w-full sm:w-20 text-xs sm:text-sm mb-1 sm:mb-0">
      {label}:
    </span>
    <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm pl-1 sm:pl-2 flex-1">{value}</span>
  </div>
);

// ... existing code ...

export const MarketPositionItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline py-1 px-2 rounded-md transition-colors">
    <span className="font-medium text-gray-700 dark:text-gray-300 w-full sm:w-28 text-xs sm:text-sm mb-1 sm:mb-0">
      {label}:
    </span>
    <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm pl-1 sm:pl-2 flex-1">{value}</span>
  </div>
);

export const PricingItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-baseline py-1 px-2 rounded-md transition-colors">
    <span className="font-medium text-gray-700 dark:text-gray-300 w-full sm:w-16 text-xs sm:text-sm mb-1 sm:mb-0">
      {label}:
    </span>
    <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm pl-1 sm:pl-2 flex-1">{value}</span>
  </div>
);

export const ProductDetailSection = ({ title, items }: { title: string; items: string[] }) => (
  <div className="py-1 px-2 rounded-md transition-colors">
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
