const { Signup, Login, Logout, ChangePassword, AuthorizeAndBlock, Account, Profile, MakeUserAdmin, GetUserPermissionLevel} = require("../controllers/AuthController");
const router = require("express").Router();


router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/changepassword", AuthorizeAndBlock, ChangePassword);
router.post('/role/admin/:Id', AuthorizeAndBlock, MakeUserAdmin);
router.get("/account", AuthorizeAndBlock, Account);
router.get('/profile/:Id', Profile);
router.get('/profile/:Id/permission-level', AuthorizeAndBlock, GetUserPermissionLevel);

module.exports = router;