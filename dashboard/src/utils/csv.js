/**
 * Client-side CSV export.
 *
 * Mirrors the conventions of the server exports (`toCSV` in server/index.js):
 * ';' separator and comma decimals, so files open straight in a French Excel.
 * Use this whenever the rows are already in the browser rather than adding a
 * server route for them.
 */

const cell = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return value.toString().replace('.', ',');
  if (typeof value === 'boolean') return value ? '1' : '0';
  return `"${String(value).replace(/"/g, '""')}"`;
};

/**
 * Build a CSV string.
 * @param {Array<Object>} rows
 * @param {Array<{key: string, label: string}>} columns
 * @returns {string}
 */
export function toCSV(rows, columns) {
  const header = columns.map(c => `"${c.label}"`).join(';');
  const body = rows.map(row => columns.map(c => cell(row[c.key])).join(';'));
  return [header, ...body].join('\n');
}

/**
 * Trigger a browser download of the given data as CSV.
 * @param {Array<Object>} rows
 * @param {Array<{key: string, label: string}>} columns
 * @param {string} filename - without extension
 */
export function downloadCSV(rows, columns, filename) {
  // BOM so Excel detects UTF-8 on accented headers
  const blob = new Blob(['﻿' + toCSV(rows, columns)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
