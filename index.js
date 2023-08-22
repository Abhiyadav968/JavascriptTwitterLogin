const express = require('express');
const app = express()
const path = require('path');
const passport = require('passport');
const Strategy = require('passport-twitter').Strategy;
const session = require('express-session');
require('dotenv').config();


passport.use(new Strategy({
    consumerKey:  process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
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

app.get('/profile', (req, res) => {
    const user = req.user;
    const name = user.displayName;
    const profileImageUrl = user.photos[0].value;
    res.send(`Name ${name} <br> <br> <img src="${profileImageUrl}" alt="User Profile Image">  <br> <br> `);
})

app.get('/twitter/login', passport.authenticate('twitter'));

app.get('/twitter/return', passport.authenticate('twitter', {
    failureRedirect: '/'
}), function (req, res) {
    res.redirect('/profile')
});

app.listen(3000, () => {
    console.log('listing on port 3000');
});