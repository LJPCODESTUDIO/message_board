const User = require("../models/User");
const { CreateSecretToken, CheckSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
    try{
        const { Email, Password, Username } = req.body;

        const ExistingUser = await User.findOne({ Email });
        if (ExistingUser) {
            return res.status(403).json({ message: "User already exists"});
        }
        const ExistingUsername = await User.findOne({ Username });
        if (ExistingUsername) {
            return res.status(403).json({ message: "Username already exists" });
        } 

        const NewUser = await User.create({ Email: Email, Username: Username, Password: Password });
        //this is where the token is created
        const Token = CreateSecretToken(NewUser._id);
        //token sent in a cookie to the browser
        res.cookie("token", Token, {
            withCredentials: true,
            httpOnly: false, // true is best security practice, but to keep it simple we can keep it false.
            sameSite: 'lax' // can't be sent cross-site
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
};

module.exports.Login = async (req, res, next) => {
    try{
        const {Email, Password} = req.body;

        if (!Email || !Password) {
            return res.json({ message: 'All fields are required. '});
        }

        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(400).json({ message: "Incorrect email or password" });
        }
        if (user.Username === "anonymous") {
            return res.status(403).json({ message: "Reserved Account" });
        }
        
        const Auth = await bcrypt.compare(Password, user.Password);
        if (!Auth) {
            return res.status(401).json({ message: 'Incorrect email or password'});
        }

        const token = CreateSecretToken(user._id);
        res.cookie("token", token, {
            httpOnly: false ,  
            sameSite: 'lax'     
        })

        res.status(200).json({
            message: "User log in successful",
            success: true
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// using a post request to clear the cookie
module.exports.Logout = async (req, res, next) => {
    try {res.cookie("token", "", {
        httpOnly: false,
        expires: new Date(0), //should cause it to expire immediately.
        sameSite: 'lax'
    })

    return res.status(200).json({
        message: "Successfully logged out",
        success: true
    });

    } catch {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports.AuthorizeAndBlock = async (req, res, next) => {
    const Token = req.cookies.token;

    if (!Token) {
        return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
    }

    const Decoded = CheckSecretToken(Token);
    if (Decoded === null) {
        return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
    }
    
    res.CurrUser = await User.findById(Decoded.id);
    next();
}

module.exports.AuthorizeAndPass = async (req, res, next) => {
    const Token = req.cookies.token;

    if (!Token) {
        res.CurrUser = await Profile.findOne({ Username: 'Anonymous' });
        return next();
    }

    const Decoded = CheckSecretToken(Token);
    if (Decoded === null) {
        req.CurrUser = await User.findOne({ Username: 'Anonymous' });
        return next();
    }

    req.CurrUser = await User.findById(Decoded.id);
    next();
}