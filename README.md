Chrome Extension API Documentation
Welcome to the Chrome Extension API documentation. This API allows you to generate unique IDs, upload videos, retrieve videos, and transcribe video content. Below are the available endpoints and their descriptions.

Base URL: https://chrome-ext-api-ogx8.onrender.com/

Table of Contents
Generate an ID
Upload a Video
Get a Video
Transcribe Audio
1. Generate an ID
Endpoint: /api/generate

HTTP Method: GET

Description:

Generates a unique ID that can be used for various purposes within the API, such as identifying uploaded videos or transcriptions.

Example Request:

bash
Copy code
curl -X GET https://chrome-ext-api-ogx8.onrender.com/api/generate
Example Response:

json
Copy code
{
  "id": "123456" // the id should be numbers
}
2. Upload a Video
Endpoint: /api/upload/:id

HTTP Method: POST

Description:

Uploads a video file with the specified ID. The :id parameter should be replaced with the unique ID obtained from the "Generate an ID" endpoint.

Request Headers:

Content-Type: Set to multipart/form-data for file uploads.
Example Request:

bash
Copy code
curl -X POST -F "video=@/path/to/video.mp4" https://chrome-ext-api-ogx8.onrender.com/api/upload/abc123def456
Example Response:

json
Copy code
{
  "message": "Video uploaded successfully",
  "videoId": "123456"
}
3. Get a Video
Endpoint: /api/video/:id

HTTP Method: GET

Description:

Retrieves a video file associated with the specified ID. The :id parameter should be replaced with the unique ID of the desired video.

Example Request:

bash
Copy code
curl -X GET https://chrome-ext-api-ogx8.onrender.com/api/video/abc123def456 --output downloaded_video.mp4
Example Response:

The video file will be downloaded to your local directory as downloaded_video.mp4.

4. Transcribe video
Endpoint: /api/transcribe/:id

HTTP Method: GET

Description:

Transcribes audio content associated with the specified ID. The :id parameter should be replaced with the unique ID of the audio content.

Example Request:

bash
Copy code
curl -X GET https://chrome-ext-api-ogx8.onrender.com/api/transcribe/12345
Example Response:

json
Copy code
{
  "status": "Success",
  "transcript": "This is a sample transcript of the video content."
}
