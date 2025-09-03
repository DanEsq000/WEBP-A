const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static(".")); // sirve index.html

const FRAMES_DIR = path.join(__dirname, "uploads", "frames");
if (!fs.existsSync(FRAMES_DIR)) fs.mkdirSync(FRAMES_DIR, { recursive: true });

// Subir lote de frames
app.post("/upload-batch", upload.array("frame"), (req, res) => {
  try {
    req.files.forEach(file => {
      const dest = path.join(FRAMES_DIR, path.basename(file.originalname));
      fs.renameSync(file.path, dest);
    });
    res.json({ ok: true, count: req.files.length });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error guardando lote");
  }
});

// Armar animación final
app.post("/finalize", (req, res) => {
  try {
    const files = fs.readdirSync(FRAMES_DIR)
      .filter(f => f.endsWith(".webp"))
      .sort((a, b) => {
        const ai = parseInt(a.match(/\d+/));
        const bi = parseInt(b.match(/\d+/));
        return ai - bi;
      })
      .map(f => path.join(FRAMES_DIR, f));

    if (files.length === 0) return res.status(400).send("No hay frames");

    const fps = 15;
    const delay = Math.round(1000 / fps);

    let cmd = files.map(f => `-frame ${f} +${delay}`).join(" ");
    cmd += " -loop 0 -o uploads/anim.webp";

    exec(`webpmux ${cmd}`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error creando animación");
      }

      const animPath = path.join(__dirname, "uploads", "anim.webp");
      res.setHeader("Content-Type", "image/webp");
      const stream = fs.createReadStream(animPath);
      stream.pipe(res);

      stream.on("close", () => {
        // limpiar frames y animación
        fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
        fs.mkdirSync(FRAMES_DIR, { recursive: true });
        fs.unlinkSync(animPath);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error finalizando animación");
  }
});

app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
