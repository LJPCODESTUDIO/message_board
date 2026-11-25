const { Signup, Login, Logout, ChangePassword, AuthorizeAndBlock, Account, Profile} = require("../controllers/AuthController");
const router = require("express").Router();


router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/changepassword", AuthorizeAndBlock, ChangePassword);
router.get("/account", AuthorizeAndBlock, Account);
router.route('/profile/:Id', Profile);

module.exports = router;