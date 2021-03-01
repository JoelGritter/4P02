import { Schema, model, Document } from "mongoose";

export interface Note {
  title: string;
  description: string;
}

const NoteModel = model(
  "Note",
  new Schema<Document<Note>>({
    title: String,
    description: String,
  })
);

export default NoteModel;
