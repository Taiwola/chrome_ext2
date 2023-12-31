const fs = require('fs');
const { Deepgram } = require('@deepgram/sdk');
const path = require('path');
const { Readable } = require('stream');
const axios = require('axios');

const deepgramApiKey = process.env.deepgram;
const deepgram = new Deepgram(deepgramApiKey);


const upload = async (req, res) => {
    const id = req.params.id;
    try {
        const filePath = req.file?.path;
        const buffer = fs.readFileSync(filePath);
        const bufferBody = req.file?.buffer;

        const bufferOption = buffer || bufferBody;

        const mp4Readable = new Readable();
        mp4Readable._read = () => { };
        mp4Readable.push(bufferOption);
        mp4Readable.push(null);

        const outputFileName = `video_${id}.webm`;
        const outputDir = "./public";
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true }); // Create the directory if it doesn't exist.
        }
        const outputPath = path.join(outputDir, outputFileName);
        const outputMP4Stream = fs.createWriteStream(outputPath);
        // Pipe the mp4Readable stream into the outputMP4Stream
        mp4Readable.pipe(outputMP4Stream);

        // Optional: You can listen for events to handle errors and completion
        outputMP4Stream.on("error", (error) => {
            console.error("Error writing to outputMP4Stream:", error);
        });

        outputMP4Stream.on("finish", () => {
            console.log("Finished writing to outputMP4Stream");
        });

        return res.status(200).json({
            message: "File uploaded successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "failed",
        });
    }
};


const getVideo = async (req, res) => {
    const outputDir = "./public";
    const id = req.params["id"]; // Assuming you have obtained the 'id' from your request

    if (fs.existsSync(outputDir)) {
        // Check if the directory exists
        const files = fs.readdirSync(outputDir);
        let filePaths = [];
        console.log(files);

        for (const file of files) {
            const filename = file;
            const regex = /video_(\d+)\.mp4/;
            const match = filename.match(regex);

            if (match && match[1]) {
                const numberPart = match[1];
                if (id === numberPart) {
                    // Match found, construct the file path and return it
                    const filePath = path.join(outputDir, filename);
                    return res.status(200).json({
                        filePath: filePath,
                    });
                }
            } else {
                console.error("No match found or no number part in the filename.");
            }
        }

        // If the loop finishes without returning, it means no matching file was found
        return res.status(404).json({
            error: "File not found for the given id.",
        });
    } else {
        console.error("Directory does not exist:", outputDir);
        return res.status(500).json({
            error: "Server error: Directory not found.",
        });
    }
}

const generateId = async (req, res) => {
    function generateRandomNumber(count) {
        const randomNumber = [];
        for (let i = 0; i < count; i++) {
            randomNumber.push(Math.floor(Math.random() * randomNumber.length));
        }
        return randomNumber;
    }
    const randNum = generateRandomNumber(5);
    const randJoin = randNum.join("");
    return res.status(200).json({
        id: randJoin,
    });
}


const transcribe = async (req, res) => {
    const { id } = req.params;
    const outputDir = "./public";

    const files = fs.readdirSync(outputDir);
    let filePath = ""; // Initialize filePath outside the loop
    let filename = "";

    for (const file of files) {
        filename = file;
        const regex = /video_(\d+)\.webm/;
        const match = filename.match(regex);

        if (match && match[1]) {
            const numberPart = match[1];
            if (id === numberPart) {
                // Match found, construct the file path and store it
                filePath = path.join(outputDir, filename);
                break; // Exit the loop once a match is found
            }
        }
    }
    try {
        // Ensure that the 'deepgram' client is properly configured with your API credentials
        const protocol = req.protocol;
        const host = req.get("host");
        const baseUrl = `${protocol}://${host}`;
        console.log(baseUrl);

        const response = await deepgram.transcription.preRecorded(
            { url: baseUrl + filename },
            { punctuate: true, utterances: true }
        );

        const srtTranscript = response.toSRT();
        res.status(200).json({
            status: "Success",
            transcript: srtTranscript,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "internal server error" });
    }
}

const getAllVideo = async (req, res) => {
    try {
        const baseUrl = 'https://chrome-ext-api-ogx8.onrender.com';
        const folderPath = '/public';
        const url = baseUrl + folderPath;

        // Make a GET request to the URL
        const response = await axios(url);

        if (!response) {
            return res.status(404).json({
                message: 'Failed to retrieve files from the URL',
                error: error.message
            });
        }

        // Assuming the response is an array of files or file names
        const files = response.data;

        return res.status(200).json({
            files,
            url: baseUrl // Return the base URL
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: 'Failed to retrieve files from the URL',
            error: error.message
        });
    }
}

module.exports = {
    upload,
    getVideo,
    generateId,
    transcribe,
    getAllVideo
}