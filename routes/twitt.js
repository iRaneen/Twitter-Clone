const express = require('express');
const router = express.Router()
const User = require("../models/users")




router.get('/createTweet' , (req,res) =>{
    res.render('createTweet')
})

// // post for signUp
// router.post("/createTweet", (req, res) => {
    
//     // findById
//     User.findByIdAndUpdate(req.session.userId, {$set:{$push:{tweets:tweet}}}).then(user =>{
//         console.log(req.session.userId)
//         res.redirect('/home')
//     }).catch(err =>console.log(err))
// });

router.post("/createTweet", (req,res)=>{
    const tweet=req.body.tweet
    User.findOneAndUpdate({_id:req.session.userId}, {$push:{tweets:tweet}}).then(user =>{
        res.redirect('/home')
    }).catch(err =>console.log(err))
})



module.exports = router