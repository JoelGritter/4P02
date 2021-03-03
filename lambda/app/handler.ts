import { connectToDatabase } from './util/mongo';
import { APIGatewayProxyEvent } from "aws-lambda";
import { createReadStream  } from "fs";
import fs from "fs";
import NoteSchema, { Note } from "./schemas/note.model";
import { Readable, Writable } from "stream";
import { createModel } from "mongoose-gridfs";
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

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

export async function addFile(event: APIGatewayProxyEvent) {

  try {
    await connectToDatabase();

    const fileContent = event.body;
    const fileType = event.multiValueHeaders['Content-Type'][0]
    const fileName = uuidv4().split("-").join("") + "." + fileType.split("/")[1];
    const fileId = new mongoose.Types.ObjectId();
    const success =  {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        Location: "/files/" + fileName,
        Delete: "/files/" + fileId,
      },
      body: JSON.stringify({
        success: true,
        message: "Successfully uploaded file",
        data: "/files/" + fileName
      }),
    };

    const fileOptns = {_id: fileId, filename: fileName, contentType: fileType}; 
    const Attachment = createModel();
    const readStream = Readable.from(fileContent)

    return await new Promise((resolve) => {
        Attachment.write(fileOptns, readStream, (error) => {
          if(error) resolve(jsonError(error));
          resolve(success);
        })
      })

  } catch (err) {
    return jsonError(err);
  }

}

export async function getFile(event: APIGatewayProxyEvent) {
  
  try {
    await connectToDatabase();

    const Attachment = createModel();

    const readStream = await Attachment.read({ filename: event.pathParameters.uuid });

    return await new Promise((resolve) => {

      let curFile = ""

      readStream.on('data', (file) => {
        curFile += file.toString("base64")
      });
  
      readStream.on('error', (error) =>{
        resolve(jsonError(error))
      })

      readStream.on('end', () =>{
        const res = {
          isBase64Encoded: true,
          statusCode: 200,
          headers: {
            "Content-Type": readStream.s.file.contentType,
          },
          body: curFile
        };

        resolve(res)
      })

    })

  } catch (err) {
    return jsonError(err);
  }

}

export async function deleteFile(event: APIGatewayProxyEvent) {
  try {
    await connectToDatabase();

    const Attachment = createModel();
    const success = {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Removed file with id " + event.pathParameters.id,
      }),
    };

    return await new Promise ((resolve) => {
      Attachment.unlink({ _id: event.pathParameters.id }, (error) => {
      if (error) resolve(jsonError(error));
      resolve(success)
      })
    });

  } catch (err) {
    return jsonError(err);
  }
}