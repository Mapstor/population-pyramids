'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { feature } from 'topojson-client';

interface CountryData {
  slug: string;
  name: string;
  code: string;
  ratio: number;
  atBirthRatio: number;
  elderlyRatio: number;
  male: number;
  female: number;
}

interface GenderRatioMapProps {
  data: CountryData[];
  ageFilter: 'all' | 'birth' | 'elderly';
  onCountryClick?: (slug: string) => void;
}

export default function GenderRatioMap({ data, ageFilter, onCountryClick }: GenderRatioMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({ visible: false, x: 0, y: 0, content: '' });

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const width = 1200;
    const height = 600;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    // Create projection
    const projection = d3.geoNaturalEarth1()
      .scale(200)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Get ratio based on filter
    const getRatio = (d: CountryData) => {
      switch (ageFilter) {
        case 'birth': return d.atBirthRatio;
        case 'elderly': return d.elderlyRatio;
        default: return d.ratio;
      }
    };

    // Create color scale
    const colorScale = d3.scaleLinear<string>()
      .domain([85, 95, 100, 105, 115]) // Female-heavy to male-heavy
      .range(['#ec4899', '#f9a8d4', '#f3f4f6', '#93c5fd', '#2563eb'])
      .clamp(true);

    // Load world topology
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((worldData: any) => {
      const countries = feature(worldData, worldData.objects.countries);

      // Create a map for quick lookup
      const dataMap = new Map<string, CountryData>();
      data.forEach(d => {
        // Map country codes - this is simplified, you may need more mappings
        dataMap.set(d.code, d);
      });

      // Draw countries
      svg.append('g')
        .selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('d', path as any)
        .attr('fill', (d: any) => {
          const countryData = dataMap.get(d.properties.name) || dataMap.get(d.id);
          if (countryData) {
            const ratio = getRatio(countryData);
            return colorScale(ratio);
          }
          return '#e5e7eb'; // Gray for no data
        })
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d: any) {
          const countryData = dataMap.get(d.properties.name) || dataMap.get(d.id);
          if (countryData) {
            const ratio = getRatio(countryData);
            const diff = Math.abs(countryData.male - countryData.female);
            const moreGender = countryData.male > countryData.female ? 'males' : 'females';
            
            setTooltip({
              visible: true,
              x: event.pageX,
              y: event.pageY,
              content: `${countryData.name}: ${ratio.toFixed(1)} males per 100 females (${diff.toLocaleString()} more ${moreGender})`
            });
          }
        })
        .on('mousemove', function(event) {
          setTooltip(prev => ({
            ...prev,
            x: event.pageX,
            y: event.pageY
          }));
        })
        .on('mouseout', function() {
          setTooltip(prev => ({ ...prev, visible: false }));
        })
        .on('click', function(event, d: any) {
          const countryData = dataMap.get(d.properties.name) || dataMap.get(d.id);
          if (countryData && onCountryClick) {
            onCountryClick(countryData.slug);
          }
        });

      // Add legend
      const legendWidth = 300;
      const legendHeight = 20;
      
      const legendScale = d3.scaleLinear()
        .domain([85, 115])
        .range([0, legendWidth]);

      const legend = svg.append('g')
        .attr('transform', `translate(${(width - legendWidth) / 2}, ${height - 50})`);

      // Gradient definition
      const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'gender-ratio-gradient')
        .attr('x1', '0%')
        .attr('x2', '100%');

      gradient.selectAll('stop')
        .data([
          { offset: '0%', color: '#ec4899' },
          { offset: '25%', color: '#f9a8d4' },
          { offset: '50%', color: '#f3f4f6' },
          { offset: '75%', color: '#93c5fd' },
          { offset: '100%', color: '#2563eb' }
        ])
        .enter()
        .append('stop')
        .attr('offset', d => d.offset)
        .attr('stop-color', d => d.color);

      legend.append('rect')
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#gender-ratio-gradient)');

      legend.append('text')
        .attr('x', 0)
        .attr('y', -5)
        .text('More Females')
        .style('font-size', '12px')
        .style('fill', '#ec4899');

      legend.append('text')
        .attr('x', legendWidth / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .text('Balanced (100)')
        .style('font-size', '12px')
        .style('fill', '#6b7280');

      legend.append('text')
        .attr('x', legendWidth)
        .attr('y', -5)
        .attr('text-anchor', 'end')
        .text('More Males')
        .style('font-size', '12px')
        .style('fill', '#2563eb');

      // Add axis
      const axisScale = d3.scaleLinear()
        .domain([85, 115])
        .range([0, legendWidth]);

      const axis = d3.axisBottom(axisScale)
        .ticks(5)
        .tickFormat(d => `${d}`);

      legend.append('g')
        .attr('transform', `translate(0, ${legendHeight})`)
        .call(axis);
    });
  }, [data, ageFilter, onCountryClick]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full h-auto"></svg>
      
      {tooltip.visible && (
        <div
          className="absolute bg-gray-900 text-white px-3 py-2 rounded-lg text-sm pointer-events-none z-50"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 40
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}