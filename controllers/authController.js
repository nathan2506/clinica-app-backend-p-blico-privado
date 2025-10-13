const pool = require('../utils/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

async function login(req, res) {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

	try {
		const result = await pool.query('SELECT id, name, email, password_hash, role FROM users WHERE email = $1', [email]);
		if (result.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });

		const user = result.rows[0];
		// For now compare plain or fake hash; in production store real bcrypt hashes
		const valid = bcrypt.compareSync(password, user.password_hash) || password === user.password_hash;
		if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

			const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '8h' });
			// set httpOnly cookie
			res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 8 * 3600 * 1000 });
			res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		console.error('Login error', err);
		res.status(500).json({ error: 'Internal error' });
	}
}

async function logout(req, res) {
	res.clearCookie('token');
	res.status(200).json({ mensagem: 'Logged out' });
}

async function me(req, res) {
	try {
		const token = req.cookies && req.cookies.token;
		if (!token) return res.status(401).json({ error: 'Unauthorized' });
		const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
		res.status(200).json({ user: payload });
	} catch (err) {
		res.status(401).json({ error: 'Invalid token' });
	}
}

module.exports = { login, logout, me };
