const { Signup, Login, Logout, ChangePassword, AuthorizeAndBlock } = require("../controllers/AuthController");
const router = require("express").Router();


router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/changepassword", AuthorizeAndBlock, ChangePassword);

module.exports = router;