const User = require('../models/User');
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err) => {

    console.log(err.message, err.code);
    let errors = { email: '', password: '' };

    //incorrect email
    if (err.message === 'Incorrect Email')
    {
        errors.email = 'Email not registered';
        return errors;
    }
    
    //incorrect password
    if (err.message === 'Incorrect Password')
    {
        errors.password = 'Password is incorrect';
        return errors;
    }
    
    //duplicate error code
    if (err.code === 11000) {
        errors.email = 'Email already exists';
        return errors;
    }
    
    //validation of errors
    if (err.message.includes('user validation failed')) {
        console.log(err.errors);
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

//jwt creation
const mxAge = 3 * 24 * 60 * 60;
const createtoken = (id) => {
    return jwt.sign({ id }, 'secret_key', {
        expiresIn: mxAge //expires in seconds not in mili-seconds as that of a cookie
    });
}

module.exports.signup_get = (req, res) => {
    res.render("signup");
};

module.exports.login_get = (req, res) => {
    res.render("login");
};

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });
        const token = createtoken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: mxAge * 1000 });
        res.status(201).json({user:user._id});
    }
    catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
};

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password );
        const token = createtoken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: mxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
};

module.exports.logout_get = (req, res) => {
    res.clearCookie('jwt');//set the expiration date in past time making browser readily discard the cookie.
    //Alternatively res.cookie('jwt','',{maxAge:0.00001});
    res.redirect('/');
};
