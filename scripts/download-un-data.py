#!/usr/bin/env python3

import requests
import json
import os
import time
from collections import defaultdict

def create_slug(name):
    """Convert country name to URL-friendly slug"""
    return name.lower().replace(' ', '-').replace("'", '').replace(',', '').replace('.', '').replace('(', '').replace(')', '')

def get_countries():
    """Get list of all countries from UN API"""
    print("Fetching countries...")
    url = "https://population.un.org/dataportalapi/api/v1/locations"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        # Filter for countries only (exclude regions with IDs > 900)
        countries = []
        for location in data['data']:
            # Skip regions and aggregates (they typically have IDs > 900 or are world regions)
            if (location['id'] < 900 and 
                location['iso3'] and  # Countries have ISO3 codes
                location['iso2'] and  # Countries have ISO2 codes
                location['name'] not in ['World', 'More developed regions', 'Less developed regions']):
                countries.append({
                    'id': location['id'],
                    'name': location['name'],
                    'iso3': location['iso3'],
                    'iso2': location['iso2'],
                    'slug': create_slug(location['name'])
                })
        
        print(f"Found {len(countries)} countries")
        return countries
        
    except Exception as e:
        print(f"Error fetching countries: {e}")
        return []

def get_population_data(country_id, country_name, start_year=1970, end_year=2024):
    """Get population data by age and sex for a specific country"""
    print(f"Fetching data for {country_name}...")
    
    # Indicator 46: Population by 5-year age groups and sex
    url = f"https://population.un.org/dataportalapi/api/v1/data/indicators/46/locations/{country_id}/start/{start_year}/end/{end_year}"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        if 'data' not in data:
            print(f"No data returned for {country_name}")
            return None
            
        # Process the data
        years_data = defaultdict(lambda: {
            'year': 0,
            'totalPopulation': 0,
            'malePopulation': 0,
            'femalePopulation': 0,
            'medianAge': 0,
            'ageGroups': []
        })
        
        age_groups_by_year = defaultdict(lambda: defaultdict(lambda: {'male': 0, 'female': 0}))
        
        for record in data['data']:
            year = record['timeLabel']
            age_group = record['ageLabel']
            sex = record['sex']
            value = int(record['value'] * 1000)  # UN data is in thousands
            
            if year < start_year or year > end_year:
                continue
                
            # Skip totals - we'll calculate them
            if age_group == "Total" or sex == "Both sexes":
                continue
                
            # Store age group data
            if sex == "Male":
                age_groups_by_year[year][age_group]['male'] = value
            elif sex == "Female":
                age_groups_by_year[year][age_group]['female'] = value
        
        # Convert to our format
        for year, age_data in age_groups_by_year.items():
            year_obj = years_data[year]
            year_obj['year'] = year
            
            total_male = 0
            total_female = 0
            age_groups = []
            
            # Sort age groups properly
            sorted_ages = sorted(age_data.keys(), key=lambda x: (
                0 if x == "0-4" else
                5 if x == "5-9" else
                int(x.split('-')[0]) if '-' in x else
                100 if x == "100+" else
                float('inf')
            ))
            
            for age_group in sorted_ages:
                male_pop = age_data[age_group]['male']
                female_pop = age_data[age_group]['female']
                
                age_groups.append({
                    'ageRange': age_group,
                    'male': male_pop,
                    'female': female_pop,
                    'total': male_pop + female_pop
                })
                
                total_male += male_pop
                total_female += female_pop
            
            year_obj['ageGroups'] = age_groups
            year_obj['malePopulation'] = total_male
            year_obj['femalePopulation'] = total_female
            year_obj['totalPopulation'] = total_male + total_female
            
            # Calculate median age (rough approximation)
            year_obj['medianAge'] = calculate_median_age(age_groups, total_male + total_female)
        
        return dict(years_data)
        
    except Exception as e:
        print(f"Error fetching data for {country_name}: {e}")
        return None

def calculate_median_age(age_groups, total_population):
    """Calculate rough median age from age groups"""
    if total_population == 0:
        return 0
        
    cumulative = 0
    target = total_population / 2
    
    for group in age_groups:
        cumulative += group['total']
        if cumulative >= target:
            # Simple approximation - midpoint of age group
            age_range = group['ageRange']
            if age_range == "100+":
                return 100
            elif '-' in age_range:
                start_age = int(age_range.split('-')[0])
                return start_age + 2.5  # Midpoint of 5-year group
            else:
                return 0
    
    return 0

def save_country_data(country, years_data):
    """Save country data to JSON file"""
    output_dir = 'src/data/population'
    os.makedirs(output_dir, exist_ok=True)
    
    # Create the country data structure
    country_data = {
        'countryCode': country['iso3'],
        'countryName': country['name'],
        'slug': country['slug'],
        'region': '',  # We can add this later if needed
        'years': {}
    }
    
    # Convert years data
    for year, year_data in years_data.items():
        country_data['years'][str(year)] = year_data
    
    # Save to file
    filename = f"{output_dir}/{country['slug']}.json"
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(country_data, f, indent=2, ensure_ascii=False)
    
    print(f"✓ Saved {country['name']} to {filename}")

def main():
    print("UN Population Data Downloader")
    print("=" * 40)
    
    # Get all countries
    countries = get_countries()
    if not countries:
        print("Failed to get countries list")
        return
    
    # Process each country
    for i, country in enumerate(countries, 1):
        print(f"\n[{i}/{len(countries)}]", end=" ")
        
        # Get population data
        years_data = get_population_data(country['id'], country['name'])
        
        if years_data:
            # Save to file
            save_country_data(country, years_data)
        else:
            print(f"✗ Failed to get data for {country['name']}")
        
        # Be nice to the API
        time.sleep(0.5)
    
    print(f"\n\nCompleted! Processed {len(countries)} countries.")
    print("Data saved to src/data/population/")

if __name__ == '__main__':
    main()