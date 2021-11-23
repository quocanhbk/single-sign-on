const isAuthenticated = (req, res, next) => {
    // simple check to see if the user is authenicated or not,
    // if not redirect the user to the SSO Server for Login
    // pass the redirect URL as current URL
    // serviceURL is where the sso should redirect in case of valid user
    if (!req.session.user) {
        res.render("login")
    }
    next()
}

module.exports = isAuthenticated
