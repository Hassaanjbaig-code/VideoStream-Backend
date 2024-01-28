const { Readable } = require("stream"); // Import the Readable class
const { google } = require("googleapis");
const fs = require("fs");

const Client_ID =
  "862074808051-pe8pipc6pr777pgmbudnrupp3p57ectq.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04fDj7VEQjvj4CgYIARAAGAQSNwF-L9Irr4zl61OdkXE5ywyTQwa9iMdBH6IakF0Puy0Ycck70gd_6SylxNLExR1TnI0yc5xxlHk";

const oauth2Client = new google.auth.OAuth2(
  Client_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

async function uploadFile(File) {
  try {
    // Create a readable stream from the buffer
    console.log(File);
    const fileStream = new Readable();
    fileStream.push(File.buffer);
    fileStream.push(null); // Signal the end of the stream

    const response = await drive.files.create({
      requestBody: {
        name: File.originalname,
        mimeType: File.mimetype,
      },
      media: {
        mimeType: File.mimetype,
        body: fileStream, // Use the readable stream
      },
    });

    // console.log(response);
    return response;
  } catch (error) {
    if (error.code === 401 || error.status == 400) {
      // Token expired, refresh and retry
      console.log("Error is comming")
      await refreshToken();
      return uploadFile(File);
    }

    console.log('Getting error for File', error);
    return error;
  }
}

async function refreshToken() {
  try {
    const { tokens } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(tokens);
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

async function deleteFile(File_id) {
  try {
    const resp = await drive.files.delete({
      fileId: File_id,
    });
    console.log(resp.data, resp.status);
    return resp.data, resp.status;
  } catch (error) {
    console.log(error);
  }
};

async function urlPublicURL(File_id) {
    console.log(File_id)
  try {
    await drive.permissions.create({
      fileId: File_id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: File_id,
      fields: "webViewLink, webContentLink", // webContentLink is you to download the File and webViewLnk is use to View the Image
    });
    // console.log(result);
    return(result.data);
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { uploadFile, urlPublicURL, deleteFile };
