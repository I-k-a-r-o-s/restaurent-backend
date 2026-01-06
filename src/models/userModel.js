import { model, Schema } from "mongoose";

/**
 * User Schema Definition
 * Defines the structure of user documents in the MongoDB database
 * Each user has authentication credentials and admin status
 */
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true, // Name is mandatory
    },
    email: {
      type: String,
      required: true,
      unique: true, // Prevents duplicate email registrations
    },
    password: {
      type: String,
      required: true, // Stores hashed password for security
    },
    isAdmin: {
      type: Boolean,
      default: false, // By default, new users are not admins
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const User = model("User", userSchema);

export default User;
