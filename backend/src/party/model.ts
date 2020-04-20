import { Document, Model, model, Schema } from 'mongoose';
import mongooseHidden from 'mongoose-hidden';
import mongooseTimestamp from 'mongoose-timestamp';

export interface Track {
  id: string;
  votes: number;
}

export interface PartyDocument extends Document {
  id: string;
  name: string;
  topic: string;
  owner: string;
  code: string;
  playlist: Array<Track>;
}

export type PartyModel = PartyDocument;

export const TrackSchema: Schema = new Schema({
  id: String,
  votes: Number,
});

export const PartySchema: Schema = new Schema(
  {
    id: String,
    name: String,
    topic: String,
    owner: String,
    playlist: [TrackSchema],
    code: String,
  },
  { collection: 'party' },
);

PartySchema.plugin(mongooseHidden());
PartySchema.plugin(mongooseTimestamp);

export const Party: Model<PartyModel> = model<PartyModel>('Party', PartySchema);
