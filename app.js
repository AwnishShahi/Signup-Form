const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const app = express();
const cookieParser = require("cookie-parser");
const { requireAuth, checkuser } = require("./middleware/authMiddleware");

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
    "mongodb+srv://kinthor257as:IVkLUtr1YQx1wPm8@cluster0.rufp9h5.mongodb.net/";
mongoose
    .connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });

// routes
app.get("*", checkuser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth,(req, res) => res.render("smoothies"));
app.use(authRoutes);

     

//Cookies
/*
app.get('/set-cookies', (req, res) => {
    //res.setHeader('Set-Cookie', 'new-User=true');
    res.cookie('new-User', false);
    res.cookie('isEmployee', true, { maxAge: 3600 * 1000 * 24, secure: true, httpOnly: true });
    res.send('Cookies set');
});

app.get('/read-cookies', (req, res) => {
    const cookies = req.cookies;
    console.log(cookies.new-User);
    res.json(cookies);
});
*/