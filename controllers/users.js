const User = require("../models/user.js");

//Render Signup page
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs")
}

//Sign Up
module.exports.signup = async(req, res, next) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});

        const registeredUser = await User.register(newUser, password);

        //For automatic Login after Signup
        // -------------
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        })
        // -------------
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

//Render Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

//Login
module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust"); 
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};


//Logout
module.exports.logout = async(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are Logged out!");
        res.redirect("/listings");
    });
}