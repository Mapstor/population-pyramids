import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country1 = searchParams.get('country1');
    const country2 = searchParams.get('country2');

    if (!country1 || !country2) {
      return new Response('Missing country parameters', { status: 400 });
    }

    // Map slug to display name
    const countryNames: Record<string, string> = {
      'china': 'China',
      'india': 'India',
      'united-states': 'United States',
      'indonesia': 'Indonesia',
      'pakistan': 'Pakistan',
      'brazil': 'Brazil',
      'nigeria': 'Nigeria',
      'bangladesh': 'Bangladesh',
      'russia': 'Russia',
      'mexico': 'Mexico',
      'japan': 'Japan',
      'philippines': 'Philippines',
      'ethiopia': 'Ethiopia',
      'egypt': 'Egypt',
      'vietnam': 'Vietnam',
      'united-kingdom': 'UK',
      'germany': 'Germany',
      'france': 'France',
      'japan': 'Japan',
      'pakistan': 'Pakistan',
      'bangladesh': 'Bangladesh',
    };

    const country1Name = countryNames[country1] || country1;
    const country2Name = countryNames[country2] || country2;

    // For China vs India, show specific data
    const isChinavsIndia = (country1 === 'china' && country2 === 'india') || 
                          (country1 === 'india' && country2 === 'china');
    
    // For USA vs China comparison
    const isUSAvsChina = (country1 === 'united-states' && country2 === 'china') || 
                        (country1 === 'china' && country2 === 'united-states');
    
    // For USA vs India comparison
    const isUSAvsIndia = (country1 === 'united-states' && country2 === 'india') || 
                        (country1 === 'india' && country2 === 'united-states');
    
    // For USA vs Russia comparison
    const isUSAvsRussia = (country1 === 'united-states' && country2 === 'russia') || 
                         (country1 === 'russia' && country2 === 'united-states');
    
    // For USA vs Brazil comparison
    const isUSAvsBrazil = (country1 === 'united-states' && country2 === 'brazil') || 
                         (country1 === 'brazil' && country2 === 'united-states');
    
    // For USA vs Indonesia comparison
    const isUSAvsIndonesia = (country1 === 'united-states' && country2 === 'indonesia') || 
                            (country1 === 'indonesia' && country2 === 'united-states');
    
    // For India vs Indonesia comparison
    const isIndiavsIndonesia = (country1 === 'india' && country2 === 'indonesia') || 
                              (country1 === 'indonesia' && country2 === 'india');
    
    // For India vs Brazil comparison
    const isIndiavsBrazil = (country1 === 'india' && country2 === 'brazil') || 
                           (country1 === 'brazil' && country2 === 'india');
    
    // For China vs Brazil comparison
    const isChinavsBrazil = (country1 === 'china' && country2 === 'brazil') || 
                           (country1 === 'brazil' && country2 === 'china');
    
    // For USA vs Mexico comparison
    const isUSAvsMexico = (country1 === 'united-states' && country2 === 'mexico') || 
                         (country1 === 'mexico' && country2 === 'united-states');
    
    // For USA vs UK comparison
    const isUSAvsUK = (country1 === 'united-states' && country2 === 'united-kingdom') || 
                     (country1 === 'united-kingdom' && country2 === 'united-states');
    
    // For UK vs Germany comparison
    const isUKvsGermany = (country1 === 'united-kingdom' && country2 === 'germany') || 
                         (country1 === 'germany' && country2 === 'united-kingdom');
    
    // For UK vs France comparison
    const isUKvsFrance = (country1 === 'united-kingdom' && country2 === 'france') || 
                        (country1 === 'france' && country2 === 'united-kingdom');
    
    // For Japan vs Germany comparison
    const isJapanvsGermany = (country1 === 'japan' && country2 === 'germany') || 
                            (country1 === 'germany' && country2 === 'japan');
    
    // For India vs Pakistan comparison
    const isIndiavsPakistan = (country1 === 'india' && country2 === 'pakistan') || 
                             (country1 === 'pakistan' && country2 === 'india');
    
    // For India vs Bangladesh comparison
    const isIndiavsBangladesh = (country1 === 'india' && country2 === 'bangladesh') || 
                               (country1 === 'bangladesh' && country2 === 'india');
    
    // Real 2025 data
    const chinaData = {
      total: '1.42B',
      youth: '15.4%',
      elderly: '14.9%',
      median: '41.1'
    };
    const indiaData = {
      total: '1.46B',
      youth: '24.2%',
      elderly: '7.4%',
      median: '29.8'
    };
    const usaData = {
      total: '347M',
      youth: '17.9%',
      elderly: '18.2%',
      median: '39.5'
    };
    const russiaData = {
      total: '144M',
      youth: '18.1%',
      elderly: '16.7%',
      median: '41.4'
    };
    const brazilData = {
      total: '213M',
      youth: '19.4%',
      elderly: '11.5%',
      median: '35.8'
    };
    const indonesiaData = {
      total: '286M',
      youth: '24.2%',
      elderly: '7.5%',
      median: '31.4'
    };
    const mexicoData = {
      total: '133M',
      youth: '23.1%',
      elderly: '8.9%',
      median: '32.7'
    };
    const ukData = {
      total: '67M',
      youth: '17.6%',
      elderly: '19.0%',
      median: '40.8'
    };
    const germanyData = {
      total: '84M',
      youth: '14.1%',
      elderly: '22.8%',
      median: '47.8'
    };
    const franceData = {
      total: '68M',
      youth: '17.3%',
      elderly: '21.3%',
      median: '42.9'
    };
    const japanData = {
      total: '123M',
      youth: '11.6%',
      elderly: '30.0%',
      median: '49.5'
    };
    const pakistanData = {
      total: '251M',
      youth: '34.2%',
      elderly: '4.8%',
      median: '23.5'
    };
    const bangladeshData = {
      total: '174M',
      youth: '26.5%',
      elderly: '6.2%',
      median: '28.6'
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Main Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '95%',
              height: '95%',
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '40px',
            }}
          >
            {/* Title */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '28px', color: '#64748b', margin: '0 0 8px 0', fontWeight: '500' }}>
                Population Pyramids 2025 - Side by Side
              </h2>
              <h1 style={{ fontSize: '56px', fontWeight: 'bold', margin: '0', color: '#0f172a' }}>
                {country1Name} vs {country2Name}
              </h1>
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'flex', width: '100%', gap: '60px', alignItems: 'center', flex: 1 }}>
              
              {/* Left Pyramid - China */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#3b82f6', margin: '0 0 8px 0' }}>
                    {country1Name === 'China' ? chinaData.total : 
                     country1Name === 'India' ? indiaData.total : 
                     country1Name === 'United States' ? usaData.total : 
                     country1Name === 'Russia' ? russiaData.total :
                     country1Name === 'Brazil' ? brazilData.total :
                     country1Name === 'Indonesia' ? indonesiaData.total :
                     country1Name === 'Mexico' ? mexicoData.total :
                     country1Name === 'UK' ? ukData.total :
                     country1Name === 'Germany' ? germanyData.total :
                     country1Name === 'France' ? franceData.total :
                     country1Name === 'Japan' ? japanData.total :
                     country1Name === 'Pakistan' ? pakistanData.total :
                     country1Name === 'Bangladesh' ? bangladeshData.total : ''}
                  </h3>
                  <p style={{ fontSize: '24px', color: '#334155', margin: 0, fontWeight: '600' }}>
                    {country1Name}
                  </p>
                </div>
                
                {/* Pyramid Shape for Country 1 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '280px' }}>
                  {(isChinavsIndia || isUSAvsChina || isUSAvsIndia || isUSAvsRussia || isUSAvsBrazil || isUSAvsIndonesia || isIndiavsIndonesia || isIndiavsBrazil || isChinavsBrazil) && country1 === 'china' ? (
                    // China pyramid - narrow base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.2 }} />
                      <div style={{ width: '80px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.3 }} />
                      <div style={{ width: '100px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.4 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.5 }} />
                      <div style={{ width: '180px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.6 }} />
                      <div style={{ width: '200px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.7 }} />
                      <div style={{ width: '160px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.8 }} />
                      <div style={{ width: '120px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.9 }} />
                    </div>
                  ) : (isChinavsIndia || isUSAvsIndia || isIndiavsIndonesia || isIndiavsBrazil || isIndiavsPakistan || isIndiavsBangladesh) && country1 === 'india' ? (
                    // India pyramid - wider base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '30px', backgroundColor: '#10b981', opacity: 0.2 }} />
                      <div style={{ width: '60px', height: '30px', backgroundColor: '#10b981', opacity: 0.3 }} />
                      <div style={{ width: '90px', height: '30px', backgroundColor: '#10b981', opacity: 0.4 }} />
                      <div style={{ width: '120px', height: '30px', backgroundColor: '#10b981', opacity: 0.5 }} />
                      <div style={{ width: '160px', height: '30px', backgroundColor: '#10b981', opacity: 0.6 }} />
                      <div style={{ width: '200px', height: '30px', backgroundColor: '#10b981', opacity: 0.7 }} />
                      <div style={{ width: '240px', height: '30px', backgroundColor: '#10b981', opacity: 0.8 }} />
                      <div style={{ width: '280px', height: '30px', backgroundColor: '#10b981', opacity: 0.9 }} />
                    </div>
                  ) : (isUSAvsChina || isUSAvsIndia || isUSAvsRussia || isUSAvsBrazil || isUSAvsIndonesia || isUSAvsMexico || isUSAvsUK) && country1 === 'united-states' ? (
                    // USA pyramid - relatively balanced
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '80px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.2 }} />
                      <div style={{ width: '100px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.3 }} />
                      <div style={{ width: '120px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.4 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.5 }} />
                      <div style={{ width: '160px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.6 }} />
                      <div style={{ width: '180px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.7 }} />
                      <div style={{ width: '170px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.8 }} />
                      <div style={{ width: '160px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.9 }} />
                    </div>
                  ) : isUSAvsRussia && country1 === 'russia' ? (
                    // Russia pyramid - narrow base, missing males
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '50px', height: '30px', backgroundColor: '#ef4444', opacity: 0.2 }} />
                      <div style={{ width: '70px', height: '30px', backgroundColor: '#ef4444', opacity: 0.3 }} />
                      <div style={{ width: '90px', height: '30px', backgroundColor: '#ef4444', opacity: 0.4 }} />
                      <div style={{ width: '120px', height: '30px', backgroundColor: '#ef4444', opacity: 0.5 }} />
                      <div style={{ width: '150px', height: '30px', backgroundColor: '#ef4444', opacity: 0.6 }} />
                      <div style={{ width: '170px', height: '30px', backgroundColor: '#ef4444', opacity: 0.7 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#ef4444', opacity: 0.8 }} />
                      <div style={{ width: '110px', height: '30px', backgroundColor: '#ef4444', opacity: 0.9 }} />
                    </div>
                  ) : (isUSAvsBrazil || isIndiavsBrazil || isChinavsBrazil) && country1 === 'brazil' ? (
                    // Brazil pyramid - younger population, moderate base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '30px', backgroundColor: '#10b981', opacity: 0.2 }} />
                      <div style={{ width: '85px', height: '30px', backgroundColor: '#10b981', opacity: 0.3 }} />
                      <div style={{ width: '110px', height: '30px', backgroundColor: '#10b981', opacity: 0.4 }} />
                      <div style={{ width: '135px', height: '30px', backgroundColor: '#10b981', opacity: 0.5 }} />
                      <div style={{ width: '165px', height: '30px', backgroundColor: '#10b981', opacity: 0.6 }} />
                      <div style={{ width: '190px', height: '30px', backgroundColor: '#10b981', opacity: 0.7 }} />
                      <div style={{ width: '200px', height: '30px', backgroundColor: '#10b981', opacity: 0.8 }} />
                      <div style={{ width: '180px', height: '30px', backgroundColor: '#10b981', opacity: 0.9 }} />
                    </div>
                  ) : (isUSAvsIndonesia || isIndiavsIndonesia) && country1 === 'indonesia' ? (
                    // Indonesia pyramid - very young population, wide base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '50px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.2 }} />
                      <div style={{ width: '75px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.3 }} />
                      <div style={{ width: '105px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.4 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.5 }} />
                      <div style={{ width: '175px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.6 }} />
                      <div style={{ width: '210px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.7 }} />
                      <div style={{ width: '240px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.8 }} />
                      <div style={{ width: '270px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.9 }} />
                    </div>
                  ) : isUSAvsMexico && country1 === 'mexico' ? (
                    // Mexico pyramid - young population with moderate base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '55px', height: '30px', backgroundColor: '#10b981', opacity: 0.2 }} />
                      <div style={{ width: '80px', height: '30px', backgroundColor: '#10b981', opacity: 0.3 }} />
                      <div style={{ width: '110px', height: '30px', backgroundColor: '#10b981', opacity: 0.4 }} />
                      <div style={{ width: '145px', height: '30px', backgroundColor: '#10b981', opacity: 0.5 }} />
                      <div style={{ width: '180px', height: '30px', backgroundColor: '#10b981', opacity: 0.6 }} />
                      <div style={{ width: '210px', height: '30px', backgroundColor: '#10b981', opacity: 0.7 }} />
                      <div style={{ width: '240px', height: '30px', backgroundColor: '#10b981', opacity: 0.8 }} />
                      <div style={{ width: '265px', height: '30px', backgroundColor: '#10b981', opacity: 0.9 }} />
                    </div>
                  ) : (isUSAvsUK || isUKvsGermany || isUKvsFrance) && country1 === 'united-kingdom' ? (
                    // UK pyramid - aging population, narrowing base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '70px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.2 }} />
                      <div style={{ width: '90px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.3 }} />
                      <div style={{ width: '115px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.4 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.5 }} />
                      <div style={{ width: '165px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.6 }} />
                      <div style={{ width: '180px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.7 }} />
                      <div style={{ width: '170px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.8 }} />
                      <div style={{ width: '150px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.9 }} />
                    </div>
                  ) : isUKvsFrance && country1 === 'france' ? (
                    // France pyramid - aging population, moderate base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '75px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.2 }} />
                      <div style={{ width: '95px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.3 }} />
                      <div style={{ width: '120px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.4 }} />
                      <div style={{ width: '145px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.5 }} />
                      <div style={{ width: '170px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.6 }} />
                      <div style={{ width: '185px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.7 }} />
                      <div style={{ width: '175px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.8 }} />
                      <div style={{ width: '155px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.9 }} />
                    </div>
                  ) : isJapanvsGermany && country1 === 'japan' ? (
                    // Japan pyramid - extremely aging population, very narrow base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '50px', height: '30px', backgroundColor: '#ef4444', opacity: 0.2 }} />
                      <div style={{ width: '65px', height: '30px', backgroundColor: '#ef4444', opacity: 0.3 }} />
                      <div style={{ width: '80px', height: '30px', backgroundColor: '#ef4444', opacity: 0.4 }} />
                      <div style={{ width: '100px', height: '30px', backgroundColor: '#ef4444', opacity: 0.5 }} />
                      <div style={{ width: '130px', height: '30px', backgroundColor: '#ef4444', opacity: 0.6 }} />
                      <div style={{ width: '150px', height: '30px', backgroundColor: '#ef4444', opacity: 0.7 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#ef4444', opacity: 0.8 }} />
                      <div style={{ width: '120px', height: '30px', backgroundColor: '#ef4444', opacity: 0.9 }} />
                    </div>
                  ) : isIndiavsPakistan && country1 === 'pakistan' ? (
                    // Pakistan pyramid - very young population, very wide base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '45px', height: '30px', backgroundColor: '#10b981', opacity: 0.2 }} />
                      <div style={{ width: '70px', height: '30px', backgroundColor: '#10b981', opacity: 0.3 }} />
                      <div style={{ width: '100px', height: '30px', backgroundColor: '#10b981', opacity: 0.4 }} />
                      <div style={{ width: '135px', height: '30px', backgroundColor: '#10b981', opacity: 0.5 }} />
                      <div style={{ width: '170px', height: '30px', backgroundColor: '#10b981', opacity: 0.6 }} />
                      <div style={{ width: '200px', height: '30px', backgroundColor: '#10b981', opacity: 0.7 }} />
                      <div style={{ width: '240px', height: '30px', backgroundColor: '#10b981', opacity: 0.8 }} />
                      <div style={{ width: '280px', height: '30px', backgroundColor: '#10b981', opacity: 0.9 }} />
                    </div>
                  ) : isIndiavsBangladesh && country1 === 'bangladesh' ? (
                    // Bangladesh pyramid - young population, wide base but transitioning
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '55px', height: '30px', backgroundColor: '#10b981', opacity: 0.2 }} />
                      <div style={{ width: '80px', height: '30px', backgroundColor: '#10b981', opacity: 0.3 }} />
                      <div style={{ width: '110px', height: '30px', backgroundColor: '#10b981', opacity: 0.4 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#10b981', opacity: 0.5 }} />
                      <div style={{ width: '175px', height: '30px', backgroundColor: '#10b981', opacity: 0.6 }} />
                      <div style={{ width: '200px', height: '30px', backgroundColor: '#10b981', opacity: 0.7 }} />
                      <div style={{ width: '220px', height: '30px', backgroundColor: '#10b981', opacity: 0.8 }} />
                      <div style={{ width: '240px', height: '30px', backgroundColor: '#10b981', opacity: 0.9 }} />
                    </div>
                  ) : (isUKvsGermany || isJapanvsGermany) && country1 === 'germany' ? (
                    // Germany pyramid - very aging population, narrow base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.2 }} />
                      <div style={{ width: '75px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.3 }} />
                      <div style={{ width: '95px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.4 }} />
                      <div style={{ width: '120px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.5 }} />
                      <div style={{ width: '145px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.6 }} />
                      <div style={{ width: '165px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.7 }} />
                      <div style={{ width: '160px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.8 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.9 }} />
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Center Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: '2px solid #e2e8f0', paddingBottom: '20px' }}>
                  <p style={{ fontSize: '18px', color: '#64748b', margin: '0 0 8px 0' }}>Total Population</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}>
                      {country1 === 'china' ? chinaData.total : 
                       country1 === 'india' ? indiaData.total : 
                       country1 === 'united-states' ? usaData.total : 
                       country1 === 'russia' ? russiaData.total :
                       country1 === 'brazil' ? brazilData.total :
                       country1 === 'indonesia' ? indonesiaData.total :
                       country1 === 'mexico' ? mexicoData.total :
                       country1 === 'united-kingdom' ? ukData.total :
                       country1 === 'germany' ? germanyData.total :
                       country1 === 'france' ? franceData.total :
                       country1 === 'japan' ? japanData.total :
                       country1 === 'pakistan' ? pakistanData.total :
                       country1 === 'bangladesh' ? bangladeshData.total : ''}
                    </span>
                    <span style={{ fontSize: '20px', color: '#94a3b8' }}>vs</span>
                    <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}>
                      {country2 === 'india' ? indiaData.total : 
                       country2 === 'china' ? chinaData.total : 
                       country2 === 'united-states' ? usaData.total : 
                       country2 === 'russia' ? russiaData.total :
                       country2 === 'brazil' ? brazilData.total :
                       country2 === 'indonesia' ? indonesiaData.total :
                       country2 === 'mexico' ? mexicoData.total :
                       country2 === 'united-kingdom' ? ukData.total :
                       country2 === 'germany' ? germanyData.total :
                       country2 === 'france' ? franceData.total :
                       country2 === 'japan' ? japanData.total :
                       country2 === 'pakistan' ? pakistanData.total :
                       country2 === 'bangladesh' ? bangladeshData.total : ''}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <p style={{ fontSize: '18px', color: '#64748b', margin: '0 0 8px 0' }}>Youth (0-14)</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                      {country1 === 'china' ? chinaData.youth : 
                       country1 === 'india' ? indiaData.youth : 
                       country1 === 'united-states' ? usaData.youth : 
                       country1 === 'russia' ? russiaData.youth :
                       country1 === 'brazil' ? brazilData.youth :
                       country1 === 'indonesia' ? indonesiaData.youth :
                       country1 === 'mexico' ? mexicoData.youth :
                       country1 === 'united-kingdom' ? ukData.youth :
                       country1 === 'germany' ? germanyData.youth :
                       country1 === 'france' ? franceData.youth :
                       country1 === 'japan' ? japanData.youth :
                       country1 === 'pakistan' ? pakistanData.youth :
                       country1 === 'bangladesh' ? bangladeshData.youth : ''}
                    </span>
                    <span style={{ fontSize: '18px', color: '#94a3b8' }}>vs</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                      {country2 === 'india' ? indiaData.youth : 
                       country2 === 'china' ? chinaData.youth : 
                       country2 === 'united-states' ? usaData.youth : 
                       country2 === 'russia' ? russiaData.youth :
                       country2 === 'brazil' ? brazilData.youth :
                       country2 === 'indonesia' ? indonesiaData.youth :
                       country2 === 'mexico' ? mexicoData.youth :
                       country2 === 'united-kingdom' ? ukData.youth :
                       country2 === 'germany' ? germanyData.youth :
                       country2 === 'france' ? franceData.youth :
                       country2 === 'japan' ? japanData.youth :
                       country2 === 'pakistan' ? pakistanData.youth :
                       country2 === 'bangladesh' ? bangladeshData.youth : ''}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <p style={{ fontSize: '18px', color: '#64748b', margin: '0 0 8px 0' }}>Elderly (65+)</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                      {country1 === 'china' ? chinaData.elderly : 
                       country1 === 'india' ? indiaData.elderly : 
                       country1 === 'united-states' ? usaData.elderly : 
                       country1 === 'russia' ? russiaData.elderly :
                       country1 === 'brazil' ? brazilData.elderly :
                       country1 === 'indonesia' ? indonesiaData.elderly :
                       country1 === 'mexico' ? mexicoData.elderly :
                       country1 === 'united-kingdom' ? ukData.elderly :
                       country1 === 'germany' ? germanyData.elderly :
                       country1 === 'france' ? franceData.elderly :
                       country1 === 'japan' ? japanData.elderly :
                       country1 === 'pakistan' ? pakistanData.elderly :
                       country1 === 'bangladesh' ? bangladeshData.elderly : ''}
                    </span>
                    <span style={{ fontSize: '18px', color: '#94a3b8' }}>vs</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                      {country2 === 'india' ? indiaData.elderly : 
                       country2 === 'china' ? chinaData.elderly : 
                       country2 === 'united-states' ? usaData.elderly : 
                       country2 === 'russia' ? russiaData.elderly :
                       country2 === 'brazil' ? brazilData.elderly :
                       country2 === 'indonesia' ? indonesiaData.elderly :
                       country2 === 'mexico' ? mexicoData.elderly :
                       country2 === 'united-kingdom' ? ukData.elderly :
                       country2 === 'germany' ? germanyData.elderly :
                       country2 === 'france' ? franceData.elderly :
                       country2 === 'japan' ? japanData.elderly :
                       country2 === 'pakistan' ? pakistanData.elderly :
                       country2 === 'bangladesh' ? bangladeshData.elderly : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Pyramid - India */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981', margin: '0 0 8px 0' }}>
                    {country2Name === 'India' ? indiaData.total : 
                     country2Name === 'China' ? chinaData.total : 
                     country2Name === 'United States' ? usaData.total : 
                     country2Name === 'Russia' ? russiaData.total :
                     country2Name === 'Brazil' ? brazilData.total :
                     country2Name === 'Indonesia' ? indonesiaData.total :
                     country2Name === 'Mexico' ? mexicoData.total :
                     country2Name === 'UK' ? ukData.total :
                     country2Name === 'Germany' ? germanyData.total :
                     country2Name === 'France' ? franceData.total :
                     country2Name === 'Japan' ? japanData.total :
                     country2Name === 'Pakistan' ? pakistanData.total :
                     country2Name === 'Bangladesh' ? bangladeshData.total : ''}
                  </h3>
                  <p style={{ fontSize: '24px', color: '#334155', margin: 0, fontWeight: '600' }}>
                    {country2Name}
                  </p>
                </div>
                
                {/* Pyramid Shape for Country 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '280px' }}>
                  {(isChinavsIndia || isUSAvsChina || isUSAvsIndia || isIndiavsIndonesia || isIndiavsBrazil || isIndiavsPakistan || isIndiavsBangladesh) && country2 === 'india' ? (
                    // India pyramid - wider base  
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '40px', height: '30px', backgroundColor: '#10b981', opacity: 0.2 }} />
                      <div style={{ width: '60px', height: '30px', backgroundColor: '#10b981', opacity: 0.3 }} />
                      <div style={{ width: '90px', height: '30px', backgroundColor: '#10b981', opacity: 0.4 }} />
                      <div style={{ width: '120px', height: '30px', backgroundColor: '#10b981', opacity: 0.5 }} />
                      <div style={{ width: '160px', height: '30px', backgroundColor: '#10b981', opacity: 0.6 }} />
                      <div style={{ width: '200px', height: '30px', backgroundColor: '#10b981', opacity: 0.7 }} />
                      <div style={{ width: '240px', height: '30px', backgroundColor: '#10b981', opacity: 0.8 }} />
                      <div style={{ width: '280px', height: '30px', backgroundColor: '#10b981', opacity: 0.9 }} />
                    </div>
                  ) : (isChinavsIndia || isUSAvsChina || isChinavsBrazil) && country2 === 'china' ? (
                    // China pyramid - narrow base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.2 }} />
                      <div style={{ width: '80px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.3 }} />
                      <div style={{ width: '100px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.4 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.5 }} />
                      <div style={{ width: '180px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.6 }} />
                      <div style={{ width: '200px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.7 }} />
                      <div style={{ width: '160px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.8 }} />
                      <div style={{ width: '120px', height: '30px', backgroundColor: '#3b82f6', opacity: 0.9 }} />
                    </div>
                  ) : isUSAvsRussia && country2 === 'russia' ? (
                    // Russia pyramid - narrow base, missing males
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '50px', height: '30px', backgroundColor: '#ef4444', opacity: 0.2 }} />
                      <div style={{ width: '70px', height: '30px', backgroundColor: '#ef4444', opacity: 0.3 }} />
                      <div style={{ width: '90px', height: '30px', backgroundColor: '#ef4444', opacity: 0.4 }} />
                      <div style={{ width: '120px', height: '30px', backgroundColor: '#ef4444', opacity: 0.5 }} />
                      <div style={{ width: '150px', height: '30px', backgroundColor: '#ef4444', opacity: 0.6 }} />
                      <div style={{ width: '170px', height: '30px', backgroundColor: '#ef4444', opacity: 0.7 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#ef4444', opacity: 0.8 }} />
                      <div style={{ width: '110px', height: '30px', backgroundColor: '#ef4444', opacity: 0.9 }} />
                    </div>
                  ) : (isUSAvsBrazil || isIndiavsBrazil || isChinavsBrazil) && country2 === 'brazil' ? (
                    // Brazil pyramid - younger population, moderate base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '30px', backgroundColor: '#10b981', opacity: 0.2 }} />
                      <div style={{ width: '85px', height: '30px', backgroundColor: '#10b981', opacity: 0.3 }} />
                      <div style={{ width: '110px', height: '30px', backgroundColor: '#10b981', opacity: 0.4 }} />
                      <div style={{ width: '135px', height: '30px', backgroundColor: '#10b981', opacity: 0.5 }} />
                      <div style={{ width: '165px', height: '30px', backgroundColor: '#10b981', opacity: 0.6 }} />
                      <div style={{ width: '190px', height: '30px', backgroundColor: '#10b981', opacity: 0.7 }} />
                      <div style={{ width: '200px', height: '30px', backgroundColor: '#10b981', opacity: 0.8 }} />
                      <div style={{ width: '180px', height: '30px', backgroundColor: '#10b981', opacity: 0.9 }} />
                    </div>
                  ) : (isUSAvsIndonesia || isIndiavsIndonesia) && country2 === 'indonesia' ? (
                    // Indonesia pyramid - very young population, wide base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '50px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.2 }} />
                      <div style={{ width: '75px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.3 }} />
                      <div style={{ width: '105px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.4 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.5 }} />
                      <div style={{ width: '175px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.6 }} />
                      <div style={{ width: '210px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.7 }} />
                      <div style={{ width: '240px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.8 }} />
                      <div style={{ width: '270px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.9 }} />
                    </div>
                  ) : isUSAvsMexico && country2 === 'mexico' ? (
                    // Mexico pyramid - young population with moderate base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '55px', height: '30px', backgroundColor: '#10b981', opacity: 0.2 }} />
                      <div style={{ width: '80px', height: '30px', backgroundColor: '#10b981', opacity: 0.3 }} />
                      <div style={{ width: '110px', height: '30px', backgroundColor: '#10b981', opacity: 0.4 }} />
                      <div style={{ width: '145px', height: '30px', backgroundColor: '#10b981', opacity: 0.5 }} />
                      <div style={{ width: '180px', height: '30px', backgroundColor: '#10b981', opacity: 0.6 }} />
                      <div style={{ width: '210px', height: '30px', backgroundColor: '#10b981', opacity: 0.7 }} />
                      <div style={{ width: '240px', height: '30px', backgroundColor: '#10b981', opacity: 0.8 }} />
                      <div style={{ width: '265px', height: '30px', backgroundColor: '#10b981', opacity: 0.9 }} />
                    </div>
                  ) : isUSAvsUK && country2 === 'united-kingdom' ? (
                    // UK pyramid - aging population, narrowing base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '70px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.2 }} />
                      <div style={{ width: '90px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.3 }} />
                      <div style={{ width: '115px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.4 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.5 }} />
                      <div style={{ width: '165px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.6 }} />
                      <div style={{ width: '180px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.7 }} />
                      <div style={{ width: '170px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.8 }} />
                      <div style={{ width: '150px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.9 }} />
                    </div>
                  ) : isJapanvsGermany && country2 === 'japan' ? (
                    // Japan pyramid - extremely aging population, very narrow base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '50px', height: '30px', backgroundColor: '#ef4444', opacity: 0.2 }} />
                      <div style={{ width: '65px', height: '30px', backgroundColor: '#ef4444', opacity: 0.3 }} />
                      <div style={{ width: '80px', height: '30px', backgroundColor: '#ef4444', opacity: 0.4 }} />
                      <div style={{ width: '100px', height: '30px', backgroundColor: '#ef4444', opacity: 0.5 }} />
                      <div style={{ width: '130px', height: '30px', backgroundColor: '#ef4444', opacity: 0.6 }} />
                      <div style={{ width: '150px', height: '30px', backgroundColor: '#ef4444', opacity: 0.7 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#ef4444', opacity: 0.8 }} />
                      <div style={{ width: '120px', height: '30px', backgroundColor: '#ef4444', opacity: 0.9 }} />
                    </div>
                  ) : isIndiavsPakistan && country2 === 'pakistan' ? (
                    // Pakistan pyramid - very young population, very wide base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '45px', height: '30px', backgroundColor: '#10b981', opacity: 0.2 }} />
                      <div style={{ width: '70px', height: '30px', backgroundColor: '#10b981', opacity: 0.3 }} />
                      <div style={{ width: '100px', height: '30px', backgroundColor: '#10b981', opacity: 0.4 }} />
                      <div style={{ width: '135px', height: '30px', backgroundColor: '#10b981', opacity: 0.5 }} />
                      <div style={{ width: '170px', height: '30px', backgroundColor: '#10b981', opacity: 0.6 }} />
                      <div style={{ width: '200px', height: '30px', backgroundColor: '#10b981', opacity: 0.7 }} />
                      <div style={{ width: '240px', height: '30px', backgroundColor: '#10b981', opacity: 0.8 }} />
                      <div style={{ width: '280px', height: '30px', backgroundColor: '#10b981', opacity: 0.9 }} />
                    </div>
                  ) : isIndiavsBangladesh && country2 === 'bangladesh' ? (
                    // Bangladesh pyramid - young population, wide base but transitioning
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '55px', height: '30px', backgroundColor: '#10b981', opacity: 0.2 }} />
                      <div style={{ width: '80px', height: '30px', backgroundColor: '#10b981', opacity: 0.3 }} />
                      <div style={{ width: '110px', height: '30px', backgroundColor: '#10b981', opacity: 0.4 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#10b981', opacity: 0.5 }} />
                      <div style={{ width: '175px', height: '30px', backgroundColor: '#10b981', opacity: 0.6 }} />
                      <div style={{ width: '200px', height: '30px', backgroundColor: '#10b981', opacity: 0.7 }} />
                      <div style={{ width: '220px', height: '30px', backgroundColor: '#10b981', opacity: 0.8 }} />
                      <div style={{ width: '240px', height: '30px', backgroundColor: '#10b981', opacity: 0.9 }} />
                    </div>
                  ) : (isUKvsGermany || isJapanvsGermany) && country2 === 'germany' ? (
                    // Germany pyramid - very aging population, narrow base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '60px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.2 }} />
                      <div style={{ width: '75px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.3 }} />
                      <div style={{ width: '95px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.4 }} />
                      <div style={{ width: '120px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.5 }} />
                      <div style={{ width: '145px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.6 }} />
                      <div style={{ width: '165px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.7 }} />
                      <div style={{ width: '160px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.8 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#f59e0b', opacity: 0.9 }} />
                    </div>
                  ) : isUKvsFrance && country2 === 'france' ? (
                    // France pyramid - aging population, moderate base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '75px', height: '30px', backgroundColor: '#10b981', opacity: 0.2 }} />
                      <div style={{ width: '95px', height: '30px', backgroundColor: '#10b981', opacity: 0.3 }} />
                      <div style={{ width: '120px', height: '30px', backgroundColor: '#10b981', opacity: 0.4 }} />
                      <div style={{ width: '145px', height: '30px', backgroundColor: '#10b981', opacity: 0.5 }} />
                      <div style={{ width: '170px', height: '30px', backgroundColor: '#10b981', opacity: 0.6 }} />
                      <div style={{ width: '185px', height: '30px', backgroundColor: '#10b981', opacity: 0.7 }} />
                      <div style={{ width: '175px', height: '30px', backgroundColor: '#10b981', opacity: 0.8 }} />
                      <div style={{ width: '155px', height: '30px', backgroundColor: '#10b981', opacity: 0.9 }} />
                    </div>
                  ) : (isUSAvsUK || isUKvsGermany || isUKvsFrance) && country2 === 'united-kingdom' ? (
                    // UK pyramid - aging population, narrowing base
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '70px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.2 }} />
                      <div style={{ width: '90px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.3 }} />
                      <div style={{ width: '115px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.4 }} />
                      <div style={{ width: '140px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.5 }} />
                      <div style={{ width: '165px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.6 }} />
                      <div style={{ width: '180px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.7 }} />
                      <div style={{ width: '170px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.8 }} />
                      <div style={{ width: '150px', height: '30px', backgroundColor: '#8b5cf6', opacity: 0.9 }} />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>


            {/* Footer */}
            <div
              style={{
                marginTop: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                borderTop: '2px solid #e2e8f0',
                paddingTop: '16px',
                width: '100%',
              }}
            >
              <p style={{ fontSize: '20px', color: '#64748b', fontWeight: '600' }}>
                PopulationPyramids.org
              </p>
              <span style={{ fontSize: '20px', color: '#cbd5e1' }}>|</span>
              <p style={{ fontSize: '18px', color: '#64748b' }}>
                UN World Population Prospects 2025
              </p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}