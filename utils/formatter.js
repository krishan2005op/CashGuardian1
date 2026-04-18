/**
 * Formats amounts using the Indian numbering system.
 * @param {number} amount - Monetary amount to format.
 * @returns {string} Formatted amount with rupee symbol.
 */
function formatCurrency(amount) {
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);
  const formattedValue = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0
  }).format(absoluteAmount);

  return `${isNegative ? "−" : ""}₹${formattedValue}`;
}

/**
 * Formats an ISO date string for terminal display.
 * @param {string} dateStr - Date string in ISO format.
 * @returns {string} Human-readable date.
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

/**
 * Prints a decorated header.
 * @param {string} title - Title text to display.
 * @returns {string} Header line.
 */
function printHeader(title) {
  return `══════ ${title.toUpperCase()} ══════`;
}

/**
 * Prints a label and value row.
 * @param {string} label - Row label.
 * @param {string|number} value - Row value.
 * @returns {string} Formatted row.
 */
function printRow(label, value) {
  const formattedValue = typeof value === "number" ? formatCurrency(value) : value;
  return ` • ${label}: ${formattedValue}`;
}

/**
 * Prints an ASCII divider.
 * @returns {string} Divider line.
 */
function printDivider() {
  return "─────────────────────";
}

/**
 * Prints a status alert.
 * @param {string} message - Alert message.
 * @param {"info"|"warn"|"danger"} level - Alert level.
 * @returns {string} Alert string.
 */
function printAlert(message, level) {
  const prefixes = {
    info: "🟢",
    warn: "🟡",
    danger: "🔴"
  };

  return `${prefixes[level] || prefixes.info} ${message}`;
}

/**
 * Prints a simple ASCII table.
 * @param {Array<Record<string, string|number>>} rows - Table rows.
 * @param {string[]} columns - Ordered list of columns.
 * @returns {string} Rendered table.
 */
function printTable(rows, columns) {
  if (!rows.length || !columns.length) {
    return "";
  }

  const stringRows = rows.map((row) =>
    columns.map((column) => {
      const value = row[column];
      return typeof value === "number" ? formatCurrency(value) : String(value ?? "");
    })
  );

  const widths = columns.map((column, index) =>
    Math.max(column.length, ...stringRows.map((row) => row[index].length))
  );

  const renderLine = (cells) =>
    `| ${cells.map((cell, index) => cell.padEnd(widths[index], " ")).join(" | ")} |`;
  const separator = `+-${widths.map((width) => "-".repeat(width)).join("-+-")}-+`;

  return [
    separator,
    renderLine(columns),
    separator,
    ...stringRows.map(renderLine),
    separator
  ].join("\n");
}

/**
 * Safely parses a number from various formats (₹, strings, etc).
 * @param {any} val - Value to parse.
 * @returns {number} Cleaned numeric value.
 */
function safeNumber(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[₹,]/g, '').trim();
  return parseFloat(cleaned) || 0;
}

/**
 * Safely parses a date string into a Date object.
 * @param {string} val - Date string.
 * @returns {Date} Parsed date object.
 */
function safeDate(val) {
  if (val instanceof Date) return val;
  if (!val) return new Date();
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date() : d;
}

module.exports = {
  printHeader,
  printRow,
  printTable,
  printAlert,
  printDivider,
  formatCurrency,
  formatDate,
  safeNumber,
  safeDate
};
