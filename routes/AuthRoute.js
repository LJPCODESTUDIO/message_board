<<<<<<< HEAD
const { Signup, Login, Logout, GetCurrentUser, AuthorizeAndBlock } = require("../controllers/AuthController");
=======
const { Signup, Login, Logout, ChangePassword, AuthorizeAndBlock, Profile } = require("../controllers/AuthController");
>>>>>>> 368f5226ee3e6296f571071209c58ef65db19a32
const router = require("express").Router();


router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/changepassword", AuthorizeAndBlock, ChangePassword);
router.get("/profile", AuthorizeAndBlock, Profile);

router.get('/current-user', AuthorizeAndBlock, GetCurrentUser);

module.exports = router;