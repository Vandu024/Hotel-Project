const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./db');
require('dotenv').config();
const passport = require('./auth');


const bodyParser = require('body-parser');
app.use(bodyParser.json());


// Middleware Function
const logRequest  = (req,res,next)=>{
console.log(`[${new Date().toLocaleString()}] Request made to : ${req.originalUrl}`);
next(); // Move on to the next phase
}
app.use(logRequest);


app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate('local',{session:false})

app.get('/',(req, res) => {
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