import express from "express";
import * as path from "path";
import * as fs from "fs/promises";

const PORT = 3000;
const WEB = "web";
const app = express();

app.use(express.static(WEB));

// app.use(async (req, res, next) => {
//     console.log("tikrinu " + req.path);
//     const fileName = path.join(WEB, req.path);
//     try {
//         const stats = await fs.stat(fileName);
//         if (stats.isFile()) {
//             const data = await fs.readFile(fileName, {
//                 encoding: "utf-8"
//             });
//             res.send(data);
//         } else {
//             next();
//         }
//     } catch (err) {
//         next();
//     }
// });

app.get("/", (req, res) => {
   console.log("atejo uzklausa i /");
   res.status(200);
   res.send("<html><body><h1>Hello World!!!</h1></body></html>");
});

app.get("/labas", (req, res) => {
   console.log("atejo uzklausa i /labas");
   res.status(200);
   res.send("<html><body><h1>Labas Pasauli!!!</h1></body></html>");
});

app.listen(PORT);
console.log(`Server started on port ${PORT}`);