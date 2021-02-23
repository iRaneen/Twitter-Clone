const express = require('express');
const router = express.Router()

const User = require('../models/users.js');
const { use } = require('./twitt.js');
// the view of si page 
router.get('/signUp', (req, res) => {


    res.render('signUp')
})
// post for signUp
router.post(
    "/signUp",
    // validator.body("email").isEmail(),
    // validator.body("password").isLength({min:5}),
    (req, res) => {

        // const validatorErrors= validator.validationResult(req);
        // if(!validatorErrors.isEmpty())
        // return res.status(500).send("validation Errors")
        User.createSecure(req.body.userName, req.body.name, req.body.password, req.body.image, (err, newUser) => {
            console.log("newUser", newUser)
            req.session.userId = newUser._id
            user = newUser
            res.redirect("/home")
        })
    });
// the view of login page 
router.get('/login', (req, res) => {

    res.render('logIn')

})
// post for logIn
router.post("/login", (req, res) => {
    console.log("Login email, password", req.body.userName, req.body.password);
    // Authenitcate User
    User.authenticate(req.body.userName, req.body.password, (err, foundUser) => {
        if (err) {
            console.log("Authenitcate error", err)
            res.status(500).send(err)
        } else {
            req.session.userId = foundUser._id
            res.redirect("/home")
        }
    });

});
// the view of home page 
router.get('/home', (req, res) => {
    User.findById(req.session.userId)
        .populate('followers')
        .populate("followings")
        .then(user => {
            res.render('home', { user })
        }).catch(err => console.log(err));

})
// profile view
router.get('/profile', (req, res) => {
    User.findById(req.session.userId)
        .populate('followers')
        .populate("followings")
        .then(user => {
            res.render('profile', { user })
        }).catch(err => console.log(err));
})

router.get('/search', (req, res) => {

    users=req.session.search;
    res.render('search',{users})
    
})

router.post("/search", (req, res) => {
    console.log("search", req.body.name);
    // Authenitcate User
    User.find({userName:req.body.name}).then(users =>{
        req.session.search=users;
        console.log(users)
        res.redirect('/search')
    }).catch(err => console.log(err));

});

router.get('/followers', (req, res) => {

    User.findById(req.session.userId)
    .populate('followers')
    .populate("followings")
    .then(user => {
        res.render('followers', { user })
    }).catch(err => console.log(err));

})
router.get('/following', (req, res) => {

    User.findById(req.session.userId)
    .populate('followers')
    .populate("followings")
    .then(user => {
        res.render('following', { user })
    }).catch(err => console.log(err));
 

})

router.post('/user/follow/:idToFollow', (req,res)=>{
    const idToFollow = req.params.idToFollow;
    User.findByIdAndUpdate(req.session.userId, {$push:{followings:idToFollow}}).then(user =>{
        User.findByIdAndUpdate(idToFollow, {$push:{followers:req.session.userId}}).then(user =>{
            
        }).catch(err =>console.log(err))
        res.redirect('/following')

    }).catch(err =>console.log(err))
})





module.exports = router