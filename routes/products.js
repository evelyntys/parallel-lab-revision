const express = require('express');
const { Poster } = require('../models');
const {createProductForm, bootstrapField} = require('../forms');
const router = express.Router();


router.get('/', async function(req,res){
    // select * from posters;
    const posters = await Poster.collection().fetch();
    res.render('posters/index', {
        'posters': posters.toJSON()
    })
})

router.get('/create', function(req,res){
    const form = createProductForm();
    res.render('posters/create', {
        'form': form.toHTML(bootstrapField)
    })
})

router.post('/create', function(req,res){
    const form = createProductForm();
    form.handle(req, {
        'success': async function(form){
            // extract the information from the form to create a new product

            const product = new Poster (); //the model represents one table, one instance == one row in the table
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            await product.save(); //save the data into the database
            res.redirect('/posters')
        },
        "error": function(form){
            res.render('posters/create', {
                'form': form.toHTML(bootstrapField)
            })
        },
        'empty': function(form){
            res.render('posters/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

module.exports = router;