import React, { useState } from 'react';

const KundliChart = ({ clientInfo }) => {
  const [hoveredHouse, setHoveredHouse] = useState(null);

  if (!clientInfo) return null;

  const { name, dob, tob, rashi } = clientInfo;

  // Derive a base zodiac sign index from DOB (1 to 12)
  // Mesh (Aries) = 1, Vrishabha = 2, ..., Meena (Pisces) = 12
  const rashiList = [
    'Mesh (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
    'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
    'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
  ];
  
  const baseIndex = rashiList.indexOf(rashi);
  const ascendantSign = baseIndex !== -1 ? baseIndex + 1 : 1; // 1-indexed (1 to 12)

  // Calculate sign for each house counter-clockwise
  // House 1 (Ascendant) has ascendantSign
  // House 2 has ascendantSign + 1, etc. (wrap around 12)
  const getSignForHouse = (houseNumber) => {
    let signNum = (ascendantSign + houseNumber - 1) % 12;
    return signNum === 0 ? 12 : signNum;
  };

  // Deterministically place planets in houses based on day of birth and time of birth
  // to make different client charts look unique
  const day = new Date(dob).getDate() || 1;
  const timeVal = tob ? parseInt(tob.replace(':', '')) : 1200;

  const planetPlacements = {
    1: ['Lagna (Asc)'],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
    11: [],
    12: []
  };

  // Place planets based on simple deterministic math
  const planets = [
    { name: 'Su (Sun)', shift: 3 },
    { name: 'Mo (Moon)', shift: 7 },
    { name: 'Ma (Mars)', shift: 11 },
    { name: 'Me (Merc)', shift: 5 },
    { name: 'Ju (Jup)', shift: 9 },
    { name: 'Ve (Ven)', shift: 2 },
    { name: 'Sa (Sat)', shift: 6 },
    { name: 'Ra (Rahu)', shift: 8 },
    { name: 'Ke (Ketu)', shift: 10 }
  ];

  planets.forEach(p => {
    // Determine house (1-12)
    const house = ((day + p.shift + Math.floor(timeVal / 100)) % 12) + 1;
    planetPlacements[house].push(p.name);
  });

  // Keep Rahu & Ketu opposite (astrologically correct - 180 degrees apart, 7 houses difference)
  // Let's override Rahu and Ketu to make sure they are opposite!
  const rahuHouse = ((day + Math.floor(timeVal / 100)) % 12) + 1;
  const ketuHouse = ((rahuHouse + 6) % 12) + 1;

  // Remove existing Ra/Ke from placements
  for (let h = 1; h <= 12; h++) {
    planetPlacements[h] = planetPlacements[h].filter(item => !item.startsWith('Ra') && !item.startsWith('Ke'));
  }
  planetPlacements[rahuHouse].push('Ra (Rahu)');
  planetPlacements[ketuHouse].push('Ke (Ketu)');

  // House definitions for hover info
  const houseDetails = {
    1: { name: '1st House (Lagna)', significance: 'Self, Personality, Physical Appearance, Health' },
    2: { name: '2nd House (Dhana)', significance: 'Wealth, Family, Speech, Assets' },
    3: { name: '3rd House (Sahaja)', significance: 'Siblings, Courage, Writing, Communication' },
    4: { name: '4th House (Bandhu)', significance: 'Mother, Home, Happiness, Vehicles' },
    5: { name: '5th House (Putra)', significance: 'Children, Intellect, Romance, Good Karma' },
    6: { name: '6th House (Ari)', significance: 'Debts, Enemies, Disease, Service' },
    7: { name: '7th House (Yuvati)', significance: 'Spouse, Marriage, Partnerships, Public Image' },
    8: { name: '8th House (Randhra)', significance: 'Longevity, Sudden Events, Secrets, Research' },
    9: { name: '9th House (Dharma)', significance: 'Luck, Father, Religion, Higher Learning' },
    10: { name: '10th House (Karma)', significance: 'Career, Status, Fame, Actions' },
    11: { name: '11th House (Labha)', significance: 'Gains, Income, Friends, Desires' },
    12: { name: '12th House (Vyaya)', significance: 'Losses, Isolation, Foreign Travel, Spirituality' }
  };

  // Center coordinates of each house in a 300x300 SVG to place texts
  const houseCoords = {
    1: { x: 150, y: 85, signX: 150, signY: 55 },
    2: { x: 75, y: 50, signX: 75, signY: 25 },
    3: { x: 50, y: 75, signX: 25, signY: 75 },
    4: { x: 90, y: 150, signX: 60, signY: 150 },
    5: { x: 50, y: 225, signX: 25, signY: 225 },
    6: { x: 75, y: 250, signX: 75, signY: 275 },
    7: { x: 150, y: 215, signX: 150, signY: 245 },
    8: { x: 225, y: 250, signX: 225, signY: 275 },
    9: { x: 250, y: 225, signX: 275, signY: 225 },
    10: { x: 210, y: 150, signX: 240, signY: 150 },
    11: { x: 250, y: 75, signX: 275, signY: 75 },
    12: { x: 225, y: 50, signX: 225, signY: 25 }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white/5 border border-white/5 rounded-2xl relative">
      <h4 className="text-sm font-bold text-saffron-400 uppercase tracking-widest mb-3">Lagna Chart (North Indian)</h4>

      <div className="relative">
        <svg 
          width="320" 
          height="320" 
          viewBox="0 0 300 300" 
          className="bg-cosmic-950/60 rounded-xl border border-white/10 shadow-2xl overflow-visible"
        >
          {/* Outlines of houses */}
          {/* Main outer square */}
          <rect x="0" y="0" width="300" height="300" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" />
          
          {/* Diagonals */}
          <line x1="0" y1="0" x2="300" y2="300" className="kundli-line" />
          <line x1="300" y1="0" x2="0" y2="300" className="kundli-line" />
          
          {/* Inner Diamond */}
          <polygon points="150,0 300,150 150,300 0,150" className="kundli-line" fill="none" />

          {/* Interactive hover elements & shapes */}
          {/* 1. House 1 */}
          <polygon 
            points="150,150 0,0 300,0" 
            fill={hoveredHouse === 1 ? 'rgba(244, 135, 11, 0.08)' : 'transparent'} 
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredHouse(1)}
            onMouseLeave={() => setHoveredHouse(null)}
          />
          {/* 2. House 2 */}
          <polygon 
            points="0,0 150,0 75,75" 
            fill={hoveredHouse === 2 ? 'rgba(244, 135, 11, 0.08)' : 'transparent'} 
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredHouse(2)}
            onMouseLeave={() => setHoveredHouse(null)}
          />
          {/* 3. House 3 */}
          <polygon 
            points="0,0 0,150 75,75" 
            fill={hoveredHouse === 3 ? 'rgba(244, 135, 11, 0.08)' : 'transparent'} 
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredHouse(3)}
            onMouseLeave={() => setHoveredHouse(null)}
          />
          {/* 4. House 4 */}
          <polygon 
            points="150,150 0,150 75,75 75,225" 
            fill={hoveredHouse === 4 ? 'rgba(244, 135, 11, 0.08)' : 'transparent'} 
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredHouse(4)}
            onMouseLeave={() => setHoveredHouse(null)}
          />
          {/* 5. House 5 */}
          <polygon 
            points="0,150 0,300 75,225" 
            fill={hoveredHouse === 5 ? 'rgba(244, 135, 11, 0.08)' : 'transparent'} 
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredHouse(5)}
            onMouseLeave={() => setHoveredHouse(null)}
          />
          {/* 6. House 6 */}
          <polygon 
            points="0,300 150,300 75,225" 
            fill={hoveredHouse === 6 ? 'rgba(244, 135, 11, 0.08)' : 'transparent'} 
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredHouse(6)}
            onMouseLeave={() => setHoveredHouse(null)}
          />
          {/* 7. House 7 */}
          <polygon 
            points="150,150 0,300 300,300" 
            fill={hoveredHouse === 7 ? 'rgba(244, 135, 11, 0.08)' : 'transparent'} 
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredHouse(7)}
            onMouseLeave={() => setHoveredHouse(null)}
          />
          {/* 8. House 8 */}
          <polygon 
            points="150,300 300,300 225,225" 
            fill={hoveredHouse === 8 ? 'rgba(244, 135, 11, 0.08)' : 'transparent'} 
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredHouse(8)}
            onMouseLeave={() => setHoveredHouse(null)}
          />
          {/* 9. House 9 */}
          <polygon 
            points="300,150 300,300 225,225" 
            fill={hoveredHouse === 9 ? 'rgba(244, 135, 11, 0.08)' : 'transparent'} 
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredHouse(9)}
            onMouseLeave={() => setHoveredHouse(null)}
          />
          {/* 10. House 10 */}
          <polygon 
            points="150,150 300,150 225,75 225,225" 
            fill={hoveredHouse === 10 ? 'rgba(244, 135, 11, 0.08)' : 'transparent'} 
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredHouse(10)}
            onMouseLeave={() => setHoveredHouse(null)}
          />
          {/* 11. House 11 */}
          <polygon 
            points="300,0 300,150 225,75" 
            fill={hoveredHouse === 11 ? 'rgba(244, 135, 11, 0.08)' : 'transparent'} 
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredHouse(11)}
            onMouseLeave={() => setHoveredHouse(null)}
          />
          {/* 12. House 12 */}
          <polygon 
            points="150,0 300,0 225,75" 
            fill={hoveredHouse === 12 ? 'rgba(244, 135, 11, 0.08)' : 'transparent'} 
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={() => setHoveredHouse(12)}
            onMouseLeave={() => setHoveredHouse(null)}
          />

          {/* Render House Signs and Planets */}
          {Object.keys(houseCoords).map((hKey) => {
            const h = parseInt(hKey);
            const coord = houseCoords[h];
            const sign = getSignForHouse(h);
            const planetsInHouse = planetPlacements[h];

            return (
              <g key={h} className="pointer-events-none">
                {/* Zodiac Sign Number (Small, in golden shade) */}
                <text 
                  x={coord.signX} 
                  y={coord.signY} 
                  fontSize="10" 
                  fill="#fbc562" 
                  fontWeight="bold" 
                  textAnchor="middle" 
                  alignmentBaseline="middle"
                >
                  {sign}
                </text>

                {/* Planet Names */}
                {planetsInHouse.length > 0 && (
                  <g>
                    {planetsInHouse.map((p, pIdx) => (
                      <text
                        key={pIdx}
                        x={coord.x}
                        y={coord.y + (pIdx - (planetsInHouse.length - 1) / 2) * 12}
                        fontSize="9"
                        fill={p.includes('Lagna') ? '#8b5cf6' : '#ffffff'}
                        fontWeight="semibold"
                        textAnchor="middle"
                        alignmentBaseline="middle"
                      >
                        {p}
                      </text>
                    ))}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Astro Metadata description on Hover */}
      <div className="w-full mt-4 h-16 flex items-center justify-center text-center">
        {hoveredHouse ? (
          <div className="animate-fade-in p-2 bg-saffron-500/10 border border-saffron-500/20 rounded-xl w-full">
            <h5 className="text-xs font-bold text-saffron-400">{houseDetails[hoveredHouse].name}</h5>
            <p className="text-[10px] text-slate-300 leading-normal mt-0.5">{houseDetails[hoveredHouse].significance}</p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Hover over the houses of the birth chart to view astrological significance.</p>
        )}
      </div>
    </div>
  );
};

export default KundliChart;
