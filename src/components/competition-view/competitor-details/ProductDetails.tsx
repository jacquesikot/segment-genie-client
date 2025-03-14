import React from 'react';
import { ProductDetailSection } from '../common/MetricItems';

interface ProductDetailsProps {
  productDetails: {
    mainProducts: string[];
    keyFeatures: string[];
    uniqueSellingPoints: string[];
    technologiesUsed: string[];
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productDetails }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 sm:p-4 rounded-lg">
      <h4 className="font-semibold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        Product Details
      </h4>
      <div className="text-xs sm:text-sm space-y-3 sm:space-y-4">
        <ProductDetailSection title="Main Products" items={productDetails.mainProducts} />
        <ProductDetailSection title="Key Features" items={productDetails.keyFeatures} />
        <ProductDetailSection title="USPs" items={productDetails.uniqueSellingPoints} />
        {productDetails.technologiesUsed.length > 0 && (
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Technologies:</span>{' '}
            <div className="flex flex-wrap gap-1 mt-1">
              {productDetails.technologiesUsed.map((tech: string, i: number) => (
                <span key={i} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
