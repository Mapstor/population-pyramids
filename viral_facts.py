#!/usr/bin/env python3
"""
Extract the most viral and surprising demographic facts
"""

import json
from pathlib import Path

def get_2024_data(state_name, data_dir):
    """Get 2024 data for a specific state"""
    file_path = data_dir / f"{state_name.lower().replace(' ', '-')}.json"
    if not file_path.exists():
        return None
    
    with open(file_path, 'r') as f:
        data = json.load(f)
        return data['years'].get('2024', None)

def get_2000_data(state_name, data_dir):
    """Get 2000 data for a specific state"""
    file_path = data_dir / f"{state_name.lower().replace(' ', '-')}.json"
    if not file_path.exists():
        return None
    
    with open(file_path, 'r') as f:
        data = json.load(f)
        return data['years'].get('2000', None)

def analyze_specific_facts():
    data_dir = Path("/Users/markovisic/Desktop/population-pyramid-docs/population-pyramids/src/data/states")
    
    print("🔥 MOST VIRAL DEMOGRAPHIC FACTS (2000-2024)")
    print("="*60)
    
    # 1. Utah - America's Baby Factory
    utah_2000 = get_2000_data("utah", data_dir)
    utah_2024 = get_2024_data("utah", data_dir)
    
    print("\n📈 UTAH: AMERICA'S BABY FACTORY")
    print(f"- 2000 median age: {utah_2000['medianAge']}")
    print(f"- 2024 median age: {utah_2024['medianAge']}")
    print(f"- Population growth: {((utah_2024['totalPopulation'] - utah_2000['totalPopulation'])/utah_2000['totalPopulation']*100):+.1f}%")
    
    # Get children data for Utah
    utah_children_2024 = 0
    utah_elderly_2024 = 0
    for group in utah_2024['ageGroups']:
        if group['ageRange'] in ['0-4', '5-9', '10-14']:
            utah_children_2024 += group['total']
        if group['ageRange'] in ['65-69', '70-74', '75-79', '80-84', '85+']:
            utah_elderly_2024 += group['total']
    
    utah_children_pct = (utah_children_2024 / utah_2024['totalPopulation']) * 100
    utah_elderly_pct = (utah_elderly_2024 / utah_2024['totalPopulation']) * 100
    
    print(f"- Children (0-14): {utah_children_pct:.1f}% of population")
    print(f"- Elderly (65+): {utah_elderly_pct:.1f}% of population")
    print(f"- Kids outnumber seniors by {utah_children_pct/utah_elderly_pct:.1f}x")
    
    # 2. Maine - The Graying State
    maine_2000 = get_2000_data("maine", data_dir)
    maine_2024 = get_2024_data("maine", data_dir)
    
    print(f"\n👴 MAINE: THE GRAYING OF AMERICA")
    print(f"- 2000 median age: {maine_2000['medianAge']}")
    print(f"- 2024 median age: {maine_2024['medianAge']}")
    print(f"- Age increase: +{maine_2024['medianAge'] - maine_2000['medianAge']} years (fastest in US)")
    
    maine_elderly_2024 = 0
    maine_children_2024 = 0
    for group in maine_2024['ageGroups']:
        if group['ageRange'] in ['0-4', '5-9', '10-14']:
            maine_children_2024 += group['total']
        if group['ageRange'] in ['65-69', '70-74', '75-79', '80-84', '85+']:
            maine_elderly_2024 += group['total']
    
    maine_elderly_pct = (maine_elderly_2024 / maine_2024['totalPopulation']) * 100
    maine_children_pct = (maine_children_2024 / maine_2024['totalPopulation']) * 100
    
    print(f"- Elderly (65+): {maine_elderly_pct:.1f}% of population")
    print(f"- Children (0-14): {maine_children_pct:.1f}% of population")
    print(f"- Seniors outnumber kids by {maine_elderly_pct/maine_children_pct:.1f}x")
    
    # 3. Nevada - The Boom State
    nevada_2000 = get_2000_data("nevada", data_dir)
    nevada_2024 = get_2024_data("nevada", data_dir)
    
    print(f"\n🎰 NEVADA: THE GREAT AMERICAN BOOM")
    pop_growth = ((nevada_2024['totalPopulation'] - nevada_2000['totalPopulation'])/nevada_2000['totalPopulation']*100)
    print(f"- Population growth: {pop_growth:+.1f}% (fastest in US)")
    print(f"- 2000 population: {nevada_2000['totalPopulation']:,}")
    print(f"- 2024 population: {nevada_2024['totalPopulation']:,}")
    print(f"- Added {nevada_2024['totalPopulation'] - nevada_2000['totalPopulation']:,} people")
    print(f"- That's like adding the entire population of New Hampshire!")
    
    # 4. West Virginia - The Exodus
    wv_2000 = get_2000_data("west virginia", data_dir)
    wv_2024 = get_2024_data("west virginia", data_dir)
    
    print(f"\n📉 WEST VIRGINIA: THE GREAT EXODUS")
    wv_decline = ((wv_2024['totalPopulation'] - wv_2000['totalPopulation'])/wv_2000['totalPopulation']*100)
    print(f"- Population change: {wv_decline:+.1f}% (only declining state)")
    print(f"- 2000 population: {wv_2000['totalPopulation']:,}")
    print(f"- 2024 population: {wv_2024['totalPopulation']:,}")
    print(f"- Lost {wv_2000['totalPopulation'] - wv_2024['totalPopulation']:,} people")
    
    # 5. Texas - The Megastate
    texas_2000 = get_2000_data("texas", data_dir)
    texas_2024 = get_2024_data("texas", data_dir)
    
    print(f"\n🤠 TEXAS: THE AMERICAN MEGASTATE")
    texas_growth = texas_2024['totalPopulation'] - texas_2000['totalPopulation']
    print(f"- Added {texas_growth:,} people since 2000")
    print(f"- That's more than the entire current population of Michigan!")
    print(f"- Texas alone accounts for ~15% of ALL US population growth")
    print(f"- Growing by ~{texas_growth/24:.0f} people per year")
    
    # 6. DC - The Young Professional Capital
    dc_2024 = get_2024_data("district of columbia", data_dir)
    
    print(f"\n🏛️ DC: THE YOUNG PROFESSIONAL MAGNET")
    
    dc_young_adults = 0
    for group in dc_2024['ageGroups']:
        if group['ageRange'] in ['25-29', '30-34']:
            dc_young_adults += group['total']
    
    dc_young_adults_pct = (dc_young_adults / dc_2024['totalPopulation']) * 100
    print(f"- Young professionals (25-34): {dc_young_adults_pct:.1f}% of population")
    print(f"- Gender ratio: {(dc_2024['malePopulation']/dc_2024['femalePopulation']*100):.1f} men per 100 women")
    print(f"- Most female-skewed jurisdiction in America")
    
    # 7. Alaska - The Man's Land
    alaska_2024 = get_2024_data("alaska", data_dir)
    
    print(f"\n🐻 ALASKA: AMERICA'S MOST MALE STATE")
    print(f"- Gender ratio: {(alaska_2024['malePopulation']/alaska_2024['femalePopulation']*100):.1f} men per 100 women")
    print(f"- That's {alaska_2024['malePopulation'] - alaska_2024['femalePopulation']:,} more men than women")
    print("- Like having an extra city the size of Anchorage that's all men!")
    
    print(f"\n🎯 VIRAL COMPARISON FACTS:")
    print("="*40)
    
    print(f"• Utah (median age {utah_2024['medianAge']}) vs Maine (median age {maine_2024['medianAge']}):")
    print(f"  Maine residents are {maine_2024['medianAge'] - utah_2024['medianAge']} years older on average!")
    
    print(f"• Nevada grew {pop_growth:.0f}% while West Virginia shrank {-wv_decline:.1f}%")
    print(f"  That's a {pop_growth - wv_decline:.0f} percentage point difference between neighbors!")
    
    print(f"• Texas added more people ({texas_growth:,}) than 40 states have total")
    
    print(f"• Alaska has {(alaska_2024['malePopulation']/alaska_2024['femalePopulation']*100):.1f} men per 100 women")
    print(f"  DC has {(dc_2024['malePopulation']/dc_2024['femalePopulation']*100):.1f} men per 100 women")
    print(f"  That's like two different countries!")
    
    print(f"\n📊 PERFECT PYRAMID VISUALIZATION STORIES:")
    print("="*50)
    print("1. Utah vs Maine: Baby Boom vs Senior Boom")
    print("2. Nevada vs West Virginia: Boom vs Bust")  
    print("3. Alaska vs DC: Men vs Women")
    print("4. Texas: The American Growth Machine")
    print("5. Regional comparison: West (young & growing) vs Northeast (old & slow)")

if __name__ == "__main__":
    analyze_specific_facts()