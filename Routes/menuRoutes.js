const express =require('express');
const router = express.Router();
const menu = require('../models/menu');
const person = require('../models/person');



// POST method to cretae a new menu

router.post('/', async (req, res) => {

    try {

        const menuData = req.body; // Assumming the request body contains the menu data

        // Create a new menu document using the Mongoose Model
        const newMenu = new menu(menuData);

        //Save the new person to the database
        const menuResponse = await newMenu.save();
        console.log("Data saved", menuResponse);
        res.status(200).json(menuResponse);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error occur" });
    }
});


// GET method to get the menu
router.get('/', async (req, res) => {
    try {
        const menuData = await menu.find();
        console.log("Data fetched");
        res.status(200).json(menuData);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error occur" });
    }
});

// Get method using parameter as a work type to get info of a person
router.get('/:tasteType',async(req,res)=>{
    try
    {
        const tasteType = req.params.tasteType;

        if(tasteType == 'sweet' || tasteType == 'sour' || tasteType =="spicy")
            {
                const response = await menu.find({taste:tasteType});
                console.log('Response Fetched');
                res.status(200).json(response);
            }
        else
        {
            res.status(404).json({msg:"Invalid Work type"});
        }
    }
    catch(err)
    {
         console.log(err);
         res.status(500).json({msg:"Internal Server Error"});
    }
});


// PUT method to update menu by using id as  a parameter
router.put('/:id',async(req,res)=>{
    try{

        const menuId = req.params.id;
        const updateData = req.body;
        const response = await menu.findByIdAndUpdate(menuId,updateData,{
            new:true,
            runValidators:true
        });

        if(!response)
            {
                return res.status(404).json({msg:"Menu not found"});
            }
            console.log("Data Updated Successfully");
            res.status(200).json(response);
    }
    catch(err){

        console.log(err);
        res.status(500).json({ error: "Internal server error occurred" });
    }
});




// DELETE method to delete menu by using id as  a parameter
router.delete('/:id',async(req,res)=>{
    try{

        const menuId = req.params.id;
        const response = await menu.findByIdAndDelete(menuId);

        if(!response)
            {
                res.status(404).json({msg:"Menu not found"});
            }
            console.log("Data deleted Successfully");
            res.status(200).json({msg:"Data deleted successfully"});
    }
    catch(err){

        console.log(err);
        res.status(500).json({ error: "Internal server error occurred" });
    }
});



module.exports = router;



