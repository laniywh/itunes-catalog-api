const express = require('express');
const request = require('request');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    const host = req.get('host');
    const protocol = req.secure ? 'https' : 'http';
    res.render('index', { site: protocol + '://' + host });
});

// app.use('/assets', express.static(__dirname + '/public'));

app.get('/api/:term', function (req, res) {

    request({
        url: "https://itunes.apple.com/search",
        qs: {
            term: req.params.term,
        }
    }, function (err, response, body) {
        if (err) {
            console.log(err);
        }

        const results = JSON.parse(body);
        const items = results.results;
        let sortedItems = {};

        items.forEach(item => {
            sortedItems[item.kind] = sortedItems[item.kind] || [];

            let newItem = {
                id: item.trackId,
                name: item.trackName,
                artwork: item.artworkUrl100,
                genre: item.primaryGenreName,
                url: item.trackViewUrl,
            };

            sortedItems[item.kind].push(newItem);
        });

        res.json(sortedItems);
    });

});

app.listen(port);
