import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
 
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.1,
          }}
        />
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 20,
          }}
        >
          {/* Icon */}
          <div
            style={{
              fontSize: 80,
              marginBottom: 10,
            }}
          >
            🌐
          </div>
          
          {/* Title */}
          <div
            style={{
              fontSize: 60,
              fontWeight: 'bold',
              color: 'white',
              lineHeight: 1.2,
              padding: '0 40px',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Median Age by Country 2026
          </div>
          
          {/* Subtitle */}
          <div
            style={{
              fontSize: 30,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.4,
              padding: '0 60px',
            }}
          >
            World's Oldest & Youngest Populations • Interactive Explorer
          </div>
          
          {/* Stats Grid */}
          <div
            style={{
              display: 'flex',
              gap: 50,
              marginTop: 40,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '20px 30px',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
                Youngest
              </div>
              <div style={{ fontSize: 42, fontWeight: 'bold', color: '#86efac' }}>
                Niger
              </div>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: 'white' }}>
                14.8 yrs
              </div>
            </div>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '20px 30px',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
                World
              </div>
              <div style={{ fontSize: 42, fontWeight: 'bold', color: '#fbbf24' }}>
                Average
              </div>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: 'white' }}>
                32.1 yrs
              </div>
            </div>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '20px 30px',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
                Oldest
              </div>
              <div style={{ fontSize: 42, fontWeight: 'bold', color: '#f87171' }}>
                Japan
              </div>
              <div style={{ fontSize: 36, fontWeight: 'bold', color: 'white' }}>
                48.9 yrs
              </div>
            </div>
          </div>
          
          {/* Website */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              fontSize: 24,
              color: 'rgba(255,255,255,0.8)',
              fontWeight: 'normal',
            }}
          >
            populationpyramids.org
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}