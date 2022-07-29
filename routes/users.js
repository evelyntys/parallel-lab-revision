const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const getHashedPassword = function(password){
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash
}

const { User } = require('../models');

const { createRegistrationForm, bootstrapField, createLoginForm } = require('../forms');

router.get('/register', function (req,res){
    const registerForm = createRegistrationForm();
    res.render('users/register', {
        form: registerForm.toHTML(bootstrapField)
    })
})

router.post('/register', function(req,res){
    const registerForm = createRegistrationForm();
    registerForm.handle(req, {
        success: async function(form) {
            const user = new User ({
                username: form.data.username,
                password: getHashedPassword(form.data.password),
                email: form.data.email
            })
            await user.save();
            req.flash('success_messages', 'user signed up successfully');
            res.redirect('/users/login')
        },
        error: function(form){
            res.render('users/register', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', function(req,res){
    const loginForm = createLoginForm();
    res.render('users/login', {
        form: loginForm.toHTML(bootstrapField)
    })
})

router.post('/login', function(req,res){
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        success: async function(form){
            let user = await User.where({
                email: form.data.email,
                password: getHashedPassword(form.data.password)
            }).fetch({
                require: false
            })
            if (!user){
                req.flash('error_messages', 'sorry the authentication details that you have provided does not work');
                res.redirect('/users/login')
            }
            else{
                req.session.user = {
                    id: user.get('id'),
                    username: user.get('username'),
                    email: user.get('email')
                }
                req.flash('success_messages', 'welcome back, ' + user.get('username'));
                res.redirect('/users/profile')
            }
        },
        error: function(form){
            req.flash('error_messages', 'there are some problems logging you in, please fill in the form again');
            res.render('users/login', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/profile', function(req,res){
    const user = req.session.user;
    if (!user){
        req.flash('error_messages', 'you do not have the permission to view this page');
        res.redirect('/users/login')
    } else{
        res.render('users/profile', {
            user
        })
    }
})

router.get('/logout', function(req,res){
    req.session.user = null;
    req.flash('success_messages', 'goodbye!');
    res.redirect('/users/login')
})

module.exports = router