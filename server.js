'use strict';

const express = require('express');
const app = express();
const expressHbs = require('express3-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const nameStore = require('./nameStore.js');

app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname,'/assets')));

app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(bodyParser.json());


// ROUTES --------------------------------

app.get('/', (req, res) => {

  if(nameStore.getNames()) {
    // Return enter name template
    res.render('index', {
      names : nameStore.getNames()
    });
    return;
  }

  // Return generate names screen.
  res.redirect('/new');
  return;

});

app.get('/new', (req, res) => {
  res.render('addNames');
});

app.post('/new', (req, res) => {
  try {
    nameStore.addNames(req.body.names);
    res.redirect('/confirmed');
  } catch (e) {
    res.status(400).send(e);
    return;
  }
});

app.get('/confirmed', (req, res) => {
  res.render('confirmed', {
    names : nameStore.getNames()
  });
});

// Posting new set of names
app.post('/data', (req,res) => {
  nameStore.addNames(req.body.names);
  res.redirect('/confirmed');
});


// Redirect all other traffic to home page.
app.get('*', (req,res) => {
  res.redirect('/');
});


// LISTEN --------------------------------

app.listen(8100);
console.log('listening on 8100');
