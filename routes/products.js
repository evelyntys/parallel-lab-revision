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

router.get('/:poster_id/update', async function(req,res){
    const posterId = req.params.poster_id;
    const poster = await Poster.where({
        id: posterId
    }).fetch({
        require: true
    })
    const productForm = createProductForm();

    productForm.fields.name.value = poster.get('name');
    productForm.fields.cost.value = poster.get('cost');
    productForm.fields.description.value = poster.get('description')
    
    res.render('posters/update', {
        form: productForm.toHTML(bootstrapField),
        poster: poster.toJSON()
    })
})

router.post('/:poster_id/update', async function(req,res){
    const posterId = req.params.poster_id;
    const poster = await Poster.where({
        id: posterId
    }).fetch({
        require: true
    });

    const productForm = createProductForm();
    productForm.handle(req, {
        success: async function(form){
            poster.set(form.data);
            poster.save();
            res.redirect('/posters')
        },
        error: async function(form){
            res.render('posters/update', {
                'form': form.toHTML(bootstrapField),
                poster: poster.toJSON()
            })
        },
        empty: function(form){
            res.render('products/update', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:poster_id/delete', async function(req,res){
    const poster = await Poster.where({
        id: req.params.poster_id
    }).fetch({
        require: true
    });
    res.render('posters/delete', {
        poster: poster.toJSON()
    })
})

router.post('/:poster_id/delete', async function(req,res){
    const poster = await Poster.where({
        id: req.params.poster_id
    }).fetch({
        require: true
    });
    await poster.destroy();
    res.redirect('/posters')
})

module.exports = router;