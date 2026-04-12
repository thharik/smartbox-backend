require("dotenv").config({ path: "./backend/.env" });

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

const B2_ENDPOINT = "https://s3.us-west-004.backblazeb2.com";
const BUCKET = process.env.B2_BUCKET_NAME;

const client = new S3Client({
  endpoint: B2_ENDPOINT,
  region: "us-west-004",
  credentials: {
    accessKeyId: process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

function getContentType(file) {
  const ext = path.extname(file).toLowerCase();

  if (ext === ".mp4") return "video/mp4";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".pdf") return "application/pdf";

  return "application/octet-stream";
}

async function uploadArquivo(filePath) {
  const nome = path.basename(filePath);
  const fileBuffer = fs.readFileSync(filePath);

  console.log(`⬆ Enviando: ${nome}`);

  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: nome, // 🔥 SEM PASTA (IMPORTANTE)
      Body: fileBuffer,
      ContentType: getContentType(nome),
    })
  );

  const url = `https://f005.backblazeb2.com/file/${BUCKET}/${nome}`;

  console.log(`✅ OK: ${url}\n`);
  return url;
}

async function uploadPasta(pasta) {
  const arquivos = fs.readdirSync(pasta);

  for (const arquivo of arquivos) {
    const filePath = path.join(pasta, arquivo);

    if (fs.statSync(filePath).isFile()) {
      await uploadArquivo(filePath);
    }
  }

  console.log("🚀 TODOS OS ARQUIVOS ENVIADOS!");
}

const pasta = process.argv[2];

if (!pasta) {
  console.log("Uso: node upload-videos.js caminho_da_pasta");
  process.exit();
}

uploadPasta(pasta).catch(console.error);