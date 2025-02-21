const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.get('/', (req, res) => {
    res.render('index', { domains: [], error: null });
});

app.post('/lookup', (req, res) => {
    const { domain, apikey } = req.body;
    const output = 'json';
    const url = `https://api.viewdns.info/reverseip/?host=${domain}&apikey=${apikey}&output=${output}`;

    https.get(url, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            if (response.statusCode === 200) {
                const { domains } = JSON.parse(data).response;
                const domainList = domains.map((domain) => domain.name);
                res.render('index', { domains: domainList });
            } else {
                res.render('index', { domains: [], error: 'API Key mevcut değil.' });
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
