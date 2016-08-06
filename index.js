let express = require('express');
let session = require('express-session');
let passport = require('passport');
let FacebookStrategy = require('passport-facebook');
let keys = require('./keys.js');
let port = 3000;

let app = express();
app.use(session({
    secret: 'My Lil Pony',
    saveUninitialized: false,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: keys.clientID,
    clientSecret: keys.clientSecret,
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
    return done(null, {
      token: token,
      profile: profile
    });
}));

//server endpoints
app.get('/auth/facebook', passport.authenticate('facebook'));

//callback for facebook to connect to
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect:'/me',
  failfureRedirect:'/auth/facebook'
}));

passport.serializeUser(function(user, done){
  done(null, user);
})

passport.deserializeUser(function(obj, done){
  done(null, obj);
});

app.get('/me', (req,res) => {
  res.send(req.user);
});

app.listen(port, function() {
    console.log("We're live on: ", port);
});
