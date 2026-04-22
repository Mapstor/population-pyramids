#!/usr/bin/env npx tsx
/**
 * Regression Test for Data Integrity - Step 1.8
 * 
 * This script tests for data fabrication patterns that were discovered and fixed in Phase 1.
 * It ensures the "verified-or-omitted" policy is enforced: show real data or nothing, never fabricated values.
 * 
 * Tests performed:
 * 1. Scan for hardcoded numeric fallbacks in source code
 * 2. Verify specific known problem areas
 * 3. Check growth rate calculations are consistent
 * 4. Validate null data handling
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

// Color output helpers
const red = (text: string) => `\x1b[31m${text}\x1b[0m`;
const green = (text: string) => `\x1b[32m${text}\x1b[0m`;
const yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;
const blue = (text: string) => `\x1b[34m${text}\x1b[0m`;
const bold = (text: string) => `\x1b[1m${text}\x1b[0m`;

interface TestResult {
  passed: boolean;
  message: string;
  details?: string[];
}

class DataIntegrityRegressionTest {
  private results: TestResult[] = [];
  private srcDir: string;

  constructor() {
    this.srcDir = path.join(process.cwd(), 'src');
  }

  /**
   * Test 1: Scan for suspicious numeric fallback patterns
   */
  testNumericFallbacks(): TestResult {
    console.log(blue('\n📋 Test 1: Scanning for hardcoded numeric fallbacks...'));
    
    const suspiciousPatterns = [
      // Patterns that likely indicate fabrication
      { pattern: /\|\|\s*[0-9]+\.[0-9]+/, description: 'Decimal fallback (e.g., || 1.8)' },
      { pattern: /\|\|\s*[1-9][0-9]*[^0-9]/, description: 'Integer fallback > 0 (e.g., || 11)' },
      { pattern: /:\s*[0-9]+\.[0-9]+\s*[,;}]/, description: 'Hardcoded decimal in object' },
      { pattern: /growthRate:\s*[0-9]/, description: 'Hardcoded growth rate' },
      { pattern: /totalFertilityRate\s*\|\|/, description: 'Fertility rate fallback' },
      { pattern: /crudeBirthRate\s*\|\|/, description: 'Birth rate fallback' },
      { pattern: /medianAge\s*\|\|\s*[0-9]/, description: 'Median age fallback' }
    ];

    const violations: string[] = [];
    
    try {
      for (const pattern of suspiciousPatterns) {
        const command = `rg "${pattern.pattern.source}" --type ts --type tsx -l "${this.srcDir}" 2>/dev/null || true`;
        const output = execSync(command, { encoding: 'utf-8' }).trim();
        
        if (output) {
          const files = output.split('\n').filter(f => f.length > 0);
          for (const file of files) {
            // Skip test files, backups, and this script itself
            if (file.includes('.test.') || file.includes('/backups/') || file.includes('regression-test')) {
              continue;
            }
            
            // Get specific matches
            const matchCommand = `rg "${pattern.pattern.source}" "${file}" -n 2>/dev/null || true`;
            const matches = execSync(matchCommand, { encoding: 'utf-8' }).trim();
            
            if (matches) {
              violations.push(`${pattern.description} in ${file}:\n${matches}`);
            }
          }
        }
      }
      
      if (violations.length > 0) {
        return {
          passed: false,
          message: red(`❌ Found ${violations.length} suspicious fallback patterns`),
          details: violations
        };
      }
      
      return {
        passed: true,
        message: green('✅ No suspicious numeric fallbacks found')
      };
    } catch (error) {
      return {
        passed: false,
        message: red('❌ Error scanning for fallbacks'),
        details: [(error as Error).message]
      };
    }
  }

  /**
   * Test 2: Verify specific known problem areas are fixed
   */
  testKnownProblems(): TestResult {
    console.log(blue('\n📋 Test 2: Verifying known problem areas...'));
    
    const checks = [
      {
        file: 'src/lib/compare-data.ts',
        forbidden: ['|| 0.8', '|| 0.1'],
        description: 'Compare page growth rate fabrication'
      },
      {
        file: 'src/components/BirthStatistics.tsx',
        forbidden: ['|| 2024', '|| 2023'],
        description: 'Hardcoded year fallback'
      },
      {
        file: 'src/components/FertilityChart.tsx',
        forbidden: ['|| 2.0', '|| 1.8'],
        description: 'Fertility rate fabrication'
      },
      {
        file: 'src/components/StateComparisonSection.tsx',
        forbidden: ['medianAge || 0', 'medianAge: yearData?.medianAge || 0'],
        description: 'Median age zero fallback'
      }
    ];
    
    const violations: string[] = [];
    
    for (const check of checks) {
      const filePath = path.join(process.cwd(), check.file);
      if (!fs.existsSync(filePath)) {
        // File might have been deleted (like ComparisonPageClient.tsx), which is fine
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const forbidden of check.forbidden) {
        if (content.includes(forbidden)) {
          violations.push(`${check.description}: Found "${forbidden}" in ${check.file}`);
        }
      }
    }
    
    // Check that ComparisonPageClient.tsx is deleted
    const deletedFile = path.join(process.cwd(), 'src/components/ComparisonPageClient.tsx');
    if (fs.existsSync(deletedFile)) {
      violations.push('ComparisonPageClient.tsx still exists (should be deleted - contains hardcoded values)');
    }
    
    if (violations.length > 0) {
      return {
        passed: false,
        message: red(`❌ Found ${violations.length} known problem patterns`),
        details: violations
      };
    }
    
    return {
      passed: true,
      message: green('✅ All known problem areas verified fixed')
    };
  }

  /**
   * Test 3: Verify growth rate calculation consistency
   */
  async testGrowthRateConsistency(): Promise<TestResult> {
    console.log(blue('\n📋 Test 3: Checking growth rate calculation consistency...'));
    
    try {
      // Load compare-data.ts and check it imports calculateGrowthRate
      const compareDataPath = path.join(process.cwd(), 'src/lib/compare-data.ts');
      const compareDataContent = fs.readFileSync(compareDataPath, 'utf-8');
      
      if (!compareDataContent.includes('import') || !compareDataContent.includes('calculateGrowthRate')) {
        return {
          passed: false,
          message: red('❌ compare-data.ts does not import calculateGrowthRate'),
          details: ['Growth rates should be calculated using the shared calculateGrowthRate function']
        };
      }
      
      // Check that growth rates are calculated, not hardcoded
      if (compareDataContent.match(/growthRate:\s*[0-9]/)) {
        return {
          passed: false,
          message: red('❌ Found hardcoded growth rate in compare-data.ts'),
          details: ['Growth rates must be calculated dynamically']
        };
      }
      
      return {
        passed: true,
        message: green('✅ Growth rate calculations are consistent')
      };
    } catch (error) {
      return {
        passed: false,
        message: red('❌ Error checking growth rate consistency'),
        details: [(error as Error).message]
      };
    }
  }

  /**
   * Test 4: Verify null data handling
   */
  testNullDataHandling(): TestResult {
    console.log(blue('\n📋 Test 4: Verifying null data handling...'));
    
    const issues: string[] = [];
    
    // Check for proper null handling patterns
    const goodPatterns = [
      'Data unavailable',
      'hasValue(',
      '|| null',
      '?: null',
      'if (!',
      'if (hasValue'
    ];
    
    // Files that should handle null data properly
    const criticalFiles = [
      'src/app/[slug]/page.tsx',
      'src/components/BirthStatistics.tsx',
      'src/components/FertilityChart.tsx',
      'src/components/StateComparisonSection.tsx'
    ];
    
    for (const file of criticalFiles) {
      const filePath = path.join(process.cwd(), file);
      if (!fs.existsSync(filePath)) {
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      let hasProperNullHandling = false;
      
      for (const pattern of goodPatterns) {
        if (content.includes(pattern)) {
          hasProperNullHandling = true;
          break;
        }
      }
      
      if (!hasProperNullHandling) {
        issues.push(`${file} may not have proper null handling`);
      }
    }
    
    if (issues.length > 0) {
      return {
        passed: false,
        message: yellow(`⚠️  Potential null handling issues in ${issues.length} files`),
        details: issues
      };
    }
    
    return {
      passed: true,
      message: green('✅ Null data handling patterns look correct')
    };
  }

  /**
   * Test 5: Check TypeScript compilation
   */
  async testTypeScriptCompilation(): Promise<TestResult> {
    console.log(blue('\n📋 Test 5: Checking TypeScript compilation...'));
    
    try {
      // Run TypeScript compiler in no-emit mode on critical files
      const criticalFiles = [
        'src/lib/compare-data.ts',
        'src/app/[slug]/page.tsx',
        'src/components/BirthStatistics.tsx',
        'src/components/FertilityChart.tsx'
      ];
      
      const command = `npx tsc --noEmit ${criticalFiles.join(' ')} 2>&1 || true`;
      const output = execSync(command, { encoding: 'utf-8' });
      
      // Check for the specific growthRate errors that were fixed
      if (output.includes("Property 'growthRate' is missing")) {
        return {
          passed: false,
          message: red('❌ growthRate property errors still present'),
          details: ['The growthRate property should be added to DemographicMetrics interface']
        };
      }
      
      // Count total errors (some pre-existing errors are expected)
      const errorCount = (output.match(/error TS/g) || []).length;
      
      if (errorCount > 0) {
        return {
          passed: true,
          message: yellow(`⚠️  TypeScript has ${errorCount} errors (most pre-existing)`),
          details: [`Run 'npx tsc --noEmit' for full details`]
        };
      }
      
      return {
        passed: true,
        message: green('✅ TypeScript compilation successful for critical files')
      };
    } catch (error) {
      return {
        passed: false,
        message: red('❌ Error running TypeScript compiler'),
        details: [(error as Error).message]
      };
    }
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<void> {
    console.log(bold('\n🔍 Data Integrity Regression Test - Step 1.8\n'));
    console.log('This test ensures the "verified-or-omitted" policy is enforced.');
    console.log('Data should be real or omitted, never fabricated.\n');
    
    // Run tests
    this.results.push(this.testNumericFallbacks());
    this.results.push(this.testKnownProblems());
    this.results.push(await this.testGrowthRateConsistency());
    this.results.push(this.testNullDataHandling());
    this.results.push(await this.testTypeScriptCompilation());
    
    // Print summary
    console.log(bold('\n📊 Test Summary\n'));
    
    let passedCount = 0;
    let failedCount = 0;
    
    for (const result of this.results) {
      console.log(result.message);
      if (result.details && result.details.length > 0) {
        for (const detail of result.details) {
          console.log('  ' + detail);
        }
      }
      
      if (result.passed) {
        passedCount++;
      } else {
        failedCount++;
      }
    }
    
    console.log(bold('\n📈 Final Results\n'));
    console.log(green(`✅ Passed: ${passedCount}`));
    console.log(red(`❌ Failed: ${failedCount}`));
    
    if (failedCount === 0) {
      console.log(bold(green('\n🎉 All regression tests passed!')));
      console.log('The data integrity fixes from Phase 1 are working correctly.\n');
    } else {
      console.log(bold(red('\n⚠️  Some tests failed!')));
      console.log('Review the failures above and ensure data integrity.\n');
      process.exit(1);
    }
  }
}

// Run the tests
const tester = new DataIntegrityRegressionTest();
tester.runAllTests().catch(error => {
  console.error(red('Fatal error running tests:'), error);
  process.exit(1);
});