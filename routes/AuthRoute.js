const { Signup, Login, Logout, GetCurrentUser, AuthorizeAndBlock } = require("../controllers/AuthController");
const router = require("express").Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);

router.get('/current-user', AuthorizeAndBlock, GetCurrentUser);

module.exports = router;