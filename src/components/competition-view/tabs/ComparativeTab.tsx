import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ComparativeTabProps {
  comparativeAnalysis: any;
}

const ComparativeTab: React.FC<ComparativeTabProps> = ({ comparativeAnalysis }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl">Feature Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {/* Mobile view (card-based layout) */}
            <div className="md:hidden space-y-4">
              {comparativeAnalysis.featureComparison.map((feature: any, idx: number) => (
                <div key={idx} className="border rounded-lg p-3 shadow-sm bg-white dark:bg-gray-950">
                  <div className="flex flex-col mb-2">
                    <h4 className="font-semibold text-sm">{feature.feature}</h4>
                    <h4 className="text-xs mt-1">{feature.importance}</h4>
                  </div>
                  <div className="space-y-2 mt-3">
                    {feature.competitors.map((comp: any, i: number) => (
                      <div key={i} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded-md">
                        <div className="flex flex-col">
                          <span className="font-medium text-xs">{comp.name}</span>
                          <span className="text-xs italic mt-1">{comp.implementation}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{comp.notes}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view (table layout) */}
            <table className="w-full text-xs sm:text-sm hidden md:table">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Feature</th>
                  <th className="p-2 text-left">Importance</th>
                  <th className="p-2 text-left">Competitors</th>
                </tr>
              </thead>
              <tbody>
                {comparativeAnalysis.featureComparison.map((feature: any, idx: number) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{feature.feature}</td>
                    <td className="p-2">{feature.importance}</td>
                    <td className="p-2">
                      {feature.competitors.map((comp: any, i: number) => (
                        <div key={i}>
                          <strong>{comp.name}</strong>: {comp.implementation} ({comp.notes})
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg sm:text-xl">Opportunity Spaces</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple">
            {comparativeAnalysis.opportunitySpaces.map((space: any, idx: number) => (
              <AccordionItem key={idx} value={`space-${idx}`}>
                <AccordionTrigger className="text-sm sm:text-base">{space.description}</AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm mt-2">
                  <p>Potential Size: {space.potentialSize}</p>
                  <p>Entry Difficulty: {space.entryDifficulty}</p>
                  <p>Time to Market: {space.timeToMarket}</p>
                  <ul className="list-disc pl-4">
                    {space.unservedNeeds.map((need: string, i: number) => (
                      <li key={i}>{need}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparativeTab;
