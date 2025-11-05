const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let users = {
    hod: [
        { name: 'Dr. Smith', email: 'smith@example.com', password: 'password123' }
    ],
    admin: [
        { name: 'Samarth Khare', email: 'samarthkhare29@gmail.com', password: 'Sam1234' }
    ],
    'report-maker': [
        { name: 'Sneha', email: 'sneha044l2005@gmail.com', password: 'Sneha1234' }
    ]
};

app.post('/api/register', (req, res) => {
    const { name, email, password, role } = req.body;
    console.log('Registration attempt received:', { name, role, email });

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const userList = users[role];
    const userExists = userList ? userList.find(user => user.email === email) : false;

    if (userExists) {
        console.log('Registration failed: User already exists');
        return res.status(409).json({ message: 'A user with this email already exists for this role.' });
    }

    const newUser = { name, email, password };
    if (userList) {
        userList.push(newUser);
    } else {
        users[role] = [newUser];
    }

    console.log('SUCCESS: User registered:', newUser);
    res.status(201).json({ message: 'User registered successfully! Please log in.' });
});

app.post('/api/login', (req, res) => {
    const { role, email, password } = req.body;
    const userList = users[role];
    const foundUser = userList ? userList.find(user => user.email === email && user.password === password) : null;

    if (foundUser) {
        res.status(200).json({
            message: 'Login successful!',
            user: { name: foundUser.name, email: foundUser.email }
        });
    } else {
        res.status(401).json({ message: 'Invalid email, password, or role.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});