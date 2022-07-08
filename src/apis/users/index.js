"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const model_js_1 = __importDefault(require("./model.js"));
const model_1 = __importDefault(require("../accomodation/model"));
const http_errors_1 = __importDefault(require("http-errors"));
const token_1 = require("../../auth/token");
const tools_1 = require("../../auth/tools");
const hosts_1 = require("../../auth/hosts");
const userRouter = express_1.default.Router();
// For Facebook
/* userRouter.get(
  "/facebookLogin",
  passport.authenticate("facebook" */ /* { scope: ["profile", "email"] } )*/
/* );  */
// The purpose of this endpoint is to redirect users to Google Consent Screen
/* userRouter.get(
  "/facebookRedirect",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect("/user/home");
 */
/* { session: false }), */
/*   (req, res, next) => { */
// The purpose of this endpoint is to receive a response from Google, execute the google callback function, then send a response to the client
/*     try {
      const { token } = req.user;  */ // passportNext is adding accessToken and refreshToken to req.user
/* console.log("TOKEN", token); */
// res.send({ accessToken, refreshToken })
/* res.redirect(`${process.env.FE_URL}/me/${token}`);
    } catch (error) {
      next(error);
    }
  }
); */
// For Google
// userRouter.get(
//   "/googleLogin",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// ); // The purpose of this endpoint is to redirect users to Google Consent Screen
// userRouter.get(
//   "/googleRedirect",
//   passport.authenticate("google", { session: false }),
//   (req, res, next) => {
//     // The purpose of this endpoint is to receive a response from Google, execute the google callback function, then send a response to the client
//     try {
//       const token = req.user; // passportNext is adding accessToken and refreshToken to req.user
//       if (token) {
//         console.log("TOKEN", token);
//         // res.send({ accessToken, refreshToken })
//         res.redirect(`${process.env.FE_URL}/me/${token}`);
//       } else {
//         console.log("no token");
//       }
//     } catch (error) {
//       next(error);
//     }
//   }
// );
userRouter.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield model_js_1.default.checkCredentials(email, password);
        if (user) {
            const accessToken = yield (0, tools_1.generateAccessToken)({
                _id: user._id,
                /*         role: user.role, */
            });
            res.send({ accessToken });
        }
        else {
            next((0, http_errors_1.default)(401, "Credentials are not ok!"));
        }
    }
    catch (error) {
        next(error);
    }
}));
// POST // MAKING A NEW USER
userRouter.post("/register", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new model_js_1.default(req.body);
        const { _id } = yield newUser.save();
        res.status(201).send({ _id });
    }
    catch (err) {
        next(err);
    }
}));
// Working!
userRouter.get("/me", token_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accomodation = yield model_1.default.find({
            user: req.user._id.toString(),
        });
        res.send(accomodation);
    }
    catch (error) {
        next(error);
    }
}));
userRouter.put("/me", token_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const modifiedUser = yield model_js_1.default.findByIdAndUpdate(req.user._id, req.body, { new: true });
        res.send(modifiedUser);
    }
    catch (error) {
        next(error);
    }
}));
userRouter.delete("/me", token_1.JWTAuthMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield model_js_1.default.findByIdAndDelete(req.author._id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}));
// GET /users
userRouter.get("/", token_1.JWTAuthMiddleware, hosts_1.hostOnlyMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield model_js_1.default.find();
        res.send(users);
    }
    catch (err) {
        next(err);
    }
}));
// GET /users/:userId
userRouter.get("/:userId", hosts_1.hostOnlyMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_js_1.default.findById(req.params.userId);
        if (!user) {
            next((0, http_errors_1.default)(404, `User with id ${req.params.userId} not found!`));
        }
        res.send(user);
    }
    catch (err) {
        next(err);
    }
}));
// PUT /users/:userId
/* userRouter.put("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      next(createError(404, `User with id ${req.params.userId} not found!`));
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
}); */
// DELETE /users/:userId
userRouter.delete("/:userId", token_1.JWTAuthMiddleware, hosts_1.hostOnlyMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield model_js_1.default.findByIdAndDelete(req.params.userId);
        if (!user) {
            next((0, http_errors_1.default)(404, `User with id ${req.params.userId} not found!`));
        }
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}));
exports.default = userRouter;
