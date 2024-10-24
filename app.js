const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());


app.get('/' , (req, res) => {
    res.send('Hello World');
});
let hasPosition = false;
let buyPrice = null;  // Variable to store the price at which we bought
let sellPrice = null; // Variable to store the price at which we sold

// Endpoint to receive alerts
app.post('/webhook', (req, res) => {
    const alert = req.body;
    console.log(alert);
    console.log(alert.signal);
    // Assuming the alert payload contains a 'price' field
    const price = alert.price;

    if (alert.signal === 'BUY' && !hasPosition) {
        // Place a buy order only if we don't already have a position
        console.log(`Received BUY signal at price: ${price}`);
        buyPrice = price;  // Store the buy price
        hasPosition = true;  // Update state to indicate we now hold a position
        // You can trigger a buy order here (e.g., using a broker's API)
    } 
    else if (alert.signal === 'SELL' && hasPosition) {
        // Place a sell order only if we currently hold a position
        console.log(`Received SELL signal at price: ${price}`);
        sellPrice = price;  // Store the sell price
        hasPosition = false;  // Update state to indicate the position is closed
        
        // Log the buy and sell prices
        console.log(`Bought at: ${buyPrice}, Sold at: ${sellPrice}`);
        
        // You can trigger a sell order here
    } 
    else {
        // Invalid operation (e.g., trying to sell without buying first or buying again when holding a position)
        console.log('Invalid operation. No position to sell or already holding a position.');
    }

    res.sendStatus(200);  // Acknowledge receipt
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});