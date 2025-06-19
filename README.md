# 🔐 Secrets - Secure Secret Sharing Web App

[🚀 Live Demo] https://secrets-project-vgk8.onrender.com/

**Secrets** is a secure web application that allows users to anonymously share and view secrets. Built with Node.js, Express, EJS, and MongoDB, it focuses on user privacy with encryption, session management, and modern authentication methods.

---

## 🚀 Features

- 🔐 **Secure Login & Registration** with encrypted password storage
- 🧪 **Session Management** using secure cookies
- 🧾 **JWT Authentication** for protected routes and scalable token-based auth
- 🧠 **Encrypted Secrets** stored safely in MongoDB
- 📤 **Post & View Secrets** anonymously
- ⚠️ **Alerts & Validation** for better user feedback
- 💡 **EJS Templating** with a clean and responsive UI

---

## 🛠️ Tech Stack

| Layer       | Technology                 |
|-------------|----------------------------|
| Backend     | Node.js, Express.js        |
| Frontend    | HTML, CSS, EJS             |
| Database    | MongoDB + Mongoose         |
| Auth        | Passport.js, bcrypt, JWT   |
| Security    | mongoose-encryption, dotenv|
| Sessions    | express-session, cookie-parser |

---

## 📂 Project Structure

whisperApp/
├── node_modules/
├── public/
│   └── css/
│       └── style.css
├── views/
│   ├── partials/
│   │   ├── footer.ejs
│   │   ├── header.ejs
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── secrets.ejs
│   └── submit.ejs
├── app.js
├── package-lock.json
├── package.json
└── README.md


---

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/secrets-app.git
   cd secrets-app
   
2. **Install all the required packages using npm:**
   ```bash
   npm install

3. **Create a .env file in the root directory and add the following:**
    ```bash
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    SECRET=your_encryption_secret
    JWT_SECRET=your_jwt_secret

4. **Start the server using:**
   ```bash
   node app.js

## 🔐 Security Notes

Passwords are hashed using bcrypt

JWT tokens are signed and verified for secure access

Sensitive fields (like secrets) are encrypted at rest using mongoose-encryption

Session cookies are secured using express-session with cookie flags

## 🧑‍💻 Author

Tejas H Shekhar









