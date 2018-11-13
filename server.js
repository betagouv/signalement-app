//Install express server
const server = require('express');
const path = require('path');
const request = require('request');

const app = server();

// Serve only the static files form the dist directory
app.use(server.static(__dirname + '/dist/signalement-app'));

app.all('/api/*', (req, res) => {
  res.redirect(307, process.env.API_BASE_URL + req.url);
  request({ url: process.env.API_BASE_URL + req.url, headers: req.headers, body: req.body }, function(err, remoteResponse, remoteBody) {
    if (err) { return res.status(500).end('Error'); }
    res.end(remoteBody);
  });
});

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+'/dist/signalement-app/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
