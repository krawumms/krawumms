import { Document, Model, model, Schema } from 'mongoose';
import mongooseHidden from 'mongoose-hidden';
import mongooseTimestamp from 'mongoose-timestamp';

export interface PartyDocument extends Document {
  id: string;
  name: string;
  topic: string;
  owner: string;
  playlist: string[];
}

export type PartyModel = PartyDocument;

export const PartySchema: Schema = new Schema(
  {
    id: String,
    name: String,
    topic: String,
    owner: String,
    playlist: Array,
  },
  { collection: 'party' },
);

PartySchema.plugin(mongooseHidden());
PartySchema.plugin(mongooseTimestamp);

export const Party: Model<PartyModel> = model<PartyModel>('Party', PartySchema);
