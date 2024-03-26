
const { passport } = require('../config/passport/passport');
const { genToken } = require('../utils');
const authService = require('./service');

const authRouter = require('express').Router();

// register user
authRouter.post('/users/register',authService.registerNewUser)
authRouter.post('/users/login',passport.authenticate('local',{session: false}),async (req,res) => {
    try {
        if(!req.user){
            res.status(401).json('Incorrect username or password')
        }

        const user = {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email
        }
        const token = genToken(req.user);
        res.json({user,token})
    } catch (error) {
        console.error(error);
        res.status(500).json('Internal server error')
    }
});

authRouter.get('/users/logout',(req,res) => {
    req.session.destroy(err => {
        if(err){
            console.error(err)
            return res.status(500).json('Error loggin out')
        }

        res.json('Successfully logged out')
    })
})


module.exports = authRouter;