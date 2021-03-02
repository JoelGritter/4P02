import { Schema, model, Document } from 'mongoose';

export interface File {
  filename: string;
  contentType: string;
  metadata: string;
}

const FileSchema = new Schema<Document<File>>({
  filename: String,
  contentType: String,
  metadata: String,
});

export default model('File', FileSchema);