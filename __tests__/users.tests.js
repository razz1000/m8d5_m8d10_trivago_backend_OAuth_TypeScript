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
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("../src/server");
const model_1 = __importDefault(require("../src/apis/users/model"));
dotenv_1.default.config(); // This command forces .env variables to be loaded into process.env. It is the way to go when you cannot do -r dotenv/config
const client = (0, supertest_1.default)(server_1.server); // Supertest is capable of running server.listen and gives us back a client to be used to run http requests against our server
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Before all hook could be used to connect to mongo and also do some initial setup (like inserting some mock data)
    yield mongoose_1.default.connect(process.env.MONGO_TESTDB_URL); // DO NOT FORGET TO CONNECT TO MONGO! OTHERWISE YOU GONNA GET SOME TIMEOUT ERRORS
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // After all hook could be used to close the connection to mongo in the proper way and to clean up db/collections
    yield model_1.default.deleteMany();
    yield mongoose_1.default.connection.close();
}));
