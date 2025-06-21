const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB Connection
mongoose.connect('mongodb+srv://Secrets_user:secret123@cluster0.kcvpco7.mongodb.net/whisperApp');

// JWT Secret
const JWT_SECRET = "SuperStrongSecretKey";

// Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    secret: String
});

const User = mongoose.model("User", userSchema);

// Middleware: Email & Password Validation
const validateInput = (req, res, next) => {
    const { username, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,8}$/;

    if (!emailRegex.test(username)) {
        return req.url.includes("register")
            ? res.render("register", { errorMessage: "Invalid email format." })
            : res.render("login", { errorMessage: "Invalid email format." });
    }

    if (!passwordRegex.test(password)) {
        return req.url.includes("register")
            ? res.render("register", { errorMessage: "Password must be 6–8 characters, include an uppercase, lowercase letter, and a number." })
            : res.render("login", { errorMessage: "Password must be 6–8 characters, include an uppercase, lowercase letter, and a number." });
    }

    next();
};

// Middleware: Token Authentication
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.redirect("/login");

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.send("Session expired or invalid.");
        req.user = user;
        next();
    });
};

// Routes

app.get("/", (req, res) => res.render("home"));

app.get("/register", (req, res) => {
    res.render("register", { errorMessage: null });
});


app.post("/register", validateInput, async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.username });
        if (existingUser) {
            return res.render("register", { errorMessage: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            email: req.body.username,
            password: hashedPassword
        });
        await newUser.save();
        res.redirect("/login");
    } catch (err) {
        console.error("Error registering user:", err);
        res.render("register", { errorMessage: "Registration failed. Please try again." });
    }
});


app.get("/login", (req, res) => {
    res.render("login", { errorMessage: null });
});


app.post("/login", validateInput, async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ email: username });

        if (!user) {
            return res.render("login", { errorMessage: "No user found with that email." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("login", { errorMessage: "Incorrect password." });
        }

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict"
        });

        res.redirect("/secrets");
    } catch (err) {
        console.error("Login error:", err);
        res.render("login", { errorMessage: "Login failed. Please try again." });
    }
});



app.get("/secrets", authenticateToken, async (req, res) => {
    try {
        const usersWithSecrets = await User.find({ secret: { $ne: null } });

        const secret = usersWithSecrets.length
            ? usersWithSecrets[Math.floor(Math.random() * usersWithSecrets.length)].secret
            : "No secrets submitted yet.";

        res.render("secrets", { secret });
    } catch (err) {
        console.error("Secrets fetch error:", err);
        res.send("Could not load secrets.");
    }
});

app.get("/submit", authenticateToken, (req, res) => res.render("submit"));

app.post("/submit", authenticateToken, async (req, res) => {
    try {
        const submittedSecret = req.body.secret;
        await User.findByIdAndUpdate(req.user.id, { secret: submittedSecret });
        res.redirect("/secrets");
    } catch (err) {
        console.error("Submit error:", err);
        res.send("Failed to submit secret.");
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

app.listen(1627, () => {
    console.log("Server is running on port 1627");
});
