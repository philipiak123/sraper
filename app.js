const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql');

const app = express();

// Konfiguracja połączenia z bazą danych MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testowa'
});

// Połączenie z bazą danych
connection.connect(err => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err);
        return;
    }
    console.log('Połączono z bazą danych MySQL');
});

// Funkcja do pobierania i zapisywania danych do bazy co 10 sekund
const fetchDataAndSaveToDatabase = async () => {
    try {
        const url = 'https://www.otodom.pl/pl/wyniki/sprzedaz/mieszkanie/cala-polska';
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        };

        const response = await axios.get(url, { headers });
        const html = response.data;

        const $ = cheerio.load(html);
        const elementContent = $('.e1fw9pn54.css-g23rbo').text();

        console.log('Pobrana zawartość:', elementContent);

        // Zapisz dane do bazy danych
        const query = `INSERT INTO test (nazwa) VALUES ('${elementContent}')`;
        connection.query(query, (error, results, fields) => {
            if (error) {
                console.error('Błąd zapisu do bazy danych:', error);
                return;
            }
            console.log('Dane zostały zapisane do bazy danych');
        });
    } catch (error) {
        console.error('Błąd podczas pobierania strony:', error);
    }
};

// Wywołaj funkcję co 10 sekund
setInterval(fetchDataAndSaveToDatabase, 10000);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
