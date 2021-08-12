import express from "express";
import * as path from "path";
import * as fs from "fs/promises";
import Handlebars from "handlebars";
import exphbs from "express-handlebars";

const PORT = 8080;
const WEB = "web";
const ZMONES = "zmones.json";

const app = express();
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.urlencoded({
   extended: true
}));
app.use(express.json());
app.use(express.static(WEB, {
   index: false,
}));

/*
C - create
R - retrieve
U - update
D - delete
*/
app.get("/", async (req, res) => {
   try {
      let zmones = await fs.readFile(ZMONES, {
         encoding: "utf-8",
      });
      zmones = JSON.parse(zmones);

      res.render("zmones", {
         zmones,
         title: "Zmones",
      });
   } catch (err) {
      res.status(500).end(err.msg);
   }
});
app.get("/zmogus/:id?", async (req, res) => {
   try {
      let zmones = await fs.readFile(ZMONES, {
         encoding: "utf-8",
      });
      zmones = JSON.parse(zmones);
      const id = parseInt(req.params.id);
      let zmogus = zmones.find((z) => z.id === id);

      res.render("zmogus", {
         zmogus,
         title: "Vienas zmogus",
      });
   } catch (err) {
      res.status(500).end(err.msg);
   }
});
app.get("/zmogus/:id/delete", async (req, res) => {
   try {
      let zmones = await fs.readFile(ZMONES, {
         encoding: "utf-8",
      });
      zmones = JSON.parse(zmones);
      const id = parseInt(req.params.id);
      let index = zmones.findIndex((z) => z.id === id);
      if (index >= 0) {
         zmones.splice(index, 1);
      }
      await fs.writeFile(ZMONES, JSON.stringify(zmones, null, 2), {
         encoding: "utf-8",
      });
      res.redirect("/");
   } catch (err) {
      res.status(500).end(err.msg);
   }
});
app.post("/zmogus/save", async (req, res) => {
   try {
      let zmones = await fs.readFile(ZMONES, {
         encoding: "utf-8",
      });
      zmones = JSON.parse(zmones);
      let zmogus;
      if (req.body.id) {
         const id = parseInt(req.body.id);
         zmogus = zmones.find((z) => z.id === id);
      } else {
         zmogus = {};
      }
      if (zmogus) {
         zmogus.vardas = req.body.vardas;
         zmogus.pavarde = req.body.pavarde;
         zmogus.alga = parseFloat(req.body.alga);
         if (!req.body.id) {
            let nextId = 0;
            for (const zmogus of zmones) {
               if (nextId < zmogus.id) {
                  nextId = zmogus.id;
               }
            }
            nextId++;
            zmogus.id = nextId;
            zmones.push(zmogus);
         }
         await fs.writeFile(ZMONES, JSON.stringify(zmones, null, 2), {
            encoding: "utf-8",
         });
      }
      res.redirect("/");
   } catch (err) {
      console.log(err);
      res.status(500).end(err.msg);
   }
});




app.get("/json/zmones", async (req, res) => {
   try {
      let zmones = await fs.readFile(ZMONES, {
         encoding: "utf-8",
      });
      zmones = JSON.parse(zmones);
      res.set("Content-Type", "application/json");
      res.send(JSON.stringify(zmones));
   } catch (err) {
      res.status(500).end(err.msg);
   }
});
app.use("/json/zmones", async (req, res, next) => {
   if (req.method.toUpperCase() !== "PUT" && req.method.toUpperCase() !== "POST") {
      return next();
   }
   try {
      let zmones = await fs.readFile(ZMONES, {
         encoding: "utf-8",
      });
      zmones = JSON.parse(zmones);
      let zmogus;
      if (req.body.id) {
         const id = parseInt(req.body.id);
         zmogus = zmones.find((z) => z.id === id);
      } else {
         zmogus = {};
      }
      if (zmogus) {
         zmogus.vardas = req.body.vardas;
         zmogus.pavarde = req.body.pavarde;
         zmogus.alga = parseFloat(req.body.alga);
         if (!req.body.id) {
            let nextId = 0;
            for (const zmogus of zmones) {
               if (nextId < zmogus.id) {
                  nextId = zmogus.id;
               }
            }
            nextId++;
            zmogus.id = nextId;
            zmones.push(zmogus);
         }
         await fs.writeFile(ZMONES, JSON.stringify(zmones, null, 2), {
            encoding: "utf-8",
         });
      }
      res.set("Content-Type", "application/json");
      res.send(JSON.stringify(zmogus));
   } catch (err) {
      console.log(err);
      res.status(500).end(err.msg);
   }
});

app.delete("/json/zmones/:id", async (req, res) => {
   try {
      let zmones = await fs.readFile(ZMONES, {
         encoding: "utf-8",
      });
      zmones = JSON.parse(zmones);
      const id = parseInt(req.params.id);
      let index = zmones.findIndex((z) => z.id === id);
      if (index >= 0) {
         zmones.splice(index, 1);
      }
      await fs.writeFile(ZMONES, JSON.stringify(zmones, null, 2), {
         encoding: "utf-8",
      });
      res.status(204).end();
   } catch (err) {
      res.status(500).end(err.msg);
   }
});

app.listen(PORT);
console.log(`Server started on port ${PORT}`);