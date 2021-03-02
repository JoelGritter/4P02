import { connectToDatabase } from './util/mongo';
import { APIGatewayProxyEvent } from "aws-lambda";
import { createReadStream  } from "fs";
import fs from "fs";
import mongoose from "mongoose";
import NoteSchema, { Note } from "./schemas/note.schema";
import FileSchema, { File } from "./schemas/file.schemea";
import dotenv from "dotenv";
import { createModel } from "mongoose-gridfs";

dotenv.config({
  path: ".env",
});

let isConnected;
let curFile;

function callBack(err, result) {
  console.log(err)
  console.log(result)
}

function jsonError(err, message = "Operation failed") {
  console.error(err);
  return {
    statusCode: err.statusCode || 500,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ success: false, message }),
  };
}

export async function addNote(event: APIGatewayProxyEvent) {
  try {
    await connectToDatabase();

    const note: Note = JSON.parse(event.body as string);

    const resNote = await NoteSchema.create(note);

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        Location: "/notes/" + resNote._id,
      },
      body: JSON.stringify(resNote),
    };
  } catch (err) {
    return jsonError(err);
  }
}

export async function updateNote(event: APIGatewayProxyEvent) {
  try {
    await connectToDatabase();

    const res = await NoteSchema.findByIdAndUpdate(
      event.pathParameters.id,
      JSON.parse(event.body),
      {
        new: true,
      }
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        data: res,
      }),
    };
  } catch (err) {
    jsonError(err);
  }
}

export async function deleteNote(event: APIGatewayProxyEvent) {
  try {
    await connectToDatabase();

    const res = await NoteSchema.findByIdAndRemove(event.pathParameters.id);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: `Removed with id: ${res._id}`,
        data: res,
      }),
    };
  } catch (err) {
    jsonError(err);
  }
}

export async function getNote(event: APIGatewayProxyEvent) {
  try {
    await connectToDatabase();

    const resNote = await NoteSchema.findById(event.pathParameters.id);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        data: resNote,
      }),
    };
  } catch (err) {
    jsonError(err);
  }
}

export async function getAllNotes(event) {
  try {
    await connectToDatabase();

    const res = await NoteSchema.find();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        data: res,
      }),
    };
  } catch (err) {
    jsonError(err);
  }
}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export async function addFile(event: APIGatewayProxyEvent) {
  try {
    await connectToDatabase();

    const fileOptns : File = JSON.parse(event.body as string); 
    const Attachment = createModel();
    const readStream = createReadStream(fileOptns.metadata);

    await Attachment.write(fileOptns, readStream, (error, file) => {
      curFile = file;
    })

    //TODO: Find out better way to wait for this
    while(curFile == undefined){
      await delay(300);
    }

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        Location: "/files/" + curFile.filename,
        Delete: "/files/" + curFile._id,
      },
      body: JSON.stringify(curFile),
    };

  } catch (err) {
    return jsonError(err);
  }
}

export async function getFile(event: APIGatewayProxyEvent) {
  try {
    await connectToDatabase();

    const Attachment = createModel();

    const readStream = await Attachment.read({ filename: event.pathParameters.uuid });

    let fileName;

    await readStream.on('data', (file) => {
      fileName = (readStream.s.file.metadata)
      fs.writeFile("./" + fileName, file, null, null)
    });

    //TODO: Find out better way to wait for this
    while(fileName == undefined){
      await delay(300);
    }
    

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Downloaded file " + fileName,
      }),
    };
  } catch (err) {
    return jsonError(err);
  }
}

export async function deleteFile(event: APIGatewayProxyEvent) {
  try {
    await connectToDatabase();

    const Attachment = createModel();

    const readStream = await Attachment.unlink({ _id: event.pathParameters.id }, (error, file) => {
      callBack(error, null)
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Removed file with id " + event.pathParameters.id,
      }),
    };
  } catch (err) {
    return jsonError(err);
  }
}