require('dotenv').config();

const expressLayout = require('express-ejs-layouts');
const express = require('express');

const connectDB = require('./server/config/db');
const flash = require('connect-flash');

const session = require('express-session');
const methodOverride = require('method-override')

const PORT = process.env.PORT || 4000
const app = express();

// Database Connection
connectDB();

// Parse the request body as JSON and URL encoded
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))

// Serve static files
app.use(express.static('public'));

// Express Session
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);

// Flash Message
app.use(flash({
    sessionKeyName: 'flashMessage',
}));

// Setting Template Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/user'));

// Handling 404 Error
app.get('*', (req, res) => {
    res.status(404).render('404')
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})