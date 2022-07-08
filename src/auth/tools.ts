import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

interface TokenPayload {
  _id: ObjectId;
  // role: "User" | "Admin"
}

interface TokenPayloadGoogle {
  _id: ObjectId;
  // role: "User" | "Admin"
}

export const generateAccessToken = (payload: TokenPayload) =>
  new Promise<string>((resolve, reject) =>
    jwt.sign(
      payload /* .toJSON() */,
      process.env.JWT_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token as string);
      }
    )
  );

export const generateAccessTokenForGoogle = (payload: TokenPayloadGoogle) =>
  new Promise<string>((resolve, reject) =>
    jwt.sign(
      payload /* .toJSON() */, // To Json() / Should actually be there. But TS is giving an error , so I have commented it out for now.
      process.env.JWT_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token as string);
      }
    )
  );

export const verifyAccessToken = (token: string) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET!, (err, payload) => {
      if (err) rej(err);
      else res(payload);
    })
  );
