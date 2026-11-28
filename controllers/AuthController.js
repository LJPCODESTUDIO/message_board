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
            return res.status(400).json({ message: 'All fields are required. '});
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

    } catch (error){
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports.ChangePassword = async (req, res, next) => {
    try {
        const { OldPassword, NewPassword } = req.body;
        const FindUser = await User.findOne({ _id: res.CurrUser._id })
        if (!OldPassword || !NewPassword) {
            return res.status(400).json({ msg: "Please enter both your new and old passwords."})
        }
        if (!res.CurrUser._id) {
            return res.status(401).json({ msg: "Unauthorized."});
        }
        const PasswordMatch = await bcrypt.compare(OldPassword, FindUser.Password)
        if (!PasswordMatch) {
            return res.status(400).json({ msg: "Incorrect Password, please try again."});
        }
        const NewPasswordHash = await bcrypt.hash(NewPassword, 12);
        await User.findOneAndUpdate({ _id: res.CurrUser._id}, {Password: NewPasswordHash });
        res.json({ msg: "Password successfully updated!"})
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: err.message });
    }
}

module.exports.Account = async (req, res) => {
    try{
        if (!res.CurrUser?._id) {
            return res.status(401).json({ message: "Unauthorized."});
        }
        const user = await User.findById(res.CurrUser._id).select("-Password"); //gets everything but the password.
        if (!user) {
            return res.status(404).json({ message: "User not found"});
        }
        return res.json({ user })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message});
    }

}

module.exports.Profile = async (req, res) => {
    try {
        const FoundUser = await User.findById(req.params.Id);

        if (!FoundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: FoundUser._id,
            Username: FoundUser.Username,
            Role: FoundUser.Role
        });
    }
    catch (Err) {
        console.error(Err);
        res.status(500).json({ message: Err.message });
router.get("/account", AuthorizeAndBlock, Account);
    }
}

// Frontend permission level thingy
// 0 - no permissions
// 1 - admin permissions (currently make an account an admin)
module.exports.GetUserPermissionLevel = async (req, res) => {
    try {
        const FoundUser = await User.findById(req.params.Id);

        if (!FoundUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (res.CurrUser.Role === 'admin') {
            return res.json({ Level: 1 })
        }

        return res.json({ Level: 0 });
    }
    catch (Err) {
        res.status(500).json({ message: Err.message });
    }
}

module.exports.MakeUserAdmin = async (req, res) => {
    try {
        if (res.CurrUser.Role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to do that' })
        }

        const FoundUser = await User.findById(req.params.Id);

        if (!FoundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndUpdate(req.params.Id, { Role: 'admin' });

        return res.json({ message: 'Succesfully made user an admin' });
    }
    catch (Err) {
        res.status(500).json({ message: Err.message });
    }
}

module.exports.AuthorizeAndBlock = async (req, res, next) => {
    try {
        const Token = req.cookies.token;

        if (!Token) {
            return res.status(401).json({
                message: 'Unauthorized: Invalid Token'
            });
        }

        const Decoded = CheckSecretToken(Token);

        if (!Decoded) {
            return res.status(401).json({
                message: 'Unauthorized: Invalid Token'
            });
        }

        res.CurrUser = await User.findById(Decoded.id);

        if (!res.CurrUser) {
            return res.status(401).json({
                message: 'User does not exist'
            });
        }

        next();
    }
    catch (Err) {
        res.status(500).json({
            message: Err.message
        });
    }
};

module.exports.AuthorizeAndPass = async (req, res, next) => {
    try {
        const Token = req.cookies.token;

        if (!Token) {
            res.CurrUser = await User.findOne({ Username: 'Anonymous' });
            return next();
        }

        const Decoded = CheckSecretToken(Token);
        if (Decoded === null) {
            res.CurrUser = await User.findOne({ Username: 'Anonymous' });
            return next();
        }

        res.CurrUser = await User.findById(Decoded.id);
        next();
    }
    catch (Err) {
        res.status(500).json({
            message: Err.message
        });
    }
}

