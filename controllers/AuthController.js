const User = require("../Models/UserModel");
const { CreateSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
    try{
        const { Email, Password, Username } = req.body;
        const ExistingUser = await User.findOne({ Email });
        if (ExistingUser) {
            return res.json({ message: "User already exists"});
        }
        const NewUser = await User.create({ Email, Password, Username });
        //this is where the token is created
        const Token = CreateSecretToken(NewUser._id);
        //token sent in a cookie to the browser
        res.cookie("token", Token, {
            withCredentials: true,
            httpOnly: false
        });

        res.status(201).json
        ({message: "User signed in successfully", 
            success: true, 
            NewUser:{ id: NewUser._id,
            Email: NewUser.Email,
            Username: NewUser.Username}
    }); //can't sent the password for best security practices so have to send all this back
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message});
    }
}