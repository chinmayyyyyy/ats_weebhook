const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
const port = process.env.port || 3000 ;

app.get('/', (req, res) => {
  
    let html = `
        <html>
        <head>
            <title>Trade History</title>
        </head>
        <body>
            <h1>Trade History</h1>
            <table border="1">
                <tr>
                    <th>Buy Price</th>
                    <th>Sell Price</th>
                </tr>`;
                
    tradeHistory.forEach(trade => {
        html += `
            <tr>
                <td>${trade.buyPrice}</td>
                <td>${trade.sellPrice}</td>
            </tr>`;
    });
    
    html += `
            </table>
        </body>
        </html>`;

    res.send(html); 
});

let hasPosition = false;
let buyPrice = null;
let sellPrice = null;

// Array to store all price data
let tradeHistory = [];

// Endpoint to receive alerts
app.post('/webhook', (req, res) => {
    const alert = req.body;
    console.log(alert);
    const price = alert.price;

    if (alert.signal === 'BUY' && !hasPosition) {
        console.log(`Received BUY signal at price: ${price}`);
        buyPrice = price;
        hasPosition = true;
    } 
    else if (alert.signal === 'SELL' && hasPosition) {
        console.log(`Received SELL signal at price: ${price}`);
        sellPrice = price;
        hasPosition = false;

        // Store the buy and sell prices in the tradeHistory array
        tradeHistory.push({ buyPrice, sellPrice });

        // Reset the prices
        buyPrice = null;
        sellPrice = null;

        // Log the trade history
        console.log('Trade History:', tradeHistory);
    } 
    else {
        console.log('Invalid operation. No position to sell or already holding a position.');
    }

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log('Server is running');
});
