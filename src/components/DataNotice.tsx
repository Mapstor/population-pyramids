/**
 * The single "About this data" notice for country pages (T2 Step 6). Placed
 * just above the sources section. If this component is ever reused on other
 * page types, its text updates everywhere.
 */
export default function DataNotice() {
  return (
    <div className="mt-8 mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">
      <strong className="text-gray-800">About this data:</strong>{' '}
      <a
        href="https://population.un.org/wpp/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 underline hover:text-blue-900"
      >
        UN World Population Prospects 2024
      </a>
      , released 11 July 2024. Figures for 2024 and later are medium-variant projections for 1
      July. The UN has postponed its next revision from 2026 to 2027 (
      <a
        href="https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd/files/undesa_pd_2026_cpd59_e_cn.9_2026_crp.1.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 underline hover:text-blue-900"
      >
        UN document E/CN.9/2026/CRP.1
      </a>
      ); these pages will be updated when it is published.
    </div>
  );
}
