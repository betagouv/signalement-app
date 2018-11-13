//Install express server
const server = require('express');
const path = require('path');

const app = server();

// Serve only the static files form the dist directory
app.use(server.static(__dirname + '/dist/signalement-app'));

app.all('/api/*', (req, res) => {
  res.redirect(process.env.API_BASE_URL + req.url);
});

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+'/dist/signalement-app/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
