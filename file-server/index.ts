import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
export const app = express();
const port = 1337;

app.use(fileUpload());
app.use(cors());

app.get("/", (_req: any, res: { send: (arg0: string) => void; }) => {
  res.send("file server running");
});

app.post("/upload", (req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { msg: string; }): any; new(): any; }; send: any; }; json: (arg0: { message: string; }) => void; }) => {
  console.log(req.files);
  if (req.files === null || Object.keys(req.files).length === 0) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  const file: any = Object.values(req.files)[0];
  if (file.mimetype !== "application/pdf") {
    return res.status(400).json({ msg: "Only pdf files are allowed" });
  }
  file.mv(`${__dirname}/uploads/${file.name}`, (err: any) => {
    if (err) {
      console.error(err);
      return res.status(500).send
    }
  });
  res.status(200);
  res.json({ message: "file saved successfully" })
});


app.get("/download/:fileName", async (req: { params: { fileName: any; }; }, res: { sendFile: (arg0: string) => void; status: (arg0: number) => void; json: (arg0: { error: string; }) => void; }) => {
  const filepath = `${__dirname}/uploads/${req.params.fileName}`;
  const file = Bun.file(filepath);
  if (await file.exists()) {
    console.log("file exists", filepath);
    res.sendFile(filepath);
  } else {
    res.status(404);
    res.json({ error: "File not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
console.log("Hello via Bun!");

