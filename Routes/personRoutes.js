const express = require('express');
const router = express.Router();
const person = require('../models/person');
const {jwtAuthMiddleware,generateToken} = require('../jwt');


// POST method to add a new person
router.post('/signup', async (req, res) => {
    try {

        const data = req.body; // Assumming the request body contains the person data

        // Create a new person document using the Mongoose Model
        const newPerson = new person(data);

        //Save the new person to the database
        const response = await newPerson.save();
        console.log("Data saved", response);

        const payLoad = {
            id: response.id,
            username : response.username
        }
        console.log(JSON.stringify(payLoad));
        const token = generateToken(payLoad);
        console.log("Token is ",token);
        res.status(200).json({response:response,token:token});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error occur" });
    }

});


//Login Route
router.post('/login', async(req,res)=>{
    try{
        // Extract username and password form the body
        const {username,password} = req.body;

        // find the user by username
        const user = await person.findOne({username:username});

        // if user does not exist or password does not match ,return error
        if( !user || !(await user.comparePassword(password)))
        {
            return res.status(404).json({msg:"Invalid username and password"});
        }

        // generate tokens
        const payLoad ={
            id: user.id,
            username: user.username
        }
        const token = generateToken(payLoad);

        // return token as response
        res.json({token});

    }
    catch(err)
    {
        console.log(error);
        res.status(500).json({msg:"Internal server Error"});
    }
})


// Profile Route
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{

        const userData = req.user;
        console.log("User Data "+userData);

        const userId = userData.id;
        const user = await person.findById(userId);

        res.status(200).json({user});


    }
    catch(err){
        console.log(error);
        res.status(500).json({msg:"Internal server Error"});
    }
})


// Get method to get the new person

router.get('/',jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await person.find();
        console.log("Data fetched");
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error occur" });
    }
});

// GET method using parametres as work type to get info of a person
router.get('/:workType', async(req, res) => {
    try {
        const workType = req.params.workType; //Extract the work type from the URL parameter
        // Validations
        if (workType == 'chef' || workType == 'manager' || workType == 'waiter') {
            const response = await person.find({work:workType});
            console.log('response fetched');
            res.status(200).json(response);
        }
        else{
            res.status(400).json({error: 'Invalid work type'});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error occur" });
    }
});


// PUT method to update person with id as a parameter

router.put('/:id',async(req,res)=>{
    try{

        const personId = req.params.id;; //Extract the id from url parameter
        const updatePersonData = req.body; // Updated data for the person

        const response = await person.findByIdAndUpdate(personId,updatePersonData,{
            new:true, // Return the updated document
            runValidators:true //Run mongoose validation
        })

        if(!response)
            {
                return res.status(404).json({error:"Person not found"});
            }

        console.log("Data updated successfully..");
        res.status(200).json(response);
    }
    catch(err)
    {
        if (err.code === 11000) {
            // Handle duplicate key error
            res.status(400).json({ error: `Duplicate key error: ${JSON.stringify(err.keyValue)}` });
        } else {
            console.log(err);
            res.status(500).json({ error: "Internal server error occurred" });
        }
    }
});

router.delete('/:id',async(req,res)=>{
    try
    {
        const personId = req.params.id; //Extract the id from url parameter
        // Assuming you have a person model
        const response = await person.findByIdAndDelete(personId);

        
        if(!response)
            {
                return res.status(404).json({error:"Person not found"});
            }

            console.log('Data deleted successfully');
            res.status(200).json({message:"person deleted successfully"});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({ error: "Internal server error occurred" });
    }
})

// Exporting router

module.exports = router;