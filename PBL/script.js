/**
 * Smart Traffic Management System (STMS) - Day 1 Prototype
 * Academic PBL Project • Second-Year ISE Coursework
 * Vanilla JavaScript (No Frameworks, No Build Tools)
 *
 * NOTE: All data used here is SIMULATED DEMO DATA for academic demonstration.
 */

'use strict';

/* ==========================================================================
   1. Simulated Demo Dataset
   --------------------------------------------------------------------------
   In Day 1, we use a structured in-memory array of sample road corridor objects.
   This simulates arterial corridors across city sectors with sample speeds,
   delays, and congestion statuses for testing UI rendering and filtering.
   ========================================================================== */
const trafficCorridors = [
  {
    id: 1,
    name: "MG Road Central Corridor",
    zone: "Central Business District",
    status: "Heavy",
    avgSpeed: 16,
    delay: "18 mins",
    timestamp: "10:30 AM (Demo)"
  },
  {
    id: 2,
    name: "Outer Ring Road (North)",
    zone: "IT & Tech Corridor",
    status: "Moderate",
    avgSpeed: 34,
    delay: "7 mins",
    timestamp: "10:31 AM (Demo)"
  },
  {
    id: 3,
    name: "Airport Expressway",
    zone: "North Sector",
    status: "Clear",
    avgSpeed: 68,
    delay: "0 mins",
    timestamp: "10:28 AM (Demo)"
  },
  {
    id: 4,
    name: "Brigade Road Commercial",
    zone: "Commercial District",
    status: "Heavy",
    avgSpeed: 14,
    delay: "22 mins",
    timestamp: "10:32 AM (Demo)"
  },
  {
    id: 5,
    name: "Residency Road Arterial",
    zone: "Central Sector",
    status: "Moderate",
    avgSpeed: 29,
    delay: "8 mins",
    timestamp: "10:29 AM (Demo)"
  },
  {
    id: 6,
    name: "Electronic City Elevated Flyover",
    zone: "South Sector",
    status: "Clear",
    avgSpeed: 62,
    delay: "1 min",
    timestamp: "10:33 AM (Demo)"
  },
  {
    id: 7,
    name: "Hosur Road Junction",
    zone: "South Sector",
    status: "Heavy",
    avgSpeed: 12,
    delay: "25 mins",
    timestamp: "10:30 AM (Demo)"
  },
  {
    id: 8,
    name: "Bannerghatta Link Road",
    zone: "South-West Sector",
    status: "Clear",
    avgSpeed: 48,
    delay: "3 mins",
    timestamp: "10:32 AM (Demo)"
  }
];

/* ==========================================================================
   2. DOM Element References
   ========================================================================== */
const tableBody = document.getElementById('trafficTableBody');
const statusFilter = document.getElementById('statusFilter');
const recordCountBadge = document.getElementById('recordCountBadge');
const resetFilterBtn = document.getElementById('resetFilterBtn');
const emptyState = document.getElementById('emptyState');

// Summary Card DOM References
const cardTotalCorridors = document.getElementById('cardTotalCorridors');
const cardCongestedCount = document.getElementById('cardCongestedCount');
const cardAvgSpeed = document.getElementById('cardAvgSpeed');

/* ==========================================================================
   3. Helper Functions
   ========================================================================== */

/**
 * Returns the CSS class corresponding to a given traffic status.
 * @param {string} status - 'Clear' | 'Moderate' | 'Heavy'
 * @returns {string} CSS class name
 */
function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'clear':
      return 'status-clear';
    case 'moderate':
      return 'status-moderate';
    case 'heavy':
      return 'status-heavy';
    default:
      return 'status-pill-info';
  }
}

/**
 * Calculates and updates summary card metrics across the entire dataset.
 * This demonstrates simple array operations (filter, reduce) suitable
 * for a second-year student viva explanation.
 * @param {Array} dataset - Array of corridor objects
 */
function updateSummaryCards(dataset) {
  if (!dataset || dataset.length === 0) {
    if (cardTotalCorridors) cardTotalCorridors.textContent = '0';
    if (cardCongestedCount) cardCongestedCount.textContent = '0';
    if (cardAvgSpeed) cardAvgSpeed.textContent = '0.0 km/h';
    return;
  }

  // 1. Total Monitored Corridors
  const totalCount = dataset.length;

  // 2. High Congestion Count (Status === 'Heavy')
  const heavyCount = dataset.filter(item => item.status.toLowerCase() === 'heavy').length;

  // 3. Average Speed across monitored corridors
  const totalSpeed = dataset.reduce((sum, item) => sum + item.avgSpeed, 0);
  const avgSpeed = (totalSpeed / totalCount).toFixed(1);

  // Update DOM elements safely
  if (cardTotalCorridors) cardTotalCorridors.textContent = totalCount;
  if (cardCongestedCount) cardCongestedCount.textContent = heavyCount;
  if (cardAvgSpeed) cardAvgSpeed.textContent = `${avgSpeed} km/h`;
}

/**
 * Renders the given array of corridor objects into the HTML table body.
 * @param {Array} records - The filtered or full list of corridors to display.
 */
function renderTable(records) {
  if (!tableBody) return;

  // Clear existing rows
  tableBody.innerHTML = '';

  // If no records match the filter, show the empty state message
  if (records.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  // Render each corridor as a table row
  records.forEach(corridor => {
    const row = document.createElement('tr');

    const statusPillClass = getStatusClass(corridor.status);

    row.innerHTML = `
      <td><strong>${escapeHtml(corridor.name)}</strong></td>
      <td>${escapeHtml(corridor.zone)}</td>
      <td>
        <span class="status-pill ${statusPillClass}">
          <span aria-hidden="true">●</span>
          ${escapeHtml(corridor.status)}
        </span>
      </td>
      <td class="speed-metric">${corridor.avgSpeed} km/h</td>
      <td class="delay-metric">${escapeHtml(corridor.delay)}</td>
      <td class="time-metric">${escapeHtml(corridor.timestamp)}</td>
    `;

    tableBody.appendChild(row);
  });
}

/**
 * Basic HTML escaping helper to ensure safe text injection.
 * @param {string} str - Raw string
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Handles filtering the corridor dataset based on user selection in the dropdown.
 */
function handleStatusFilter() {
  const selectedStatus = statusFilter.value.trim();

  let filtered;
  if (selectedStatus === 'all') {
    filtered = trafficCorridors;
    if (resetFilterBtn) resetFilterBtn.style.display = 'none';
  } else {
    filtered = trafficCorridors.filter(
      item => item.status.toLowerCase() === selectedStatus.toLowerCase()
    );
    if (resetFilterBtn) resetFilterBtn.style.display = 'inline-block';
  }

  // Update table and counter badge
  renderTable(filtered);

  if (recordCountBadge) {
    recordCountBadge.textContent = `Showing ${filtered.length} of ${trafficCorridors.length} corridors`;
  }
}

/**
 * Resets the filter dropdown to 'all' and refreshes the table.
 */
function resetFilter() {
  if (statusFilter) {
    statusFilter.value = 'all';
    handleStatusFilter();
    statusFilter.focus();
  }
}

/* ==========================================================================
   4. Initialization & Event Listeners
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial calculation of summary metrics
  updateSummaryCards(trafficCorridors);

  // 2. Initial render of all sample corridors
  renderTable(trafficCorridors);

  // 3. Set up event listener for filter dropdown
  if (statusFilter) {
    statusFilter.addEventListener('change', handleStatusFilter);
  }

  // 4. Set up event listener for reset button
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener('click', resetFilter);
  }

  console.log('STMS Academic Prototype loaded successfully.');
  console.log('Notice: All displayed data is simulated demo data.');
});
