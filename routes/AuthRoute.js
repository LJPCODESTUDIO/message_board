const { Signup, Login, Logout, ChangePassword, AuthorizeAndBlock, Profile } = require("../controllers/AuthController");
const router = require("express").Router();


router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/changepassword", AuthorizeAndBlock, ChangePassword);
router.get("/profile", AuthorizeAndBlock, Profile);

module.exports = router;