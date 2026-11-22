// Small lists the website needs for its forms and filters.
const { query } = require('../config/db');

// GET /api/reference/areas
async function areas(req, res) {
    res.json(await query('SELECT area_id, area_name, city FROM areas ORDER BY area_name'));
}

// GET /api/reference/universities
async function universities(req, res) {
    res.json(await query(
        `SELECT un.university_id, un.name, un.short_name, un.area_id, a.area_name, un.latitude, un.longitude
           FROM universities AS un
           JOIN areas AS a ON a.area_id = un.area_id
          ORDER BY un.short_name`
    ));
}

// GET /api/reference/facilities
async function facilities(req, res) {
    res.json(await query('SELECT facility_id, facility_name FROM facilities ORDER BY facility_name'));
}

module.exports = { areas, universities, facilities };
