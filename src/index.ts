import express from "express";
import { S3 } from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY
const queueUrl = process.env.QUEUE_URL
const bucketRegion = process.env.BUCKET_REGION
const bucketName = process.env.BUCKET_NAME


if (!bucketName || !bucketRegion || !accessKey || !secretAccessKey || !queueUrl) {
    throw new Error("One or more environment variables are undefined.");
}

const s3 = new S3({
    credentials:{
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,

    },
    region: bucketRegion
    
})

const app = express();


app.get("/*", async (req, res) => {
    // id.100xdevs.com
    const host = req.hostname;

    const id = host.split(".")[0];


    const filePath = req.path;
    console.log("filePath",filePath);
    console.log("key",`dist/${id}/dist${filePath}`)
    const contents = await s3.getObject({
        Bucket: bucketName,
        Key: `dist/${id}/dist${filePath}`
    }).promise();
    
    const type =
  filePath.endsWith("html")
    ? "text/html"
    : filePath.endsWith("css")
    ? "text/css"
    : filePath.endsWith("png")
    ? "image/png"
    : filePath.endsWith(".svg")
    ? "image/svg+xml"
    : "application/javascript";

res.set("Content-Type", type);

    res.send(contents.Body);
})

app.listen(3001);