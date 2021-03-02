import {model, Document } from 'mongoose';

export interface File extends Document{
  body: string;
  contentType: string;
  metadata: string;
}

export default model('File');