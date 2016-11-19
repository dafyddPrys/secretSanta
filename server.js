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
  if(!nameStore.getNames()) {
    res.redirect('/new');
    return;
  }

  // Return enter name template
  res.render('index', {
    names : nameStore.getNames(),
    safeNames : nameStore.getSafeNames()
  });
  return;

});

app.post('/', (req, res) => {
  try {
    console.log(req.body);
    let match = nameStore.getMatch(req.body.names);
    res.render('result', {
      result : match
    });
  } catch(e) {
    res.status(400).send(e);
    return;
  }
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
  if(!nameStore.getNames()) {
    res.redirect('/new');
    return;
  }

  res.render('confirmed', {
    names : nameStore.getNames()
  });
});


// Redirect all other traffic to home page.
app.get('*', (req,res) => {
  res.redirect('/');
});


// LISTEN --------------------------------

app.listen(8081);
console.log('listening on 8101');
