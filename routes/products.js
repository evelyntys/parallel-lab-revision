const express = require('express');
const { Poster, MediaProperty, Tag } = require('../models');
const { createProductForm, bootstrapField, createSearchForm } = require('../forms');
const { checkIfAuthenticated } = require('../middlewares');
const router = express.Router();


router.get('/', async function (req, res) {
    // select * from posters;
    // const posters = await Poster.collection().fetch({
    //     withRelated: ['media_property', 'tags']
    // });
    // res.render('posters/index', {
    //     'posters': posters.toJSON()
    // })

    const allMedia_Properties = await MediaProperty.fetchAll().map(
        (media_property) => {
            return [media_property.get('id'), media_property.get('name')]
        }
    )
    allMedia_Properties.unshift([0, '-----select one-----'])
    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')])
    const searchForm = createSearchForm(allMedia_Properties, allTags);
    let q = Poster.collection();
    
    searchForm.handle(req, {
        empty: async function(form){
            let posters = await q.fetch({
                withRelated: ['media_property', 'tags']
            })
            res.render('posters/index', {
                posters: posters.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        },
        error: async function(form){
            let posters = await q.fetch({
                withRelated: ['media_property', 'tags']
            })
            res.render('posters/index', {
                posters: posters.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        },
        success: async function(form){
            if (form.data.name){
                q = q.where('name', 'like', '%' + req.query.name + '%')
            }

            if (form.data.media_property_id && form.data.media_property_id != "0"){
                q = q.where('media_property_id', '=', form.data.media_property_id)
            }

            if (form.data.min_cost){
                q = q.where('cost', '>=', req.query.min_cost)
            }

            if(form.data.max_cost){
                q = q.where('cost', '<=', req.query.max_cost)
            }

            if (form.data.tags){
                q.query('join', 'poster_tags', 'poster.id', 'poster_id')
                .where('tag_id', 'in', form.data.tags.split(','))
            }

            let posters = await q.fetch({
                withRelated: ['media_property', 'tags']
            })
            res.render('posters/index', {
                posters: posters.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        }
    })


})

router.get('/create', checkIfAuthenticated, async function (req, res) {
    const allMedia_Properties = await MediaProperty.fetchAll().map(
        (media_property) => {
            return [media_property.get('id'), media_property.get('name')]
        }
    )
    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')])
    const form = createProductForm(allMedia_Properties, allTags);

    res.render('posters/create', {
        'form': form.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/create', checkIfAuthenticated, async function (req, res) {
    const allMedia_Properties = await MediaProperty.fetchAll().map(
        (media_property) => {
            return [media_property.get('id'), media_property.get('name')]
        }
    )
    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')])

    const form = createProductForm(allMedia_Properties, allTags);
    form.handle(req, {
        'success': async function (form) {
            // extract the information from the form to create a new product

            // const product = new Poster(); //the model represents one table, one instance == one row in the table
            // product.set('name', form.data.name);
            // product.set('cost', form.data.cost);
            // product.set('description', form.data.description);
            // product.set('media_property_id', form.data.media_property_id);
            let { tags, ...productData } = form.data;
            const product = new Poster(productData)
            await product.save(); //save the data into the database
            if (tags) {
                await product.tags().attach(tags.split(','))
            }
            req.flash('success_messages', `new poster ${product.get('name')} has been successfully created`)
            res.redirect('/posters')
        },
        "error": function (form) {
            res.render('posters/create', {
                'form': form.toHTML(bootstrapField)
            })
        },
        'empty': function (form) {
            res.render('posters/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:poster_id/update', async function (req, res) {
    const posterId = req.params.poster_id;
    const allMedia_Properties = await MediaProperty.fetchAll().map(
        (media_property) => {
            return [media_property.get('id'), media_property.get('name')]
        }
    )
    const poster = await Poster.where({
        id: posterId
    }).fetch({
        require: true,
        withRelated: ['tags']
    })

    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')])

    const productForm = createProductForm(allMedia_Properties, allTags);

    productForm.fields.name.value = poster.get('name');
    productForm.fields.cost.value = poster.get('cost');
    productForm.fields.description.value = poster.get('description');
    productForm.fields.media_property_id.value = poster.get('media_property_id');
    productForm.fields.image_url.value = poster.get('image_url');
    let selectedTags = await poster.related('tags').pluck('id');
    productForm.fields.tags.value = selectedTags;

    res.render('posters/update', {
        form: productForm.toHTML(bootstrapField),
        poster: poster.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:poster_id/update', async function (req, res) {
    const posterId = req.params.poster_id;

    const allMedia_Properties = await MediaProperty.fetchAll().map(
        (media_property) => {
            return [media_property.get('id'), media_property.get('name')]
        }
    )

    const allTags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')])

    const poster = await Poster.where({
        id: posterId
    }).fetch({
        require: true,
        withRelated: ['tags']
    });

    const productForm = createProductForm(allMedia_Properties, allTags);

    productForm.handle(req, {
        success: async function (form) {
            let { tags, ...productData } = form.data;
            poster.set(productData);
            poster.save();
            let tagIds = tags.split(',');
            let existingTagIds = await poster.related('tags').pluck('id');

            let toRemove = existingTagIds.filter(id => tagIds.includes(id) === false)
            await poster.tags().detach(toRemove);

            await poster.tags().attach(tagIds);
            res.redirect('/posters')
        },
        error: async function (form) {
            res.render('posters/update', {
                form: form.toHTML(bootstrapField),
                poster: poster.toJSON()
            })
        },
        empty: function (form) {
            res.render('products/update', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:poster_id/delete', async function (req, res) {
    const poster = await Poster.where({
        id: req.params.poster_id
    }).fetch({
        require: true
    });
    res.render('posters/delete', {
        poster: poster.toJSON()
    })
})

router.post('/:poster_id/delete', async function (req, res) {
    const poster = await Poster.where({
        id: req.params.poster_id
    }).fetch({
        require: true
    });
    await poster.destroy();
    res.redirect('/posters')
})

module.exports = router;