const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    //check json web token exists and is verified
    if (token) {
        jwt.verify(token, 'secret_key', (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/login');
            }
            else {
                console.log(decodedToken);
                next();
            }
        })
    }
    else {
        res.redirect('/login');
    }
}

const checkuser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify (token, "secret_key", async (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.locals.user = null;
                next();
            }
            else {
                console.log(decodedToken);
                const user = await User.findById(decodedToken.id);
                res.locals.user = user; //res.locals.xyz=abc ,here xyz is the name of the globally accepted variable that you created and abc is the variable of whose value you are putting for now
                next();
            }
        });
    }
    else {
        res.locals.user = null
        next();
    }
}

module.exports = { requireAuth, checkuser };