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


//import { Hono } from 'hono'
//import { serveStatic } from 'hono/bun'
//import { cors } from 'hono/cors'
//import { streamToFile } from 'bun'
//
//const app = new Hono()
//const port = 1337
//
//app.use('*', cors())
//
//app.get('/', (c) => c.text('file server running'))
//
//app.post('/upload', async (c) => {
//  const file = await c.req.file('file')
//  if (!file) {
//    return c.json({ msg: 'No file uploaded' }, 400)
//  }
//
//  if (file.type !== 'application/pdf') {
//    return c.json({ msg: 'Only pdf files are allowed' }, 400)
//  }
//
//  const filePath = `${import.meta.dir}/uploads/${file.name}`
//  try {
//    await streamToFile(file.stream(), filePath)
//    return c.json({ message: 'file saved successfully' }, 200)
//  } catch (err) {
//    console.error(err)
//    return c.json({ msg: 'Error saving file' }, 500)
//  }
//})
//
//app.get('/download/:fileName', async (c) => {
//  const fileName = c.req.param('fileName')
//  const filePath = `${import.meta.dir}/uploads/${fileName}`
//  const file = Bun.file(filePath)
//
//  if (await file.exists()) {
//    console.log('file exists', filePath)
//    return c.newResponse(file.stream())
//  } else {
//    return c.json({ error: 'File not found' }, 404)
//  }
//})
//
//app.use('/uploads/*', serveStatic({ root: './uploads' }))
//
//console.log(`Server is running at http://localhost:${port}`)
//export default {
//  port,
//  fetch: app.fetch
//}
//
//console.log('Hello via Bun!')
