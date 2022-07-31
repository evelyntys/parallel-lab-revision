const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf')

const app = express();

app.set('view engine', 'hbs');

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(express.urlencoded({
    extended: false
}));


app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
})

app.use(csrf());

app.use(function(err,req,res,next){
    if (err && err.code == "EBADCSRFTOKEN"){
        req.flash('error_messages', 'the form has expired, please try again');
        res.redirect('back');
    } else{
        next()
    }
})

app.use(function(req,res,next){
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(flash());
// register flash middleware
app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
});

// routes
// iif - immediately invoked function
(async function(){
    // use const when we want a variable that cannot be reassigned to 
    const landingRoutes = require('./routes/landing');
    const productRoutes = require('./routes/products');
    const userRoutes = require('./routes/users');

    app.use('/', landingRoutes);
    app.use('/posters', productRoutes);
    app.use('/users', userRoutes)
    
})(); //<= declare an anonymous function and call it immediately
// async function main()
// {

// }

// main();

// create user so that if the hacker finds out, it can only affect that database
// if use root user, then might compromise all databases on the same server

app.listen(3333, function(){
    console.log('beep beep server is up and running')
})