let zmones = [];

function showZmones() {
   // printChildNodes(document.body);
   const app = document.getElementById("app");
   cleanNode(app);
   const table = document.createElement("table");
   for (const zmogus of zmones) {
      const tr = document.createElement("tr");
      let td = document.createElement("td");
      td.appendChild(document.createTextNode(zmogus.vardas));
      td.zmogusId = zmogus.id;
      td.onclick = showEditZmogus;
      tr.appendChild(td);
      td = document.createElement("td");
      td.appendChild(document.createTextNode(zmogus.pavarde));
      td.zmogusId = zmogus.id;
      td.onclick = showEditZmogus;
      tr.appendChild(td);
      td = document.createElement("td");
      td.appendChild(document.createTextNode(zmogus.alga));
      tr.appendChild(td);
      td = document.createElement("td");
      let button = document.createElement("button");
      button.appendChild(document.createTextNode("X"));
      button.zmogusId = zmogus.id;
      button.onclick = deleteZmogus;
      td.appendChild(button);
      tr.appendChild(td);
      table.appendChild(tr);
   }
   app.appendChild(table);
}

function showEditZmogus(event) {
   let zmogus;
   if (event) {
      console.log(event.target);
      const zmogusId = event.target.zmogusId;
      zmogus = zmones.find((z) => z.id === zmogusId);
   }
   const app = document.getElementById("app");
   cleanNode(app);
   let input;
   if (zmogus) {
      input = document.createElement("input");
      input.type = "hidden";
      input.id = "id";
      input.value = zmogus.id;
      app.appendChild(input);
   }
   app.appendChild(document.createTextNode("Vardas:"));
   input = document.createElement("input");
   input.type = "text";
   input.id = "vardas";
   if (zmogus) {
      input.value = zmogus.vardas;
   }
   app.appendChild(input);
   app.appendChild(document.createTextNode("Pavarde:"));
   input = document.createElement("input");
   input.type = "text";
   input.id = "pavarde";
   if (zmogus) {
      input.value = zmogus.pavarde;
   }
   app.appendChild(input);
   app.appendChild(document.createTextNode("Alga:"));
   input = document.createElement("input");
   input.type = "text";
   input.id = "alga";
   if (zmogus) {
      input.value = zmogus.alga;
   }
   app.appendChild(input);
   let button = document.createElement("button");
   button.appendChild(document.createTextNode("Save"));
   button.onclick = saveZmogus;
   app.appendChild(button);
   button = document.createElement("button");
   button.appendChild(document.createTextNode("Cancel"));
   button.onclick = showZmones;
   app.appendChild(button);
}

async function getZmones() {
   try {
      let res = await fetch("/json/zmones");
      if (res.ok) {
         zmones = await res.json();
         showZmones();
      } else {
         alert(`Request failed with status ${res.status}`);
      }
   } catch (err) {
      alert(err.message);
   }
}

async function saveZmogus() {
   console.log("saving");
   let zmogus = {
      vardas: document.getElementById("vardas").value,
      pavarde: document.getElementById("pavarde").value,
      alga: document.getElementById("alga").value,
   };
   const idEl = document.getElementById("id");
   if (idEl) {
      zmogus.id = parseInt(idEl.value);
   }
   console.log(zmogus);
   try {
      let res = await fetch("/json/zmones", {
         method: (zmogus.id) ? "PUT" : "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(zmogus),
      });
      if (res.ok) {
         zmogus = await res.json();
         const index = zmones.findIndex((z) => z.id === zmogus.id);
         if (index >= 0) {
            zmones.splice(index, 1, zmogus);
         } else {
            zmones.push(zmogus);
         }
      } else {
         alert(`Request failed with status ${res.status}`);
      }
   } catch (err) {
      alert(err.message);
   }
   showZmones();
}

async function deleteZmogus(event) {
   const zmogusId = event.target.zmogusId;
   const index = zmones.findIndex((z) => z.id === zmogusId);
   if (index >= 0) {
      try {
         const res = await fetch("/json/zmones/" + zmogusId, {
            method: "DELETE",
         });
         if (res.ok) {
            console.log("trinam");
            zmones.splice(index, 1);
            showZmones();
         } else {
            alert(`Request failed with status ${res.status}`);
         }
      } catch (err) {
         alert(err.message);
      }
   }
}

function cleanNode(node) {
   if (node) {
      while (node.firstChild) {
         node.firstChild.remove();
      }
   }
}

function printChildNodes(node, space = 0) {
   if (!node) {
      return;
   }
   if (node instanceof Element) {
      console.log(" ".repeat(space) + node.tagName);
   } else if (node instanceof Text) {
      console.log(" ".repeat(space) + node.nodeValue);
   }
   const children = node.childNodes;
   if (children && children.length > 0) {
      for (const child of children) {
         printChildNodes(child, space + 2);
      }
   }
}