"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandlers_js_1 = require("./errorHandlers.js");
const index_js_1 = __importDefault(require("./apis/users/index.js"));
const index_js_2 = __importDefault(require("./apis/accomodation/index.js"));
const passport_1 = __importDefault(require("passport"));
/* import googleStrategy from "./auth/googleOAuth"; */
/* import facebookStrategy from "./auth/facebookOAuth"; */
const server = (0, express_1.default)();
exports.server = server;
/* const port = process.env.PORT || 3001; */
/* passport.use("google", googleStrategy); */
/* passport.use("facebook", facebookStrategy); */
// ************************************** MIDDLEWARES *****************************************
server.use((0, cors_1.default)());
server.use(express_1.default.json());
server.use(passport_1.default.initialize());
// ************************************** ENDPOINTS *******************************************
server.use("/users", index_js_1.default);
server.use("/accomodation", index_js_2.default);
// ************************************* ERROR HANDLERS ***************************************
server.use(errorHandlers_js_1.badRequestHandler);
server.use(errorHandlers_js_1.unauthorizedHandler);
server.use(errorHandlers_js_1.forbiddenHandler);
server.use(errorHandlers_js_1.notFoundHandler);
server.use(errorHandlers_js_1.catchAllHandler);
