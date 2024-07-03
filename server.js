const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./db');
const bodyParser = require('body-parser');
app.use(bodyParser.json());



app.get('/', (req, res) => {
    res.send("Welcome to our Hotel");
});



// Import the router routes
const personRoutes = require('./Routes/personRoutes');
const menuRoutes = require('./Routes/menuRoutes');

//USe the routers
app.use('/person',personRoutes);
app.use('/menu',menuRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});