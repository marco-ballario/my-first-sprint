'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the exams in the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the users in the DB

/*** Set up Passport ***//*
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
        
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});
*/
// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
/*
// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'not authenticated'});
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false 
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());
*/

/*** Courses/Exams APIs ***/

// GET /api/services
app.get('/api/services', (req, res) => {
  dao.listServices()
    .then(services => res.json(services))
    .catch(() => res.status(500).end());
});

// GET /api/counters
app.get('/api/counters', (req, res) => {
  dao.listCounters()
    .then(counters => res.json(counters))
    .catch(() => res.status(500).end());
});

/*
// GET /api/courses/<code>
app.get('/api/courses/:code', async (req, res) => {
  try {
    const result = await examDao.getCourse(req.params.code);
    if(result.error)
      res.status(404).json(result);
    else
      res.json(result);
  } catch(err) {
    res.status(500).end();
  }
});

// GET /api/exams
app.get('/api/exams', isLoggedIn, async (req, res) => {
  try {
    const exams = await examDao.listExams(req.user.id);
    res.json(exams);
  } catch(err) {
    res.status(500).end();
  }
});
*/

// POST /api/services
app.post('/api/services', 
//isLoggedIn,
[
  check('name').isLength({min: 1, max: 100}),
  check('time').isInt({min: 1, max: 1440}),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const service = {
    name: req.body.name,
    time: req.body.time,
  };

  try {
    await dao.createService(service);
    res.status(201).json({});
  } catch(err) {
    res.status(503).json({error: `Database error during the creation of service ${service.name}.`});
  }
});

// DELETE /api/services/<id>
app.delete('/api/services/:id', 
//isLoggedIn,
[check('id').isInt()],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    
    return res.status(422).json({errors: errors.array()});
  }
  try {
    await dao.deleteService(req.params.id);
    res.status(200).json({}); 
  } catch(err) {
    res.status(503).json({ error: `Database error during the deletion of service ${req.params.id}.`});
  }
});

// DELETE /api/services
app.delete('/api/services',
//isLoggedIn,
async (req, res) => {
  try {
    await dao.deleteServices();
    res.status(204).end();
  } catch(err) {
    res.status(503).json({ error: `Database error during the deletion of services.`});
  }
});

/*** Users APIs ***/
/*
// POST /sessions 
// login
app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(req.user);
      });
  })(req, res, next);
});
*/
// ALTERNATIVE: if we are not interested in sending error messages...
/*
app.post('/api/sessions', passport.authenticate('local'), (req,res) => {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  res.json(req.user);
});
*/
/*
// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Unauthenticated user!'});;
});
*/
/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`react-score-server listening at http://localhost:${port}`);
});