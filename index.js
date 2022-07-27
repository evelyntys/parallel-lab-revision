const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

const app = express();

app.set('view engine', 'hbs');

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// routes
// iif - immediately invoked function
(async function(){
    // use const when we want a variable that cannot be reassigned to 
    const landingRoutes = require('./routes/landing');
    const productRoutes = require('./routes/products');

    app.use('/', landingRoutes);
    app.use('/posters', productRoutes)
    
})(); //<= declare an anonymous function and call it immediately
// async function main()
// {

// }

// main();

// create user so that if the hacker finds out, it can only affect that database
// if use root user, then might compromise all databases on the same server

app.listen(3000, function(){
    console.log('beep beep server is up and running')
})