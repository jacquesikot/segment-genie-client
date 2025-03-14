export const formatCurrency = (value: number, currency: string, unit: string) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let formattedValue = formatter.format(value);

  switch (unit) {
    case 'trillion':
      formattedValue += 'T';
      break;
    case 'billion':
      formattedValue += 'B';
      break;
    case 'million':
      formattedValue += 'M';
      break;
    case 'thousand':
      formattedValue += 'K';
      break;
  }

  return formattedValue;
};

export const getMaturityStyles = (maturity: string) => {
  switch (maturity) {
    case 'emerging':
      return {
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-100 dark:bg-emerald-950/30',
        icon: 'LineChart',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
      };
    case 'growing':
      return {
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-950/30',
        icon: 'TrendingUp',
        iconColor: 'text-blue-600 dark:text-blue-400',
      };
    case 'mature':
      return {
        color: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-100 dark:bg-amber-950/30',
        icon: 'BarChart4',
        iconColor: 'text-amber-600 dark:text-amber-400',
      };
    case 'declining':
      return {
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-950/30',
        icon: 'ArrowDownUp',
        iconColor: 'text-red-600 dark:text-red-400',
      };
    default:
      return {
        color: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        icon: 'Info',
        iconColor: 'text-gray-600 dark:text-gray-400',
      };
  }
};

export const getMarketTypeStyles = (type: 'tam' | 'sam' | 'som') => {
  switch (type) {
    case 'tam':
      return {
        icon: 'Target',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-100 dark:bg-blue-950/30',
        progressColor: 'bg-blue-600 dark:bg-blue-500',
        progressBgColor: 'bg-blue-100 dark:bg-blue-950/30',
      };
    case 'sam':
      return {
        icon: 'Users',
        color: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-100 dark:bg-purple-950/30',
        progressColor: 'bg-purple-600 dark:bg-purple-500',
        progressBgColor: 'bg-purple-100 dark:bg-purple-950/30',
      };
    case 'som':
      return {
        icon: 'UserCheck',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-100 dark:bg-green-950/30',
        progressColor: 'bg-green-600 dark:bg-green-500',
        progressBgColor: 'bg-green-100 dark:bg-green-950/30',
      };
  }
};
