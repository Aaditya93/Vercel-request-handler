"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = require("aws-sdk");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const queueUrl = process.env.QUEUE_URL;
const bucketRegion = process.env.BUCKET_REGION;
const bucketName = process.env.BUCKET_NAME;
if (!bucketName || !bucketRegion || !accessKey || !secretAccessKey || !queueUrl) {
    throw new Error("One or more environment variables are undefined.");
}
const s3 = new aws_sdk_1.S3({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: bucketRegion
});
const app = (0, express_1.default)();
app.get("/*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // id.100xdevs.com
    const host = req.hostname;
    const id = host.split(".")[0];
    const filePath = req.path;
    console.log("filePath", filePath);
    console.log("key", `dist/${id}/dist${filePath}`);
    const contents = yield s3.getObject({
        Bucket: bucketName,
        Key: `dist/${id}/dist${filePath}`
    }).promise();
    const type = filePath.endsWith("html")
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
}));
app.listen(3001);
