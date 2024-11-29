// security.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors());

const SECRET_KEY = 'secretkey';
const JWT_EXPIRATION = '1h';
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const CSRF_SECRET_KEY = 'csrf-secret-key';

let usersDB = [
    { username: 'admin', password: '$2a$10$yIHbUpg0E2l0n2/Jvl2iAujtA2a6elKIdQAK7uP78U0/yQy2p2mKq', csrfTokens: [] }
];

const loginLimiter = rateLimit({
    windowMs: RATE_LIMIT_WINDOW,
    max: MAX_LOGIN_ATTEMPTS,
    message: "Too many login attempts, please try again later."
});

function sanitizeInput(input) {
    return input.replace(/<[^>]+>/g, '');
}

function generateCSRFToken() {
    return crypto.randomBytes(64).toString('hex');
}

function verifyCSRFToken(req, res, next) {
    const csrfToken = req.headers['x-csrf-token'];
    if (!csrfToken || !usersDB[0].csrfTokens.includes(csrfToken)) {
        return res.status(403).json({ message: 'Invalid or missing CSRF token' });
    }
    next();
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function verifyPassword(storedPassword, inputPassword) {
    return await bcrypt.compare(inputPassword, storedPassword);
}

function generateJWT(user) {
    return jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: JWT_EXPIRATION });
}

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);
    const hashedPassword = await hashPassword(sanitizedPassword);
    usersDB.push({ username: sanitizedUsername, password: hashedPassword, csrfTokens: [] });
    return res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);
    const user = usersDB.find(u => u.username === sanitizedUsername);
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const isPasswordValid = await verifyPassword(user.password, sanitizedPassword);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    const csrfToken = generateCSRFToken();
    user.csrfTokens.push(csrfToken);
    res.cookie('csrf-token', csrfToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    const token = generateJWT(user);
    res.json({ message: 'Login successful', token, csrfToken });
});

app.get('/protected', verifyCSRFToken, (req, res) => {
    const token = req.cookies['csrf-token'];
    if (!token) {
        return res.status(403).json({ message: 'CSRF token missing or invalid' });
    }
    res.json({ message: 'This is a protected resource', data: 'Sensitive data here' });
});

function verifyJWT(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Missing token' });
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        req.user = decoded;
        next();
    });
}

app.get('/secure-data', verifyJWT, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}, this is your secure data!` });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
