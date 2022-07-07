const express = require('express')
const app = express(); 
const configRoutes = require('./routes'); 

app.use(express.json()); 
configRoutes(app); 

app.listen(3000, () => { 
    console.log('We now have a server !!! \n\nYour routes will be running on http://localhost:3000')
})