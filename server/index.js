const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const readline = require("readline");
const filesDir = path.join(__dirname, "files");

if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}
//use cors to allow cross origin resource sharing

// ***********************************************************
// TODO: add an OpenAI call to ask if the current document conflict with any of the previous prompt completion pairs before adding it to the collection.
// ***********************************************************

const app = express();
app.use(
  cors({
    origin: "*", // or replace '*' with the specific origin you want to allow, e.g., 'http://localhost:8080'
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// allow any browser to access the server
app.use(express.json());
// POST endpoint for creating a new JSONL file

// GET endpoint for retrieving the list of files
app.get("/files", (req, res) => {
  fs.readdir(filesDir, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving files");
    } else {
      res.send(files);
    }
  });
});

app.post("/create", (req, res) => {
  try {
    const { filename } = req.body;
    const fileContent = "";
    const filePath = path.join(__dirname, "files", `${filename}.jsonl`);

    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error creating file");
      } else {
        console.log(`File '${filename}.jsonl' created.`);
        res.send(`File '${filename}.jsonl' created.`);
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error in /create endpoint");
  }
});

// POST endpoint for adding a line to an existing JSONL file
app.post("/add-line", (req, res) => {
  const { filename, prompt, completion } = req.body;
  const filePath = path.join(__dirname, "files", `${filename}`);

  // Replace newline characters with spaces
  const formattedPrompt = prompt.replace(/\r?\n|\r/g, " ");
  const formattedCompletion = completion.replace(/\r?\n|\r/g, " ");

  const fileContent = `{"prompt": "${formattedPrompt}? \\n\\n###\\n\\n", "completion": " ${formattedCompletion}. ###\\n"}`;

  //Adding one prompt and completion to the file at a time to ensure that the inputs are being read by the user and not just an automated process.
  fs.appendFile(filePath, fileContent + "\n", (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error adding line to file");
    } else {
      console.log(`Prompt and completion added to '${filename}'.`);
      res.send(`Prompt and completion added to '${filename}'.`);
    }
  });
});

app.get("/combine-all", async (req, res) => {
  try {
    const directoryPath = "./files"; // directory where your JSONL files are located
    const outputFilePath = "./data/collections.jsonl"; // output file path

    // delete collections.jsonl if it exists
    if (fs.existsSync(outputFilePath)) {
      fs.unlinkSync(outputFilePath);
    }

    const files = fs
      .readdirSync(directoryPath)
      .filter((file) => file.endsWith(".jsonl"));
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });
      for await (const line of rl) {
        fs.appendFileSync(outputFilePath, line + "\n");
      }
    }
    res.send("Files combined successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while combining files.");
  }
});

// POST endpoint for adding a JSONL file to the collection
app.post("/add-to-collection", (req, res) => {
  const { filename } = req.body;
  const filePath = path.join(__dirname, "files", `${filename}`);
  console.log(filePath);
  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send(`File '${filename}' not found.`);
      return;
    }

    const collectionPath = path.join(__dirname, "data", "collection.jsonl");
    const readStream = fs.createReadStream(filePath);
    const writeStream = fs.createWriteStream(collectionPath, { flags: "a" });
    readStream.pipe(writeStream);

    readStream.on("close", () => {
      console.log(`File '${filename}' added to collection.`);
      res.send(`File '${filename}' added to collection.`);
    });

    readStream.on("error", (error) => {
      console.error(error);
      res.status(500).send("Error adding file to the collection.");
    });
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
