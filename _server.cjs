// 무대 슬라이드 로컬 서버 — 이 폴더를 http://localhost:3000 으로 서빙(_서버시작.bat 더블클릭)
const http = require("http");
const fs = require("fs");
const path = require("path");
const ROOT = __dirname;
const PORT = parseInt(process.env.PORT || "3000", 10);
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml", ".woff2": "font/woff2", ".m4a": "audio/mp4",
  ".mp3": "audio/mpeg", ".wav": "audio/wav", ".ogg": "audio/ogg",
  ".png": "image/png", ".jpg": "image/jpeg", ".gs": "text/plain; charset=utf-8",
};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/admin.html"; // 기본: 운영 콘솔
  const fp = path.join(ROOT, p);
  if (!fp.startsWith(ROOT)) { res.writeHead(403); res.end("forbidden"); return; }
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found: " + p); return; }
    res.writeHead(200, { "Content-Type": MIME[path.extname(fp)] || "application/octet-stream" });
    res.end(data);
  });
}).listen(PORT, "127.0.0.1", () => {
  console.log("");
  console.log("  무대 슬라이드 서버 실행 중 →  http://localhost:" + PORT);
  console.log("");
  console.log("  운영 콘솔  : http://localhost:" + PORT + "/admin.html");
  console.log("  시상 발표  : http://localhost:" + PORT + "/awards.html");
  console.log("  심사위원안내: http://localhost:" + PORT + "/guidance.html");
  console.log("");
  console.log("  * 이 창을 닫으면 서버가 꺼집니다. 행사 동안 열어두세요.");
});
