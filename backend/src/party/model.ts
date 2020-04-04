import { Document, Model, model, Schema } from 'mongoose';
import mongooseHidden from 'mongoose-hidden';

export interface PartyDocument extends Document {
  id: string;
  name: string;
}

export type PartyModel = PartyDocument;

export const PartySchema: Schema = new Schema(
  {
    id: String,
    name: String,
  },
  { collection: 'party' },
);

PartySchema.plugin(mongooseHidden());

export const Party: Model<PartyModel> = model<PartyModel>('Party', PartySchema);
