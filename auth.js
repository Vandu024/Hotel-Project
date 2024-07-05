const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const person = require('./models/person')


passport.use(new LocalStrategy(async(username,password,done)=>{
    // authentication logic here
    try{
        
        const user = await person.findOne({username});
        if(!user)
            {
                return done(null,false,{message:'Incorrect UserName'});
            }
        const isPasswordMatch = await user.comparePassword(password);
        if(isPasswordMatch)
            {
                return done(null,user);
            }
        else{
            return done(null,false,{message: 'Incorrect Password'});
        }
    }
    catch(err)
    {
        return done(err);
    }
}))

module.exports = passport;