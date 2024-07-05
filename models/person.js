const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the person Schema
const personSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    age:{
        type: Number
    },
    work:{
        type: String,
        enum:['chef','waiter','manager'],
        required:true
    },
    mobile:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    address:{
        type: String,
        
    },
    salary:{
        type:Number,
        required:true
    },
    username:{
        required:true,
        type:String
    },
    password:
    {
        required:true,
        type:String
    }
});

personSchema.pre('save',async function(next){
    const person = this;

    // Hash the password only if it has been modififed(or is new)
    if(!person.isModified('password'))return next();
    try{
        // hash password g6eneration
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(person.password,salt);

        //Overrride the plain password with the hashed one
        person.password = hashedPassword;
        next(); 
    }
    catch(err){
        return next(err);
    }
})

personSchema.methods.comparePassword = async function(candidatePassword)
{
    try{
        const isMatch = await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }
    catch(err){
        throw err;
    }
}

//Create Person Model
const person = mongoose.model('person',personSchema);

module.exports = person;