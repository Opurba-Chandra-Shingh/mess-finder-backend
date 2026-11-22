// Small helpers to check what the website sends. Each one throws a 400 error with a clear message.
const AppError = require('./app-error');

// A required text value. Returns it trimmed.
function text(value, name, { min = 1, max = 255 } = {}) {
    if (typeof value !== 'string' || value.trim().length < min) {
        throw new AppError(400, `${name} is required`);
    }
    const trimmed = value.trim();
    if (trimmed.length > max) {
        throw new AppError(400, `${name} must be at most ${max} characters`);
    }
    return trimmed;
}

// A text value that may be missing. Returns null when empty.
function optionalText(value, name, { max = 255 } = {}) {
    if (value === undefined || value === null || String(value).trim() === '') return null;
    return text(String(value), name, { max });
}

function email(value) {
    const address = text(value, 'Email', { max: 120 }).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
        throw new AppError(400, 'Email is not valid');
    }
    return address;
}

// Bangladesh mobile number. +8801712345678, 8801712345678 and 01712345678 all become 01712345678.
function phone(value) {
    const cleaned = text(value, 'Phone', { max: 20 }).replace(/[\s-]/g, '');
    const match = cleaned.match(/^(?:\+?88)?(01[3-9]\d{8})$/);
    if (!match) {
        throw new AppError(400, 'Phone must be a Bangladeshi mobile number like 01712345678');
    }
    return match[1];
}

function password(value) {
    if (typeof value !== 'string' || value.length < 8 || value.length > 72) {
        throw new AppError(400, 'Password must be 8 to 72 characters');
    }
    if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
        throw new AppError(400, 'Password must contain a letter and a number');
    }
    return value;
}

// One of the allowed words, for example gender: male or female.
function oneOf(value, name, allowed) {
    if (!allowed.includes(value)) {
        throw new AppError(400, `${name} must be one of: ${allowed.join(', ')}`);
    }
    return value;
}

// A whole number, for example an id. Required unless fallback is given.
function integer(value, name, { min = 1, max = 2147483647, fallback } = {}) {
    if ((value === undefined || value === '') && fallback !== undefined) return fallback;
    const number = Number(value);
    if (!Number.isInteger(number) || number < min || number > max) {
        throw new AppError(400, `${name} must be a whole number${min === 1 ? ' above zero' : ''}`);
    }
    return number;
}

// A number, for example a rent. Returns undefined when it was not sent.
function optionalNumber(value, name, { min = 0, max = 1e9 } = {}) {
    if (value === undefined || value === '') return undefined;
    const number = Number(value);
    if (!Number.isFinite(number) || number < min || number > max) {
        throw new AppError(400, `${name} must be a number from ${min} to ${max}`);
    }
    return number;
}

// "1,3,5" -> [1, 3, 5]
function idList(value, name) {
    if (value === undefined || value === '') return [];
    return String(value).split(',').map((part) => integer(part.trim(), name));
}

module.exports = { text, optionalText, email, phone, password, oneOf, integer, optionalNumber, idList };
