import { Schema, model, Document } from 'mongoose';

export interface Note {
  title: string;
  description: string;
}

const NoteSchema = new Schema<Document<Note>>({
  title: String,
  description: String,
});

export default model('Note', NoteSchema);
