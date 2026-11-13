require('dotenv').config(); // loads environment variables from env file to process.env so the signing key is not handled by source code.
const jwt = require('jsonwebtoken')

module.exports.createSecretToken = (id) => { //server uses { id } to know who is making a request without needing to hit the database again.
    return jwt.sign({ id }, process.env.TOKEN_KEY, { //process.env.TOKEN_KEY is the secret phrase stored in the .env file. prevents tampering or faking the token.
        expiresIn: '3d', //token is valid for 3 days
    });
};