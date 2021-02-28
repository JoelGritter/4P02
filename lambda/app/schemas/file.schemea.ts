import { Schema, model, Document } from 'mongoose';

export interface File {
  filename: string;
  contentType: string;
  userFileName: string;
}

const FileSchema = new Schema<Document<File>>({
  filename: String,
  contentType: String,
  userFileName: String,
});

export default model('File', FileSchema);