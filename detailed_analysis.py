#!/usr/bin/env python3
"""
Detailed Demographics Analysis - Finding Viral Insights
Focused on surprising facts and extreme contrasts
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Tuple, Any

class ViralInsightAnalyzer:
    def __init__(self, data_dir: str):
        self.data_dir = Path(data_dir)
        self.states_data = {}
        
    def load_all_states(self):
        """Load data from all state JSON files"""
        for json_file in self.data_dir.glob("*.json"):
            with open(json_file, 'r') as f:
                data = json.load(f)
                self.states_data[data['stateName']] = data
    
    def get_state_metrics(self, state_name: str, year: str):
        """Get comprehensive metrics for a state in a given year"""
        try:
            data = self.states_data[state_name]['years'][str(year)]
            total = data['totalPopulation']
            male = data['malePopulation']
            female = data['femalePopulation']
            
            # Calculate age group percentages
            age_groups = {}
            for group in data['ageGroups']:
                age_range = group['ageRange']
                age_groups[age_range] = {
                    'total': group['total'],
                    'percent': (group['total'] / total) * 100,
                    'male_percent': group['malePercent'],
                    'female_percent': group['femalePercent']
                }
            
            return {
                'total_population': total,
                'male_population': male,
                'female_population': female,
                'median_age': data['medianAge'],
                'gender_ratio': (male / female) * 100,
                'age_groups': age_groups
            }
        except:
            return None
    
    def find_extreme_age_distributions(self):
        """Find states with the most extreme age pyramid shapes"""
        results = []
        
        for state_name in self.states_data.keys():
            metrics_2024 = self.get_state_metrics(state_name, '2024')
            if not metrics_2024:
                continue
                
            age_groups = metrics_2024['age_groups']
            
            # Calculate youth bulge (ages 20-34 vs 35-54)
            young_adults = age_groups.get('20-24', {}).get('percent', 0) + \
                          age_groups.get('25-29', {}).get('percent', 0) + \
                          age_groups.get('30-34', {}).get('percent', 0)
            
            middle_aged = age_groups.get('35-39', {}).get('percent', 0) + \
                         age_groups.get('40-44', {}).get('percent', 0) + \
                         age_groups.get('45-49', {}).get('percent', 0) + \
                         age_groups.get('50-54', {}).get('percent', 0)
            
            # Calculate elderly percentage
            elderly = sum(age_groups.get(age, {}).get('percent', 0) 
                         for age in ['65-69', '70-74', '75-79', '80-84', '85+'])
            
            # Calculate children percentage  
            children = age_groups.get('0-4', {}).get('percent', 0) + \
                      age_groups.get('5-9', {}).get('percent', 0) + \
                      age_groups.get('10-14', {}).get('percent', 0)
            
            youth_bulge_ratio = young_adults / middle_aged if middle_aged > 0 else 0
            
            results.append({
                'state': state_name,
                'youth_bulge_ratio': youth_bulge_ratio,
                'elderly_percent': elderly,
                'children_percent': children,
                'median_age': metrics_2024['median_age'],
                'young_adults_percent': young_adults
            })
        
        return sorted(results, key=lambda x: x['youth_bulge_ratio'], reverse=True)
    
    def find_gender_anomalies(self):
        """Find unusual gender patterns across age groups"""
        anomalies = []
        
        for state_name in self.states_data.keys():
            metrics_2024 = self.get_state_metrics(state_name, '2024')
            if not metrics_2024:
                continue
            
            age_groups = metrics_2024['age_groups']
            
            # Find age groups with most extreme gender imbalances
            extreme_ratios = []
            for age_range, data in age_groups.items():
                male_pct = data['male_percent']
                female_pct = data['female_percent']
                ratio = male_pct / female_pct if female_pct > 0 else 0
                extreme_ratios.append((age_range, ratio, male_pct))
            
            # Find most male-heavy age group
            most_male = max(extreme_ratios, key=lambda x: x[1])
            least_male = min(extreme_ratios, key=lambda x: x[1])
            
            anomalies.append({
                'state': state_name,
                'overall_gender_ratio': metrics_2024['gender_ratio'],
                'most_male_age': most_male[0],
                'most_male_ratio': most_male[1],
                'least_male_age': least_male[0], 
                'least_male_ratio': least_male[1]
            })
        
        return anomalies
    
    def compare_growth_patterns(self):
        """Find states with interesting growth pattern changes"""
        patterns = []
        
        for state_name in self.states_data.keys():
            # Get population for multiple years to see growth pattern
            years = [2000, 2005, 2010, 2015, 2020, 2024]
            populations = []
            
            for year in years:
                metrics = self.get_state_metrics(state_name, year)
                if metrics:
                    populations.append(metrics['total_population'])
                else:
                    populations.append(None)
            
            if None in populations:
                continue
            
            # Calculate growth rates for each 5-year period
            growth_rates = []
            for i in range(len(populations) - 1):
                if populations[i] > 0:
                    rate = ((populations[i+1] - populations[i]) / populations[i]) * 100
                    growth_rates.append(rate)
            
            # Check for acceleration/deceleration
            early_avg = sum(growth_rates[:2]) / 2 if len(growth_rates) >= 2 else 0
            late_avg = sum(growth_rates[-2:]) / 2 if len(growth_rates) >= 2 else 0
            
            acceleration = late_avg - early_avg
            
            patterns.append({
                'state': state_name,
                'pop_2000': populations[0],
                'pop_2024': populations[-1],
                'total_growth': ((populations[-1] - populations[0]) / populations[0]) * 100,
                'early_growth_avg': early_avg,
                'late_growth_avg': late_avg,
                'acceleration': acceleration,
                'growth_rates': growth_rates
            })
        
        return patterns
    
    def find_neighboring_contrasts(self):
        """Find dramatic contrasts between neighboring states"""
        # Define some key neighboring state pairs
        neighbors = [
            ('Texas', 'Oklahoma'), ('California', 'Nevada'), ('New York', 'Vermont'),
            ('Florida', 'Georgia'), ('North Dakota', 'South Dakota'), 
            ('Maine', 'New Hampshire'), ('Wyoming', 'Colorado'),
            ('West Virginia', 'Virginia'), ('Mississippi', 'Alabama'),
            ('Utah', 'Nevada'), ('Arizona', 'New Mexico'), ('Washington', 'Oregon')
        ]
        
        contrasts = []
        
        for state1, state2 in neighbors:
            if state1 not in self.states_data or state2 not in self.states_data:
                continue
                
            m1_2000 = self.get_state_metrics(state1, '2000')
            m1_2024 = self.get_state_metrics(state1, '2024') 
            m2_2000 = self.get_state_metrics(state2, '2000')
            m2_2024 = self.get_state_metrics(state2, '2024')
            
            if not all([m1_2000, m1_2024, m2_2000, m2_2024]):
                continue
            
            growth1 = ((m1_2024['total_population'] - m1_2000['total_population']) / m1_2000['total_population']) * 100
            growth2 = ((m2_2024['total_population'] - m2_2000['total_population']) / m2_2000['total_population']) * 100
            
            age_diff_2024 = m1_2024['median_age'] - m2_2024['median_age']
            gender_diff_2024 = m1_2024['gender_ratio'] - m2_2024['gender_ratio']
            
            contrasts.append({
                'state_pair': f"{state1} vs {state2}",
                'growth_difference': abs(growth1 - growth2),
                'growth1': growth1,
                'growth2': growth2,
                'age_difference': abs(age_diff_2024), 
                'median_age1': m1_2024['median_age'],
                'median_age2': m2_2024['median_age'],
                'gender_difference': abs(gender_diff_2024)
            })
        
        return sorted(contrasts, key=lambda x: x['growth_difference'], reverse=True)
    
    def analyze_population_milestones(self):
        """Find interesting population milestone crossings"""
        milestones = []
        
        for state_name in self.states_data.keys():
            m_2000 = self.get_state_metrics(state_name, '2000')
            m_2024 = self.get_state_metrics(state_name, '2024')
            
            if not m_2000 or not m_2024:
                continue
            
            pop_2000 = m_2000['total_population']
            pop_2024 = m_2024['total_population']
            
            # Check for million+ milestones
            millions_2000 = pop_2000 // 1000000
            millions_2024 = pop_2024 // 1000000
            
            if millions_2024 > millions_2000:
                milestones.append({
                    'state': state_name,
                    'milestone_type': 'Crossed Million Mark',
                    'from_millions': millions_2000,
                    'to_millions': millions_2024,
                    'pop_2000': pop_2000,
                    'pop_2024': pop_2024
                })
            
            # Check for states that lost a million+ milestone
            if millions_2024 < millions_2000:
                milestones.append({
                    'state': state_name,
                    'milestone_type': 'Lost Million Mark', 
                    'from_millions': millions_2000,
                    'to_millions': millions_2024,
                    'pop_2000': pop_2000,
                    'pop_2024': pop_2024
                })
        
        return milestones
    
    def run_viral_analysis(self):
        """Run the complete viral insights analysis"""
        print("Loading state data...")
        self.load_all_states()
        
        print("Analyzing extreme age distributions...")
        age_extremes = self.find_extreme_age_distributions()
        
        print("Finding gender anomalies...")
        gender_anomalies = self.find_gender_anomalies()
        
        print("Analyzing growth patterns...")
        growth_patterns = self.compare_growth_patterns()
        
        print("Finding neighboring contrasts...")
        neighbor_contrasts = self.find_neighboring_contrasts()
        
        print("Analyzing population milestones...")
        milestones = self.analyze_population_milestones()
        
        return {
            'age_extremes': age_extremes,
            'gender_anomalies': gender_anomalies,
            'growth_patterns': growth_patterns,
            'neighbor_contrasts': neighbor_contrasts,
            'milestones': milestones
        }

def main():
    data_dir = "/Users/markovisic/Desktop/population-pyramid-docs/population-pyramids/src/data/states"
    analyzer = ViralInsightAnalyzer(data_dir)
    results = analyzer.run_viral_analysis()
    
    print("\n" + "="*80)
    print("🔥 VIRAL DEMOGRAPHIC INSIGHTS (2000-2024)")
    print("="*80)
    
    print("\n🎯 MOST EXTREME AGE DISTRIBUTIONS:")
    for i, state in enumerate(results['age_extremes'][:5]):
        print(f"{i+1}. {state['state']}: {state['youth_bulge_ratio']:.2f} youth bulge ratio")
        print(f"   - Young adults (20-34): {state['young_adults_percent']:.1f}%")
        print(f"   - Elderly (65+): {state['elderly_percent']:.1f}%")
        print(f"   - Children (0-14): {state['children_percent']:.1f}%")
        print(f"   - Median age: {state['median_age']}")
        print()
    
    print("\n🚀 MOST DRAMATIC GROWTH ACCELERATIONS:")
    sorted_acceleration = sorted(results['growth_patterns'], 
                               key=lambda x: x['acceleration'], reverse=True)
    for i, state in enumerate(sorted_acceleration[:5]):
        print(f"{i+1}. {state['state']}: {state['acceleration']:+.2f}% acceleration")
        print(f"   - Early growth (2000-2010): {state['early_growth_avg']:.1f}%/5yr")
        print(f"   - Recent growth (2015-2024): {state['late_growth_avg']:.1f}%/5yr")
        print(f"   - Total growth: {state['total_growth']:+.1f}%")
        print()
    
    print("\n📉 BIGGEST GROWTH DECELERATIONS:")
    sorted_deceleration = sorted(results['growth_patterns'], 
                                key=lambda x: x['acceleration'])
    for i, state in enumerate(sorted_deceleration[:5]):
        print(f"{i+1}. {state['state']}: {state['acceleration']:+.2f}% acceleration")
        print(f"   - Early growth (2000-2010): {state['early_growth_avg']:.1f}%/5yr")
        print(f"   - Recent growth (2015-2024): {state['late_growth_avg']:.1f}%/5yr")  
        print(f"   - Total growth: {state['total_growth']:+.1f}%")
        print()
    
    print("\n⚔️ MOST DRAMATIC NEIGHBORING STATE CONTRASTS:")
    for i, contrast in enumerate(results['neighbor_contrasts'][:5]):
        print(f"{i+1}. {contrast['state_pair']}")
        print(f"   - Growth difference: {contrast['growth_difference']:.1f}% points")
        print(f"   - Growth rates: {contrast['growth1']:+.1f}% vs {contrast['growth2']:+.1f}%")
        print(f"   - Age difference: {contrast['age_difference']:.1f} years")
        print(f"   - Median ages: {contrast['median_age1']} vs {contrast['median_age2']}")
        print()
    
    print("\n🏆 POPULATION MILESTONE CROSSINGS:")
    for milestone in results['milestones']:
        if milestone['milestone_type'] == 'Crossed Million Mark':
            print(f"📈 {milestone['state']} crossed into {milestone['to_millions']}+ million")
            print(f"   {milestone['pop_2000']:,} → {milestone['pop_2024']:,}")
        else:
            print(f"📉 {milestone['state']} dropped below {milestone['from_millions']} million")  
            print(f"   {milestone['pop_2000']:,} → {milestone['pop_2024']:,}")
        print()
    
    print("\n🔥 TOP GENDER RATIO ANOMALIES (2024):")
    # Find states with most extreme overall ratios
    extreme_gender = sorted(results['gender_anomalies'], 
                           key=lambda x: abs(x['overall_gender_ratio'] - 100), 
                           reverse=True)
    for i, state in enumerate(extreme_gender[:5]):
        ratio = state['overall_gender_ratio']
        print(f"{i+1}. {state['state']}: {ratio:.1f} males per 100 females")
        if ratio > 105:
            print(f"   🔵 Heavily male-skewed")
        elif ratio < 95:
            print(f"   🔴 Heavily female-skewed")
        print()

if __name__ == "__main__":
    main()