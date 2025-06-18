const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://Secrets_user:secret123@cluster0.kcvpco7.mongodb.net/');

// Schema with email, password (encrypted), and secret
const trySchema = new mongoose.Schema({
    email: String,
    password: String,
    secret: String
});

// Apply encryption plugin (only to password)
const secretKey = "Thisismysecretkey"; // use strong secret in production
trySchema.plugin(encrypt, {
    secret: secretKey,
    encryptedFields: ['password']
});

const Item = mongoose.model('second', trySchema);

// Home route
app.get("/", function (req, res) {
    res.render("home");
});

// Register
app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", async function (req, res) {
    const newUser = new Item({
        email: req.body.username,
        password: req.body.password
    });

    try {
        await newUser.save();
        res.redirect("/secrets");
    } catch (err) {
        console.error("Error saving user:", err);
        res.send("An error occurred while registering.");
    }
});

// Login
app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const foundUser = await Item.findOne({ email: username });

        if (foundUser) {
            if (foundUser.password === password) {
                res.redirect("/secrets");
            } else {
                console.error("Incorrect password for user:", username);
                res.send("Incorrect password. Please try again.");
            }
        } else {
            console.error("No user found with that email.");
            res.send("No user found with that email.");
        }
    } catch (err) {
        console.error("Login error:", err);
        res.send("An error occurred during login.");
    }
});

// Secrets page – show users with secrets
app.get("/secrets", async function (req, res) {
    try {
        const usersWithSecrets = await Item.find({ secret: { $ne: null } });

        if (usersWithSecrets.length > 0) {
            const randomIndex = Math.floor(Math.random() * usersWithSecrets.length);
            const randomSecret = usersWithSecrets[randomIndex].secret;

            res.render("secrets", { secret: randomSecret });
        } else {
            res.render("secrets", { secret: "No secrets submitted yet." });
        }
    } catch (err) {
        console.error("Error fetching secrets:", err);
        res.render("secrets", { secret: "Error loading secret." });
    }
});


// Submit secret
app.get("/submit", function (req, res) {
    res.render("submit");
});

app.post("/submit", async function (req, res) {
    const submittedSecret = req.body.secret;

    try {
        // Only select users that have valid encrypted password fields
        const users = await Item.find().lean();

        // Pick the first user and then safely reload by ID
        if (users.length > 0) {
            const user = await Item.findById(users[0]._id); // Encrypted password safe
            user.secret = submittedSecret;
            await user.save();
            res.redirect("/secrets");
        } else {
            res.send("No valid users found.");
        }
    } catch (err) {
        console.error("Secret submission error:", err);
        res.send("An error occurred while submitting the secret.");
    }
});



// Log out – just return to home (no sessions yet)
app.get("/logout", function (req, res) {
    res.redirect("/");
});

// Start server
app.listen(1627, function () {
    console.log("Server is running on port 1627");
});
