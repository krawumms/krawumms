import { Document, Model, model, Schema } from 'mongoose';
import mongooseHidden from 'mongoose-hidden';

export interface TodoDocument extends Document {
  id: string;
  text: string;
  done: boolean;
}

export type TodoModel = TodoDocument;

export const TodoSchema: Schema = new Schema(
  {
    id: String,
    text: String,
    done: Boolean,
  },
  { collection: 'todo' },
);

TodoSchema.plugin(mongooseHidden());

export const Todo: Model<TodoModel> = model<TodoModel>('Todo', TodoSchema);
