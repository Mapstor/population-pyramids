#!/usr/bin/env python3
"""
Comprehensive US State Demographics Analysis
Analyzes population data from 2000-2024 to find interesting patterns and extremes
"""

import json
import os
import statistics
from typing import Dict, List, Tuple, Any
from dataclasses import dataclass
from pathlib import Path

@dataclass
class StateMetrics:
    state_code: str
    state_name: str
    region: str
    pop_2000: int
    pop_2024: int
    growth_rate: float
    growth_absolute: int
    median_age_2000: int
    median_age_2024: int
    age_change: int
    gender_ratio_2000: float  # males per 100 females
    gender_ratio_2024: float
    
class DemographicAnalyzer:
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.states_data = {}
        self.metrics = []
        
    def load_all_states(self):
        """Load data from all state JSON files"""
        for json_file in self.data_dir.glob("*.json"):
            state_slug = json_file.stem
            try:
                with open(json_file, 'r') as f:
                    data = json.load(f)
                    self.states_data[state_slug] = data
                    print(f"Loaded {data.get('stateName', state_slug)}")
            except Exception as e:
                print(f"Error loading {json_file}: {e}")
    
    def calculate_metrics(self):
        """Calculate key metrics for all states"""
        for slug, data in self.states_data.items():
            try:
                years_data = data.get('years', {})
                if '2000' not in years_data or '2024' not in years_data:
                    print(f"Missing 2000 or 2024 data for {data.get('stateName', slug)}")
                    continue
                
                data_2000 = years_data['2000']
                data_2024 = years_data['2024']
                
                pop_2000 = data_2000['totalPopulation']
                pop_2024 = data_2024['totalPopulation']
                growth_absolute = pop_2024 - pop_2000
                growth_rate = (growth_absolute / pop_2000) * 100
                
                # Gender ratios (males per 100 females)
                gender_ratio_2000 = (data_2000['malePopulation'] / data_2000['femalePopulation']) * 100
                gender_ratio_2024 = (data_2024['malePopulation'] / data_2024['femalePopulation']) * 100
                
                metrics = StateMetrics(
                    state_code=data['stateCode'],
                    state_name=data['stateName'],
                    region=data.get('region', 'Unknown'),
                    pop_2000=pop_2000,
                    pop_2024=pop_2024,
                    growth_rate=growth_rate,
                    growth_absolute=growth_absolute,
                    median_age_2000=data_2000['medianAge'],
                    median_age_2024=data_2024['medianAge'],
                    age_change=data_2024['medianAge'] - data_2000['medianAge'],
                    gender_ratio_2000=gender_ratio_2000,
                    gender_ratio_2024=gender_ratio_2024
                )
                
                self.metrics.append(metrics)
                
            except Exception as e:
                print(f"Error calculating metrics for {data.get('stateName', slug)}: {e}")
    
    def analyze_age_distributions(self, state_data, year):
        """Analyze age distribution patterns for a specific state and year"""
        try:
            year_data = state_data['years'][str(year)]
            age_groups = year_data['ageGroups']
            
            # Calculate youth (0-19), working age (20-64), elderly (65+) percentages
            total_pop = year_data['totalPopulation']
            youth_pop = 0
            working_pop = 0
            elderly_pop = 0
            
            for group in age_groups:
                age_range = group['ageRange']
                total = group['total']
                
                if age_range in ['0-4', '5-9', '10-14', '15-19']:
                    youth_pop += total
                elif age_range in ['20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64']:
                    working_pop += total
                else:  # 65+
                    elderly_pop += total
            
            return {
                'youth_percent': (youth_pop / total_pop) * 100,
                'working_percent': (working_pop / total_pop) * 100,
                'elderly_percent': (elderly_pop / total_pop) * 100
            }
        except:
            return None
    
    def find_extremes(self):
        """Find states with extreme characteristics"""
        results = {}
        
        # Population growth extremes
        fastest_growth = max(self.metrics, key=lambda x: x.growth_rate)
        slowest_growth = min(self.metrics, key=lambda x: x.growth_rate)
        largest_absolute_growth = max(self.metrics, key=lambda x: x.growth_absolute)
        largest_absolute_decline = min(self.metrics, key=lambda x: x.growth_absolute)
        
        # Age extremes
        youngest_2024 = min(self.metrics, key=lambda x: x.median_age_2024)
        oldest_2024 = max(self.metrics, key=lambda x: x.median_age_2024)
        fastest_aging = max(self.metrics, key=lambda x: x.age_change)
        slowest_aging = min(self.metrics, key=lambda x: x.age_change)
        
        # Gender ratio extremes
        most_male_heavy = max(self.metrics, key=lambda x: x.gender_ratio_2024)
        most_female_heavy = min(self.metrics, key=lambda x: x.gender_ratio_2024)
        biggest_gender_shift = max(self.metrics, key=lambda x: abs(x.gender_ratio_2024 - x.gender_ratio_2000))
        
        results['growth_extremes'] = {
            'fastest_growth': (fastest_growth.state_name, fastest_growth.growth_rate),
            'slowest_growth': (slowest_growth.state_name, slowest_growth.growth_rate),
            'largest_absolute_growth': (largest_absolute_growth.state_name, largest_absolute_growth.growth_absolute),
            'largest_absolute_decline': (largest_absolute_decline.state_name, largest_absolute_decline.growth_absolute)
        }
        
        results['age_extremes'] = {
            'youngest_state': (youngest_2024.state_name, youngest_2024.median_age_2024),
            'oldest_state': (oldest_2024.state_name, oldest_2024.median_age_2024),
            'fastest_aging': (fastest_aging.state_name, fastest_aging.age_change),
            'slowest_aging': (slowest_aging.state_name, slowest_aging.age_change)
        }
        
        results['gender_extremes'] = {
            'most_male_heavy': (most_male_heavy.state_name, most_male_heavy.gender_ratio_2024),
            'most_female_heavy': (most_female_heavy.state_name, most_female_heavy.gender_ratio_2024),
            'biggest_gender_shift': (biggest_gender_shift.state_name, 
                                   abs(biggest_gender_shift.gender_ratio_2024 - biggest_gender_shift.gender_ratio_2000))
        }
        
        return results
    
    def analyze_regional_patterns(self):
        """Analyze patterns by region"""
        regions = {}
        for metric in self.metrics:
            region = metric.region
            if region not in regions:
                regions[region] = []
            regions[region].append(metric)
        
        regional_analysis = {}
        for region, states in regions.items():
            if not states:
                continue
                
            avg_growth = statistics.mean([s.growth_rate for s in states])
            avg_age_2024 = statistics.mean([s.median_age_2024 for s in states])
            avg_age_change = statistics.mean([s.age_change for s in states])
            
            regional_analysis[region] = {
                'avg_growth_rate': avg_growth,
                'avg_median_age_2024': avg_age_2024,
                'avg_age_change': avg_age_change,
                'state_count': len(states),
                'states': [s.state_name for s in states]
            }
        
        return regional_analysis
    
    def find_surprising_contrasts(self):
        """Find surprising contrasts between neighboring states or similar states"""
        contrasts = []
        
        # Sort by various metrics to find interesting adjacent contrasts
        by_growth = sorted(self.metrics, key=lambda x: x.growth_rate)
        by_age = sorted(self.metrics, key=lambda x: x.median_age_2024)
        
        # Find states with dramatically different growth rates
        growth_range = by_growth[-1].growth_rate - by_growth[0].growth_rate
        for i in range(len(by_growth) - 1):
            diff = by_growth[i+1].growth_rate - by_growth[i].growth_rate
            if diff > growth_range * 0.1:  # If difference is >10% of total range
                contrasts.append({
                    'type': 'Growth Rate Gap',
                    'state1': by_growth[i].state_name,
                    'state2': by_growth[i+1].state_name,
                    'metric1': round(by_growth[i].growth_rate, 2),
                    'metric2': round(by_growth[i+1].growth_rate, 2),
                    'difference': round(diff, 2)
                })
        
        return contrasts[:10]  # Top 10 most interesting contrasts
    
    def run_full_analysis(self):
        """Run complete analysis and return comprehensive results"""
        print("Loading state data...")
        self.load_all_states()
        
        print("Calculating metrics...")
        self.calculate_metrics()
        
        print("Finding extremes...")
        extremes = self.find_extremes()
        
        print("Analyzing regional patterns...")
        regional = self.analyze_regional_patterns()
        
        print("Finding surprising contrasts...")
        contrasts = self.find_surprising_contrasts()
        
        # Additional detailed analysis for top/bottom states
        print("Analyzing age distributions...")
        age_distributions = {}
        for slug, data in self.states_data.items():
            state_name = data.get('stateName', slug)
            age_dist_2024 = self.analyze_age_distributions(data, 2024)
            age_dist_2000 = self.analyze_age_distributions(data, 2000)
            if age_dist_2024 and age_dist_2000:
                age_distributions[state_name] = {
                    '2000': age_dist_2000,
                    '2024': age_dist_2024,
                    'youth_change': age_dist_2024['youth_percent'] - age_dist_2000['youth_percent'],
                    'elderly_change': age_dist_2024['elderly_percent'] - age_dist_2000['elderly_percent']
                }
        
        return {
            'total_states': len(self.metrics),
            'extremes': extremes,
            'regional_patterns': regional,
            'surprising_contrasts': contrasts,
            'age_distributions': age_distributions,
            'all_metrics': [(m.state_name, m.growth_rate, m.median_age_2024, m.pop_2024) for m in self.metrics]
        }

def main():
    data_dir = "/Users/markovisic/Desktop/population-pyramid-docs/population-pyramids/src/data/states"
    analyzer = DemographicAnalyzer(data_dir)
    results = analyzer.run_full_analysis()
    
    print("\n" + "="*80)
    print("US STATE DEMOGRAPHICS ANALYSIS (2000-2024)")
    print("="*80)
    
    print(f"\nAnalyzed {results['total_states']} states and territories")
    
    print("\n📈 POPULATION GROWTH EXTREMES:")
    print(f"Fastest Growth: {results['extremes']['growth_extremes']['fastest_growth'][0]} ({results['extremes']['growth_extremes']['fastest_growth'][1]:.1f}%)")
    print(f"Slowest Growth: {results['extremes']['growth_extremes']['slowest_growth'][0]} ({results['extremes']['growth_extremes']['slowest_growth'][1]:.1f}%)")
    print(f"Largest Absolute Growth: {results['extremes']['growth_extremes']['largest_absolute_growth'][0]} (+{results['extremes']['growth_extremes']['largest_absolute_growth'][1]:,})")
    print(f"Largest Absolute Decline: {results['extremes']['growth_extremes']['largest_absolute_decline'][0]} ({results['extremes']['growth_extremes']['largest_absolute_decline'][1]:,})")
    
    print("\n👴 AGE EXTREMES:")
    print(f"Youngest State (2024): {results['extremes']['age_extremes']['youngest_state'][0]} (median age {results['extremes']['age_extremes']['youngest_state'][1]})")
    print(f"Oldest State (2024): {results['extremes']['age_extremes']['oldest_state'][0]} (median age {results['extremes']['age_extremes']['oldest_state'][1]})")
    print(f"Fastest Aging: {results['extremes']['age_extremes']['fastest_aging'][0]} (+{results['extremes']['age_extremes']['fastest_aging'][1]} years)")
    print(f"Slowest Aging: {results['extremes']['age_extremes']['slowest_aging'][0]} ({results['extremes']['age_extremes']['slowest_aging'][1]:+} years)")
    
    print("\n⚧️ GENDER RATIO EXTREMES:")
    print(f"Most Male-Heavy: {results['extremes']['gender_extremes']['most_male_heavy'][0]} ({results['extremes']['gender_extremes']['most_male_heavy'][1]:.1f} males per 100 females)")
    print(f"Most Female-Heavy: {results['extremes']['gender_extremes']['most_female_heavy'][0]} ({results['extremes']['gender_extremes']['most_female_heavy'][1]:.1f} males per 100 females)")
    
    print("\n🌎 REGIONAL AVERAGES:")
    for region, data in results['regional_patterns'].items():
        print(f"{region}: {data['avg_growth_rate']:+.1f}% growth, median age {data['avg_median_age_2024']:.1f}")
    
    print("\n🔥 TOP AGE DISTRIBUTION CHANGES:")
    # Find states with biggest youth/elderly shifts
    youth_gainers = sorted(results['age_distributions'].items(), 
                          key=lambda x: x[1]['youth_change'], reverse=True)[:5]
    elderly_gainers = sorted(results['age_distributions'].items(), 
                           key=lambda x: x[1]['elderly_change'], reverse=True)[:5]
    
    print("States Gaining Youth Population (% points):")
    for state, data in youth_gainers:
        print(f"  {state}: {data['youth_change']:+.1f}% points")
        
    print("States with Fastest Elderly Growth (% points):")
    for state, data in elderly_gainers:
        print(f"  {state}: {data['elderly_change']:+.1f}% points")

if __name__ == "__main__":
    main()