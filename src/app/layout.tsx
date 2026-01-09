import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import GoogleAnalytics from '@/components/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Population Pyramids - Interactive Demographics for 195 Countries',
    template: '%s | Population Pyramids'
  },
  description: 'Explore interactive population pyramids for 195 countries from 1950-2025. Analyze age distribution, demographic trends, and population data with real UN World Population Prospects 2024.',
  keywords: ['population pyramid', 'demographics', 'population data', 'UN data', 'age structure', 'demographic analysis', 'population statistics', 'world population', 'population growth', 'demographic transition'],
  authors: [{ name: 'Population Pyramids' }],
  creator: 'Population Pyramids',
  publisher: 'Population Pyramids',
  metadataBase: new URL('https://populationpyramids.org'),
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://populationpyramids.org',
    title: 'Population Pyramids - Interactive Demographics for 195 Countries',
    description: 'Explore interactive population pyramids for 195 countries from 1950-2025. Analyze age distribution, demographic trends, and population data with real UN World Population Prospects 2024.',
    siteName: 'Population Pyramids',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Population Pyramids - Interactive demographic visualization platform showing age structure charts',
        type: 'image/png',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Population Pyramids - Interactive Demographics for 195 Countries',
    description: 'Explore interactive population pyramids for 195 countries from 1950-2025. Real UN demographic data visualization.',
    images: ['/og-image.png'],
    creator: '@populationpyramids',
    site: '@populationpyramids',
  },
  
  // Additional SEO
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: 'google12f8c2f9c03913a3',
    other: {
      'msvalidate.01': '57C407E8336C4915E2D28EEA649C8078'
    }
  },
  
  category: 'education',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Clarity tracking code for https://www.populationpyramids.org/ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "uakgabnpiz");
            `,
          }}
        />
        
        {/* AdThrive Head Tag Manual */}
        <script 
          data-no-optimize="1" 
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w, d) {
                  w.adthrive = w.adthrive || {};
                  w.adthrive.cmd = w.adthrive.cmd || [];
                  w.adthrive.plugin = 'adthrive-ads-manual';
                  w.adthrive.host = 'ads.adthrive.com';
                  var s = d.createElement('script');
                  s.async = true;
                  s.referrerpolicy='no-referrer-when-downgrade';
                  s.src = 'https://' + w.adthrive.host + '/sites/6945a10f5d76f536610a0994/ads.min.js?referrer=' + w.encodeURIComponent(w.location.href) + '&cb=' + (Math.floor(Math.random() * 100) + 1);
                  var n = d.getElementsByTagName('script')[0];
                  n.parentNode.insertBefore(s, n);
              })(window, document);
            `,
          }}
        />
        {/* End of AdThrive Head Tag */}
        
        {/* START email detection/removal script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(){"use strict";const t={adt_ei:{identityApiKey:"plainText",source:"url",type:"plaintext",priority:1},adt_eih:{identityApiKey:"sha256",source:"urlh",type:"hashed",priority:2},sh_kit:{identityApiKey:"sha256",source:"urlhck",type:"hashed",priority:3}},e=Object.keys(t);function i(t){return function(t){const e=t.match(/((?=([a-z0-9._!#$%+^&*()[\]<>-]+))\2@[a-z0-9._-]+\.[a-z0-9._-]+)/gi);return e?e[0]:""}(function(t){return t.replace(/\s/g,"")}(t.toLowerCase()))}!async function(){const n=new URL(window.location.href),o=n.searchParams;let a=null;const r=Object.entries(t).sort(([,t],[,e])=>t.priority-e.priority).map(([t])=>t);for(const e of r){const n=o.get(e),r=t[e];if(!n||!r)continue;const c=decodeURIComponent(n),d="plaintext"===r.type&&i(c),s="hashed"===r.type&&c;if(d||s){a={value:c,config:r};break}}if(a){const{value:t,config:e}=a;window.adthrive=window.adthrive||{},window.adthrive.cmd=window.adthrive.cmd||[],window.adthrive.cmd.push(function(){window.adthrive.identityApi({source:e.source,[e.identityApiKey]:t},({success:i,data:n})=>{i?window.adthrive.log("info","Plugin","detectEmails",\`Identity API called with \${e.type} email: \${t}\`,n):window.adthrive.log("warning","Plugin","detectEmails",\`Failed to call Identity API with \${e.type} email: \${t}\`,n)})})}!function(t,e){const i=new URL(e);t.forEach(t=>i.searchParams.delete(t)),history.replaceState(null,"",i.toString())}(e,n)}()}();
            `,
          }}
        />
        {/* END email detection/removal script */}
      </head>
      <body className={inter.className}>
        <GoogleAnalytics measurementId="G-HXTB2KJ9X6" />
        
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <Header />
          
          <main className="flex-grow overflow-x-hidden">
            {children}
          </main>
          
          <footer className="bg-gray-900 text-gray-300 mt-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                {/* Brand */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="font-bold text-white">PopulationPyramids</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Interactive demographic visualizations based on United Nations data.
                  </p>
                </div>

                {/* Browse */}
                <div>
                  <h3 className="font-semibold text-white mb-4">Browse</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/" className="text-gray-400 hover:text-white transition">All Countries</a></li>
                    <li><a href="/compare" className="text-gray-400 hover:text-white transition">Compare</a></li>
                    <li><a href="/search" className="text-gray-400 hover:text-white transition">Search</a></li>
                    <li><a href="/about" className="text-gray-400 hover:text-white transition">About</a></li>
                    <li><a href="/sitemap.xml" className="text-gray-400 hover:text-white transition">Sitemap</a></li>
                  </ul>
                </div>

                {/* Popular */}
                <div>
                  <h3 className="font-semibold text-white mb-4">Popular</h3>
                  <ul className="space-y-2 text-sm">
                    <li><a href="/united-states" className="text-gray-400 hover:text-white transition">United States</a></li>
                    <li><a href="/china" className="text-gray-400 hover:text-white transition">China</a></li>
                    <li><a href="/india" className="text-gray-400 hover:text-white transition">India</a></li>
                    <li><a href="/japan" className="text-gray-400 hover:text-white transition">Japan</a></li>
                  </ul>
                </div>

                {/* Data Source */}
                <div>
                  <h3 className="font-semibold text-white mb-4">Data Source</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    UN World Population Prospects 2024 Revision
                  </p>
                  <a 
                    href="https://population.un.org/wpp/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 transition inline-flex items-center"
                  >
                    Visit UN Database
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Bottom */}
              <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} PopulationPyramids. Data licensed under Creative Commons.
                </p>
                <div className="flex items-center space-x-6 mt-4 md:mt-0">
                  <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-300 transition">Privacy</a>
                  <a href="/terms" className="text-sm text-gray-500 hover:text-gray-300 transition">Terms</a>
                  <a href="/contact" className="text-sm text-gray-500 hover:text-gray-300 transition">Contact</a>
                  <a href="/sitemap.xml" className="text-sm text-gray-500 hover:text-gray-300 transition">Sitemap</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
        
        {/* Ad Block Recovery Scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(e){const r={"Europe/Brussels":"gdpr","Europe/Sofia":"gdpr","Europe/Prague":"gdpr","Europe/Copenhagen":"gdpr","Europe/Berlin":"gdpr","Europe/Tallinn":"gdpr","Europe/Dublin":"gdpr","Europe/Athens":"gdpr","Europe/Madrid":"gdpr","Africa/Ceuta":"gdpr","Europe/Paris":"gdpr","Europe/Zagreb":"gdpr","Europe/Rome":"gdpr","Asia/Nicosia":"gdpr","Europe/Nicosia":"gdpr","Europe/Riga":"gdpr","Europe/Vilnius":"gdpr","Europe/Luxembourg":"gdpr","Europe/Budapest":"gdpr","Europe/Malta":"gdpr","Europe/Amsterdam":"gdpr","Europe/Vienna":"gdpr","Europe/Warsaw":"gdpr","Europe/Lisbon":"gdpr","Atlantic/Madeira":"gdpr","Europe/Bucharest":"gdpr","Europe/Ljubljana":"gdpr","Europe/Bratislava":"gdpr","Europe/Helsinki":"gdpr","Europe/Stockholm":"gdpr","Europe/London":"gdpr","Europe/Vaduz":"gdpr","Atlantic/Reykjavik":"gdpr","Europe/Oslo":"gdpr","Europe/Istanbul":"gdpr","Europe/Zurich":"gdpr"},p=(()=>{const e=Intl.DateTimeFormat().resolvedOptions().timeZone;return r[e]||null})();if(null===p||"gdpr"!==p){const r="__adblocker";if(-1===e.cookie.indexOf(r)){const p=new XMLHttpRequest;p.open("GET","https://ads.adthrive.com/abd/abd.js",!0),p.onreadystatechange=function(){if(XMLHttpRequest.DONE===p.readyState)if(200===p.status){const r=e.createElement("script");r.innerHTML=p.responseText,e.getElementsByTagName("head")[0].appendChild(r)}else{const p=new Date;p.setTime(p.getTime()+3e5),e.cookie=r+"=true; expires="+p.toUTCString()+"; path=/"}},p.send()}}}(document);`
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(){function e(){var e=document.cookie.match("(^|[^;]+)\\s*__adblocker\\s*=\\s*([^;]+)");return e&&e.pop()}function t(){var e=document.createElement("script");e.async=!0,e.id="Tqgkgu",e.setAttribute("data-sdk","l/1.1.15"),e.setAttribute("data-cfasync","false"),e.src="https://html-load.com/loader.min.js",e.charset="UTF-8",e.setAttribute("data","kfpvgbrkab9r4a5rkrqrkwagrw6rzrv8rxag0asrka5abaoagrxa5srxrxabasrkrvabaoaxrx0asrkabrxfaba1raa5a5asrkr9wa1agrw6rzr9rkaia8"),e.setAttribute("onload","(async()=>{let e='html-load.com';const t=window,a=document,r=e=>new Promise((t=>{const a=.1*e,r=e+Math.floor(2*Math.random()*a)-a;setTimeout(t,r)})),o=t.addEventListener.bind(t),n=t.postMessage.bind(t),s=btoa,i='message',l=location,c=Math.random;try{const t=()=>new Promise(((e,t)=>{let a=c().toString(),r=c().toString();o(i,(e=>e.data===a&&n(r,'*'))),o(i,(t=>t.data===r&&e())),n(a,'*'),setTimeout((()=>{t(Error('Timeout'))}),1231)})),a=async()=>{try{let e=!1;const a=c().toString();if(o(i,(t=>{t.data===a+'_as_res'&&(e=!0)})),n(a+'_as_req','*'),await t(),await r(500),e)return!0}catch(e){}return!1},s=[100,500,1e3];for(let o=0;o<=s.length&&!await a();o++){if(o===s.length-1)throw'Failed to load website properly since '+e+' is tainted. Please allow '+e;await r(s[o])}}catch(d){try{const e=a.querySelector('script#Tqgkgu').getAttribute('onerror');t[s(l.hostname+'_show_bfa')]=d,await new Promise(((t,r)=>{o('message',(e=>{'as_modal_loaded'===e.data&&t()})),setTimeout((()=>r(d)),3e3);const n=a.createElement('script');n.innerText=e,a.head.appendChild(n),n.remove()}))}catch(m){(t=>{const a='https://report.error-report.com/modal';try{confirm('There was a problem loading the page. Please click OK to learn more.')?l.href=a+'?url='+s(l.href)+'&error='+s(t)+'&domain='+e:l.reload()}catch(d){location.href=a+'?eventId=&error=Vml0YWwgQVBJIGJsb2NrZWQ%3D&domain='+e}})(d)}}})();"),e.setAttribute("onerror","(async()=>{const e=window,t=document;let r=JSON.parse(atob('WyJodG1sLWxvYWQuY29tIiwiZmIuaHRtbC1sb2FkLmNvbSIsImQzN2o4cGZ4dTJpb2dpLmNsb3VkZnJvbnQubmV0IiwiY29udGVudC1sb2FkZXIuY29tIiwiZmIuY29udGVudC1sb2FkZXIuY29tIl0=')),o=r[0];const a='addEventListener',n='setAttribute',s='getAttribute',i=location,l=clearInterval,c='as_retry',d=i.hostname,h=e.addEventListener.bind(e),m=btoa,u='https://report.error-report.com/modal',b=e=>{try{confirm('There was a problem loading the page. Please click OK to learn more.')?i.href=u+'?url='+m(i.href)+'&error='+m(e)+'&domain='+o:i.reload()}catch(t){location.href=u+'?eventId=&error=Vml0YWwgQVBJIGJsb2NrZWQ%3D&domain='+o}},p=async e=>{try{localStorage.setItem(i.host+'_fa_'+m('last_bfa_at'),Date.now().toString())}catch(p){}setInterval((()=>t.querySelectorAll('link,style').forEach((e=>e.remove()))),100);const r=await fetch('https://error-report.com/report?type=loader_light&url='+m(i.href)+'&error='+m(e),{method:'POST'}).then((e=>e.text())),a=new Promise((e=>{h('message',(t=>{'as_modal_loaded'===t.data&&e()}))}));let s=t.createElement('iframe');s.src=u+'?url='+m(i.href)+'&eventId='+r+'&error='+m(e)+'&domain='+o,s[n]('style','width:100vw;height:100vh;z-index:2147483647;position:fixed;left:0;top:0;');const c=e=>{'close-error-report'===e.data&&(s.remove(),removeEventListener('message',c))};h('message',c),t.body.appendChild(s);const d=setInterval((()=>{if(!t.contains(s))return l(d);(()=>{const e=s.getBoundingClientRect();return'none'!==getComputedStyle(s).display&&0!==e.width&&0!==e.height})()||(l(d),b(e))}),1e3);await new Promise(((t,r)=>{a.then(t),setTimeout((()=>r(e)),3e3)}))},f=m(d+'_show_bfa');if(e[f])p(e[f]);else try{if(void 0===e[c]&&(e[c]=0),e[c]>=r.length)throw'Failed to load website properly since '+o+' is blocked. Please allow '+o;if((()=>{const t=e=>{let t=0;for(let r=0,o=e.length;o>r;r++)t=(t<<5)-t+e.charCodeAt(r),t|=0;return t},r=Date.now(),o=r-r%864e5,a=o-864e5,n=o+864e5,s='loader-check',i='as_'+t(s+'_'+o),l='as_'+t(s+'_'+a),c='as_'+t(s+'_'+n);return i!==l&&i!==c&&l!==c&&!!(e[i]||e[l]||e[c])})())return;const i=t.querySelector('#Tqgkgu'),l=t.createElement('script');for(let e=0;e<i.attributes.length;e++)l[n](i.attributes[e].name,i.attributes[e].value);const h=m(d+'_onload');e[h]&&l[a]('load',e[h]);const u=m(d+'_onerror');e[u]&&l[a]('error',e[u]);const b=new e.URL(i[s]('src'));b.host=r[e[c]++],l[n]('src',b.href),i[n]('id',i[s]('id')+'_'),i.parentNode.insertBefore(l,i),i.remove()}catch(w){try{await p(w)}catch(w){b(w)}}})();"),document.head.appendChild(e);var t=document.createElement("script");t.setAttribute("data-cfasync","false"),t.setAttribute("nowprocket",""),t.textContent="(async()=>{function t(t) { const e = t.length; let o = ''; for (let r = 0; e > r; r++) { o += t[2939 * (r + 20) % e] } return o }const e=window,o=t('Elementcreate'),r=t('pielnddaCph'),n=t('erdeLtedvtsnaEni'),c=t('tAtesetubirt'),a=document,i=a.head,s=a[o].bind(a),d=i[r].bind(i),l=location,m=l.hostname,h=btoa;e[n].bind(e);let u=t('oad.comhtml-l');(async()=>{try{const n=a.querySelector(t('#Tqgkguscript'));if(!n)throw t('onnaC dnif t')+u+t('i.cp rts');const i=n.getAttribute(t('norrero')),f=n.getAttribute(t('aolnod')),p=await new Promise((o=>{const r=t('x')+Math.floor(1e6*Math.random());e[r]=()=>o(!0);const n=s(t('pircst'));n.src=t(':atad;'),n[c](t('norrero'),t('iw.wodn')+r+t('()')),d(n),setTimeout((()=>{o(!1), n.remove()}),251)}));if(p)return;function o(){const e=s(t('pircst'));e.innerText=i,d(e),e.remove()}const b=h(m+t('o_daoln')),w=h(m+t('rrnr_eoo'));e[b]=function(){const e=s(t('pircst'));e.innerText=f,d(e),e.remove()},e[w]=o,o()}catch(r){(e => { const o = t('ro/treeol/t-.dsoormterpmh/.rca:rrtopp'); try { const r = t('cleopr   eges.eke aremtc. m Ta apdo ool t ahrOsaibwr iPhl enKegnlael'); confirm(r) ? l.href = o + t('?=lru') + h(l.href) + t('e&=rorr') + h(e) + t('a=oi&mnd') + u : l.reload() } catch (r) { location.href = o + t('J%ndVVNdvrYGQiI=Q2&ee0IWatrgbD?&lJZmnows3==mBroerW') + u } })(r)}})()})();",document.head.appendChild(t)}!function(){var r=e();if("true"===r)t();else var o=0,a=setInterval(function(){if(100!==o&&"false"!==r){if("true"===r)return t(),void clearInterval(a);r=e(),o++}else clearInterval(a)},50)}()}();`
          }}
        />
        {/* End Ad Block Recovery Scripts */}
      </body>
    </html>
  );
}