// Shared helpers for the tests. The tests talk to the real API and the real demo database,
// so load the demo data first (see database/README.md) and fill in your .env file.
const createApp = require('../src/app');
const { pool, query } = require('../src/config/db');

const DEMO_PASSWORD = 'Demo@1234';

// Starts the API on a free port and returns its address and a close function.
async function startServer() {
    const server = await new Promise((resolve) => {
        const running = createApp().listen(0, () => resolve(running));
    });
    return {
        base: `http://127.0.0.1:${server.address().port}/api`,
        close: () => new Promise((resolve) => server.close(resolve)),
    };
}

// Sends one request and returns { status, body }.
async function request(base, method, path, { token, body, rawBody } = {}) {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined || rawBody !== undefined) headers['Content-Type'] = 'application/json';

    const response = await fetch(base + path, {
        method,
        headers,
        body: rawBody !== undefined ? rawBody : body !== undefined ? JSON.stringify(body) : undefined,
    });
    const text = await response.text();
    return { status: response.status, body: text ? JSON.parse(text) : null };
}

// Logs a demo user in and returns the token.
async function loginAs(base, email, password = DEMO_PASSWORD) {
    const result = await request(base, 'POST', '/auth/login', { body: { email, password } });
    if (result.status !== 200) throw new Error(`Login failed for ${email}: ${result.status}`);
    return result.body.token;
}

// A number that is different on every run, used to make unique emails and phone numbers.
function uniqueNumber() {
    return Date.now() % 1e9;
}

// Removes a user the tests created (the profile first, because it points at the user).
async function deleteTestUser(userId) {
    await query('DELETE FROM student_profiles WHERE student_id = ?', [userId]);
    await query('DELETE FROM manager_profiles WHERE manager_id = ?', [userId]);
    await query('DELETE FROM users WHERE user_id = ?', [userId]);
}

async function closePool() {
    await pool.end();
}

module.exports = { startServer, request, loginAs, uniqueNumber, deleteTestUser, closePool, query, DEMO_PASSWORD };
