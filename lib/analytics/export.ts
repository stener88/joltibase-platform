/**
 * Convert array of objects to CSV format
 */
export function jsonToCSV(data: any[], headers: string[]): string {
  if (!data || data.length === 0) {
    return headers.join(',') + '\n';
  }

  // Create header row
  const headerRow = headers.join(',');

  // Create data rows
  const dataRows = data.map(item => {
    return headers.map(header => {
      const value = item[header];
      
      // Handle null/undefined
      if (value === null || value === undefined) {
        return '';
      }

      // Handle numbers
      if (typeof value === 'number') {
        return value;
      }

      // Handle strings - escape quotes and wrap in quotes if contains comma/newline
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }

      return stringValue;
    }).join(',');
  }).join('\n');

  return `${headerRow}\n${dataRows}`;
}

/**
 * Trigger browser download of CSV file
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

/**
 * Format number with locale
 */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}

/**
 * Format percentage with 1 decimal place
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format date for export
 */
export function formatDateForExport(date: string | Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD format
}

