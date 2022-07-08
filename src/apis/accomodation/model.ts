import mongoose, { Model, Document } from "mongoose";
import bcrypt from "bcrypt";
const { Schema, model } = mongoose;

interface Accomodation {
  name: string;
  description: string;
  maxGuests: number;
  city: string;
  host: string;
}

interface AccomodationDocument extends Accomodation, Document {}

interface AccomodationModel extends Model<AccomodationDocument> {
  checkCredentials(
    email: string,
    password: string
  ): Promise<AccomodationDocument | null>;
}

const accomodationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    maxGuests: {
      type: Number,
    },
    city: {
      type: String,
    },
    /*     googleID: { type: String }, */
    host: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

export default model("Accomodation", accomodationSchema);
