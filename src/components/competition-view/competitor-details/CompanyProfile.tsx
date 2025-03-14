import React from 'react';
import { CompanyProfileItem } from '../common/MetricItems';

interface CompanyProfileProps {
  companyProfile: any;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ companyProfile }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
      <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        Company Profile
      </h4>
      <div className="text-xs sm:text-sm space-y-2 sm:space-y-3">
        <CompanyProfileItem label="Founded" value={companyProfile.foundedYear || 'N/A'} />
        <CompanyProfileItem label="HQ" value={companyProfile.headquartersLocation || 'Not specified'} />
        <CompanyProfileItem label="Employees" value={companyProfile.employeeCount || 'Not specified'} />
        <CompanyProfileItem
          label="Funding"
          value={`${companyProfile.fundingStatus || 'Not available'} (${companyProfile.lastFundingAmount || 'N/A'})`}
        />
        {companyProfile.keyExecutives.length > 0 && (
          <CompanyProfileItem label="Key Executives" value={companyProfile.keyExecutives.join(', ')} />
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
