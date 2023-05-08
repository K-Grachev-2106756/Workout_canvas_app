const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/stopwatch', function(req, res) {
    res.sendFile(__dirname + '/public/stopwatch.html');
});

app.get('/timer', function(req, res) {
    res.sendFile(__dirname + '/public/timer.html');
});

app.get('/gym', function(req, res) {
    res.sendFile(__dirname + '/public/gym.html');
});

app.listen(3000, function() {
    console.log('Server listening on port 3000');
});