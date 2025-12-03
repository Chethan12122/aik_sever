const express = require('express');
const xlsx = require('xlsx');
const pool = require('../../database/db');

const router = express.Router();

/**
 * Parse agility JSON and extract time values
 * Input: {"Time": {"avg": 12.038, "max": 12.038, "min": 12.038}, "sprint 1": {"time": 12.038}, ...}
 * Output: { avg_time, max_time, min_time, sprint_1, sprint_2, sprint_3, ... }
 */
function parseAgilityData(agilityJson) {
  const result = {
    avg_time: '',
    max_time: '',
    min_time: '',
    sprint_1: '',
    sprint_2: '',
    sprint_3: '',
    sprint_4: '',
    sprint_5: ''
  };

  if (!agilityJson) return result;

  try {
    const data = typeof agilityJson === 'string' ? JSON.parse(agilityJson) : agilityJson;

    // Extract average, max, min times
    if (data.Time) {
      result.avg_time = data.Time.avg || '';
      result.max_time = data.Time.max || '';
      result.min_time = data.Time.min || '';
    }

    // Extract sprint times
    for (let i = 1; i <= 5; i++) {
      const sprintKey = `sprint ${i}`;
      if (data[sprintKey] && data[sprintKey].time) {
        result[`sprint_${i}`] = data[sprintKey].time;
      }
    }

    return result;
  } catch (error) {
    console.error('Error parsing agility data:', error);
    return result;
  }
}

/**
 * Parse name: "99 - Korla Vignesh" 
 * Returns: { external_id, first_name, last_name }
 */
function parseName(fullName) {
  if (!fullName) return { external_id: '', first_name: '', last_name: '' };

  const match = fullName.match(/^(\d+)\s*-\s*(.+?)(?:\s+(.+))?$/);

  if (match) {
    return {
      external_id: match[1],
      first_name: match[2].trim(),
      last_name: (match[3] || '').trim()
    };
  }

  return { external_id: '', first_name: fullName.trim(), last_name: '' };
}

/**
 * GET /export-agility
 * Export agility_test with separated columns
 */
router.get('/export-agility', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM agility_test ORDER BY created_at DESC');

    const data = result.rows.map(row => {
      const nameParsed = parseName(row.name);
      const agilityParsed = parseAgilityData(row.agility);

      return {
        'ID': row.id,
        'External ID': nameParsed.external_id,
        'First Name': nameParsed.first_name,
        'Last Name': nameParsed.last_name,
        'Email': row.email,
        'Average Time': agilityParsed.avg_time,
        'Max Time': agilityParsed.max_time,
        'Min Time': agilityParsed.min_time,
        'Sprint 1': agilityParsed.sprint_1,
        'Sprint 2': agilityParsed.sprint_2,
        'Sprint 3': agilityParsed.sprint_3,
        'Sprint 4': agilityParsed.sprint_4,
        'Sprint 5': agilityParsed.sprint_5,
        'Created At': row.created_at,
        'Notes': row.notes || ''
      };
    });

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Agility Test');

    // Set column widths
    worksheet['!cols'] = [
      { wch: 6 },   // ID
      { wch: 12 },  // External ID
      { wch: 15 },  // First Name
      { wch: 15 },  // Last Name
      { wch: 25 },  // Email
      { wch: 14 },  // Average Time
      { wch: 10 },  // Max Time
      { wch: 10 },  // Min Time
      { wch: 10 },  // Sprint 1
      { wch: 10 },  // Sprint 2
      { wch: 10 },  // Sprint 3
      { wch: 10 },  // Sprint 4
      { wch: 10 },  // Sprint 5
      { wch: 20 },  // Created At
      { wch: 15 }   // Notes
    ];

    res.setHeader('Content-Disposition', 'attachment; filename=agility_test.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(xlsx.write(workbook, { type: 'buffer' }));

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
