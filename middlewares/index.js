const checkIfAuthenticated = function (req, res, next) {
    if (req.session.user) {
        next()
    }
    else {
        req.flash('error_messages', 'you need to sign in to access this page');
        res.redirect('/users/login')
    }
}

module.exports = { checkIfAuthenticated }