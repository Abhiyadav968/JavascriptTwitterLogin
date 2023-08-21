const express = require('express');
const app = express()
const path = require('path');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');


passport.use(new Strategy({
    consumerKey: 'YrS9nA64VBQaV53V5Jyktjxso',
    consumerSecret: 'apa4HA1Yv0ca0BYBw3sDoOOiUE0nJWVNTd0ExBugOQvXtuFj8X',
    callbackURL: 'http://localhost:3000/twitter/return'
}, function (token, tokenSecret, profile, callback) {
    return callback(null, profile);
}));

passport.serializeUser(function (user, callback) {
    callback(null, user);
})

passport.deserializeUser(function (obj, callback) {
    callback(null, obj);
})


app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

app.use(session({ secret: 'whatever', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())


app.get('/', (req, res) => {
    res.sendFile('index.html', { user: req.user })
})

app.get('/loginUser', (req, res) => {
    let name = req.user.displayName;
    res.send(`<h1>Hello User ${name}</h1>`)
})

app.get('/twitter/login', passport.authenticate('twitter'));

app.get('/twitter/return', passport.authenticate('twitter', {
    failureRedirect: '/'
}), function (req, res) {
    res.redirect('/loginUser')
})

app.listen(3000, () => {
    console.log('listing on port 3000');
});