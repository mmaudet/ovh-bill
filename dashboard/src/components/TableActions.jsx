/**
 * "Show all" + "CSV" buttons for a table header.
 *
 * Both are optional: pass only the handlers that make sense for the table.
 *
 * @param {Function} onShowAll  opens the full table (usually in a Modal)
 * @param {Function} onExport   triggers the CSV download
 * @param {string} language     'fr' | 'en'
 */
export default function TableActions({ onShowAll, onExport, language = 'fr' }) {
  const buttonClass = 'px-2 py-0.5 text-xs font-normal border border-gray-200 rounded hover:bg-gray-100';
  return (
    <>
      {onShowAll && (
        <button onClick={onShowAll} className={buttonClass}>
          {language === 'en' ? 'Show all' : 'Tout afficher'}
        </button>
      )}
      {onExport && (
        <button onClick={onExport} className={buttonClass}>
          CSV
        </button>
      )}
    </>
  );
}
