const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());


app.get('/' , (req, res) => {
    res.send('Hello World');
});

app.post('/weebhook' , async (req, res) => {
    const { message } = req.body;
    console.log(message);
    res.send('ok');
});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});