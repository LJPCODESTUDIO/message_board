const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    Email: {
        type: String,
        required: [true, "Email address is required"],
        unique: true, //makes sure address is only used once
        trim: true, //prevents dupicates that leave spaces at end of name
        lowercase: true //prevents case duplicates
    },
    Username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true, 
        lowercase: true 
    },
    Password: {
        type: String, 
     required: [true, "Password is required"]
}
});

UserSchema.pre("save", async function () {
    //this only hashes the password if the password is modified or new. Prevents double-hashing, which might lock the user out of thier account.
    if (!this.isModified("Password")) return;

    this.Password = await bcrypt.hash(this.Password, 12); //12 is the complexity level of the hash
});

module.exports = mongoose.model('User', UserSchema);