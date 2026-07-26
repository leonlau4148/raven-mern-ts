import mongoose from 'mongoose';
import type { InferSchemaType, HydratedDocument } from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// InferSchemaType derives the TS type from the schema above, so the two
// can never drift apart the way a hand-written interface would.
export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

export default mongoose.model('User', userSchema);
