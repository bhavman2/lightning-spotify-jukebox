var express = require('express');
var request = require('request');
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var path = require('path');

const { client_id, client_secret, redirect_uri, url, api } = require('./spotify-variables');
const charge = require('lightning-charge-client')(url, api)

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.static(__dirname + '/build'));

app.get('/api/login', function (req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  var scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-recently-played';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/api/callback', function (req, res) {

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        res.redirect('http://localhost:8888/callback/?' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/error' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function (req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.post('/createInvoice', async (req, res) => {
  let invoice = await charge.invoice({
    msatoshi: 100000,
    description: `Spotify Jukebox`
  });
  return res.json({ data: invoice });
});

app.get('/fetchInvoice/:id/wait', async (req, res) => {
  let invoice = req.params.id;
  const paid = null;

  try {
    const paid = await charge.wait(
      invoice,
      600 /* timeout in seconds */
    );
    do {
      if (paid) {
        return res.json({ success: true, data: 'Success!' });
      }
      else if (paid === false) {
        return res.json({ success: false, data: 'Invoice expired and can no longer be paid. Please try again.' });
      }
      else if (paid === null) {
        return res.json({ success: false, data: 'Timeout reached without payment. Please try again.' });
      }
    } while (paid === null);
  } catch (error) {
    console.error(error);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});

console.log('Listening on 8888');
app.listen(8888);