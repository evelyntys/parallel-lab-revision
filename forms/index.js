// import in caolan forms
const forms = require("forms");
// create some shortcuts
const widgets = forms.widgets;
const fields = forms.fields;
const validators = forms.validators;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};


const createProductForm = function (media_properties, tags) {
    return forms.create
        ({
            'name': fields.string({
                required: true,
                errorAfterField: true
            }),
            'cost': fields.string({
                required: true,
                errorAfterField: true
            }),
            'description': fields.string({
                required: true,
                errorAfterField: true
            }),
            'media_property_id': fields.string({
                label: 'Media Properties',
                required: true,
                errorAfterField: true,
                cssClasses: {
                    label: ['form-label']
                },
                widget: widgets.select(),
                choices: media_properties
            }),
            'tags': fields.string({
                required: true,
                errorAfterField: true,
                cssClasses: {
                    label: ['form-label']
                },
                widget: widgets.multipleSelect(),
                choices: tags
            })
        })
}

const createRegistrationForm = function () {
    return forms.create({
        username: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        email: fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        password: fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        confirm_password: fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.matchField('password')]
        })
    })
}

const createLoginForm = function(){
    return forms.create({
        email: fields.string({
            required: true, 
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        password: fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        })
    })
}

module.exports = { createProductForm, createRegistrationForm, bootstrapField, createLoginForm }