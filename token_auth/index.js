const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const JWT_SECRET = 'your_secret_key'; // Змініть це на свій секретний ключ

const users = [
    {
        login: 'Login',
        password: 'Password',
        username: 'Username',
    },
    {
        login: 'Login1',
        password: 'Password1',
        username: 'Username1',
    }
];

app.get('/', (req, res) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send('Invalid token');
            } else {
                return res.json({
                    username: decoded.username,
                    logout: 'http://localhost:3000/logout'
                });
            }
        });
    } else {
        res.sendFile(path.join(__dirname+'/index.html'));
    }
});

app.get('/logout', (req, res) => {
    // Немає потреби видаляти токен з сервера
    res.redirect('/');
});

app.post('/api/login', (req, res) => {
    const { login, password } = req.body;

    const user = users.find((user) => {
        if (user.login == login && user.password == password) {
            return true;
        }
        return false;
    });

    if (user) {
        // Створення JWT токена
        const token = jwt.sign({ username: user.username }, JWT_SECRET);
        res.json({ token });
    } else {
        res.status(401).send();
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});