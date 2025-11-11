// Fix data issues with elderly age groups in state data
export function cleanStateYearData(yearData: any) {
  // Check if we have the data issue (90-94 and 95-99 are 0, but 100+ has data)
  const has90to94 = yearData.ageGroups.find((ag: any) => ag.ageRange === '90-94');
  const has95to99 = yearData.ageGroups.find((ag: any) => ag.ageRange === '95-99');
  const has100plus = yearData.ageGroups.find((ag: any) => ag.ageRange === '100+');
  const has85to89 = yearData.ageGroups.find((ag: any) => ag.ageRange === '85-89');
  
  if (has90to94 && has95to99 && has100plus && has85to89) {
    // If 90-94 and 95-99 are 0 but 100+ has the same data as 85-89, we have the issue
    if (has90to94.total === 0 && has95to99.total === 0 && 
        has100plus.total === has85to89.total) {
      
      // Fix: Combine 85-89 and 100+ into a single "85+" group
      // Remove the incorrect 90-94, 95-99, and 100+ entries
      const cleanedAgeGroups = yearData.ageGroups.filter((ag: any) => 
        ag.ageRange !== '90-94' && 
        ag.ageRange !== '95-99' && 
        ag.ageRange !== '100+'
      ).map((ag: any) => {
        if (ag.ageRange === '85-89') {
          // Rename to 85+ and keep the data
          return {
            ...ag,
            ageRange: '85+'
          };
        }
        return ag;
      });
      
      return {
        ...yearData,
        ageGroups: cleanedAgeGroups
      };
    }
  }
  
  // If no issue found, return data as is
  return yearData;
}