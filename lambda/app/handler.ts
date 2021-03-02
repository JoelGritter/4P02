import { connectToDatabase } from './util/mongo';
import { APIGatewayProxyEvent } from "aws-lambda";
import { createReadStream  } from "fs";
import fs from "fs";
import NoteSchema, { Note } from "./schemas/note.model";
import { File } from "./schemas/file.model";
import { createModel } from "mongoose-gridfs";

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

function readFile(stream: any) {
  const read = new Promise((resolve) => 
    {stream.on('data', (file) => {
      curFile = (stream.s.file);
      fs.writeFile("./" + curFile.metadata, file, null, null);
      resolve(curFile);
    });
  });

  return read.then((res) => callBack(null,res))
}

function writeFile(attachment: any, fileOpts: any, rStream: any){
  const write = new Promise((resolve) => 
    {attachment.write(fileOpts, rStream, (error, file) => {
      curFile = file;
      resolve(curFile)
    })
    });

  return write.then((res) => callBack(null,res))

}

export async function addFile(event: APIGatewayProxyEvent) {
  try {
    await connectToDatabase();

    const fileOptns : File = JSON.parse(event.body as string); 
    const Attachment = createModel();
    const readStream = createReadStream(fileOptns.metadata);

    await writeFile(Attachment, fileOptns, readStream);

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

    await readFile(readStream);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Downloaded file " + curFile.metadata,
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