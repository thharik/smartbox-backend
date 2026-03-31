#!/usr/bin/env node
/**
 * SmartBox — Upload de vídeos para o Backblaze B2
 *
 * Como usar:
 *   1. npm install @aws-sdk/client-s3
 *   2. Copie .env.example para .env e preencha B2_*
 *   3. node upload-videos.js ./pasta-com-videos
 *
 * O B2 é compatível com a API S3 da Amazon, por isso usamos o SDK da AWS.
 */

require("dotenv").config({ path: "../backend/.env.example" });
require("dotenv").config({ path: "../backend/.env" });

const { S3Client, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const fs   = require("fs");
const path = require("path");

const B2_ENDPOINT   = `https://s3.us-west-004.backblazeb2.com`; // troque pela região do seu bucket
const BUCKET        = process.env.B2_BUCKET_NAME || "smartbox-videos";
const PUBLIC_URL    = process.env.B2_PUBLIC_URL  || "";

const client = new S3Client({
  endpoint:        B2_ENDPOINT,
  region:          "us-west-004",               // troque pela região do bucket
  credentials: {
    accessKeyId:     process.env.B2_APPLICATION_KEY_ID,
    secretAccessKey: process.env.B2_APPLICATION_KEY,
  },
});

async function uploadArquivo(filePath, keyRemoto) {
  const conteudo  = fs.readFileSync(filePath);
  const tamanhoMB = (fs.statSync(filePath).size / 1024 / 1024).toFixed(1);

  console.log(`⬆  Enviando ${path.basename(filePath)} (${tamanhoMB} MB)...`);

  await client.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         keyRemoto,
    Body:        conteudo,
    ContentType: "video/mp4",
  }));

  const urlPublica = PUBLIC_URL
    ? `${PUBLIC_URL}/file/${BUCKET}/${keyRemoto}`
    : `https://f005.backblazeb2.com/file/${BUCKET}/${keyRemoto}`;

  console.log(`✅ Enviado! URL: ${urlPublica}\n`);
  return urlPublica;
}

async function uploadPasta(pastaLocal, prefixoRemoto = "videos") {
  const arquivos = fs.readdirSync(pastaLocal).filter(f =>
    [".mp4", ".mkv", ".avi", ".mov", ".webm"].includes(path.extname(f).toLowerCase())
  );

  if (!arquivos.length) {
    console.log("Nenhum vídeo encontrado na pasta:", pastaLocal);
    return;
  }

  console.log(`\n📦 ${arquivos.length} vídeo(s) encontrado(s) em: ${pastaLocal}\n`);

  const urls = {};
  for (const arquivo of arquivos) {
    const filePath   = path.join(pastaLocal, arquivo);
    const keyRemoto  = `${prefixoRemoto}/${arquivo}`;
    urls[arquivo] = await uploadArquivo(filePath, keyRemoto);
  }

  console.log("\n━━━ URLs para colocar no banco / data.js ━━━");
  Object.entries(urls).forEach(([nome, url]) => {
    console.log(`${nome}: "${url}"`);
  });
}

// Execução
const pastaArg = process.argv[2];
if (!pastaArg) {
  console.error("Uso: node upload-videos.js ./pasta-com-videos");
  process.exit(1);
}

if (!process.env.B2_APPLICATION_KEY_ID || !process.env.B2_APPLICATION_KEY) {
  console.error("Preencha B2_APPLICATION_KEY_ID e B2_APPLICATION_KEY no .env");
  process.exit(1);
}

uploadPasta(path.resolve(pastaArg)).catch(console.error);
