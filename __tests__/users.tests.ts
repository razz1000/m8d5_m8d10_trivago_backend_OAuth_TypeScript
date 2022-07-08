import mongoose from "mongoose";
import supertest from "supertest";
import dotenv from "dotenv";
import { server } from "../src/server";
import UsersModel from "../src/apis/users/model";

dotenv.config(); // This command forces .env variables to be loaded into process.env. It is the way to go when you cannot do -r dotenv/config

const client = supertest(server); // Supertest is capable of running server.listen and gives us back a client to be used to run http requests against our server

beforeAll(async () => {
  // Before all hook could be used to connect to mongo and also do some initial setup (like inserting some mock data)
  await mongoose.connect(process.env.MONGO_TESTDB_URL!); // DO NOT FORGET TO CONNECT TO MONGO! OTHERWISE YOU GONNA GET SOME TIMEOUT ERRORS
});

afterAll(async () => {
  // After all hook could be used to close the connection to mongo in the proper way and to clean up db/collections
  await UsersModel.deleteMany();
  await mongoose.connection.close();
});

const NotAHostUser = {
  email: "peter4@peter.kd",
  password: "1234",
};

describe("Tests Users' and Accomodation endpoints", () => {
  test("When a non-Host User post a new accomodation it should give a 401 (unauthorized) as response ", async () => {
    const response = await client
      .post("/accomodation")
      .send(NotAHostUser)
      .expect(401);
  });
});
