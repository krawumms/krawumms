import { Document, Model, model, Schema } from 'mongoose';
import mongooseHidden from 'mongoose-hidden';

export interface UserDocument extends Document {
  id: string;
  display_name: string;
  email: string;
}

export type UserModel = UserDocument;

export const UserSchema: Schema = new Schema(
  {
    id: String,
    display_name: String,
    email: String,
  },
  { collection: 'user' },
);

UserSchema.plugin(mongooseHidden());

export const User: Model<UserModel> = model<UserModel>('User', UserSchema);
