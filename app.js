const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
//data:
const rows = [
  {
    id: 1,
    topic: "advanced js",
    duration: "2 hrs",
    link: "https://w3schools.com",
    hidden: false,
  },
  {
    id: 2,
    topic: "high order functions",
    duration: "1 hr",
    link: "https://w3schools.com",
    hidden: false,
  },
  {
    id: 3,
    topic: "Dom manipulation",
    duration: "1 hr 45 min",
    link: "https://w3schools.com",
    hidden: true,
  },
];
//CRUD ASSIGNMENT 3
//1. CREATE (/items)
app.post("/items", (req, res) => {
  // Extract the topic, duration, and link from the request body
  const newTopic = req.body.topic; // TITLE
  const duration = req.body.duration; // DURATION
  const newLink = req.body.link; // LINK

  // Calculate the new item's ID
  const newId = rows.length + 1;

  // Format the duration
  let newDuration = '';
  if (duration < 60) {
      newDuration = `${duration} min`;
  } else if (duration == 60) {
      newDuration = `1 hr`;
  } else {
      newDuration = `${Math.floor(duration / 60)} hr ${duration % 60} min`;
  }

  // Create a new item object
  const row = {
      id: newId,
      topic: newTopic,
      duration: newDuration,
      link: newLink,
      hidden: false,
  };

  // Add the new item to the rows array
  rows.push(row);

  // Respond with the newly created item
  res.status(201).json(row);
});

//Implement a GET route (/items/:id) to retrieve a single item by its ID.
app.get("/items", (req, res) => {
  // Initialize an empty array to hold the output
  let output = [];

  // Check if a filter query parameter is provided
  const filter = req.query.filter;
  if (filter) {
      if (filter === "hide") {
          // Filter rows where hidden is true
          output = rows.filter((row) => row.hidden === true);
      } else if (filter === "show") {
          // Filter rows where hidden is false
          output = rows.filter((row) => row.hidden === false);
      } else {
          // Invalid filter value
          return res.status(404).send("ERROR 404; Page Not Found");
      }
  } else {
      // By default, return all items
      output = [...rows];
  }

  // Respond with the filtered or full list of items
  res.status(200).json(output);
});

//4 DELETE (/items/:id)
app.delete("/items/:id", (req, res) => {
  //Implement a DELETE route (/items/:id) to delete an item by its ID.
  const id = parseInt(req.params.id);
  let deleted = {};
  if (id >= 1 && id <= rows.length) {
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) {
      res.status(404).send("Requested Item Not Found");
    } else {
      deleted = rows[index];
      rows.splice(index, 1);
      res.send(`Found and Deleted Item Successfully: ${deleted}`);
    }
  } else {
    res.status(406).send("Given Id is invalid and not acceptable");
  }
});
//5 PATCH (/items/:id)
app.patch("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let filter = req.body.hidden.toLowerCase(); //true or false
  if (filter === "true") {
    filter = true;
  } else if (filter === "false") {
    filter = false;
  } else {
    res.status(404).send("Given Filter is Invalid!");
    return;
  }
  if ((id >= 1 && id <= rows.length) || !isNaN(id)) {
    const index = rows.findIndex((row) => row.id === id);
    if (index === -1) {
      res.status(404).send("Requested Item Not Found");
    } else {
      if (rows[index].hidden === true && filter === false) {
        rows[index].hidden = false;
        // output = "Hidden Status Changed to False!";
        res
          .status(200)
          .send(
            `Hidden Status Changed to False: ${JSON.stringify(rows[index])}`
          );
      } else if (rows[index].hidden === false && filter === true) {
        rows[index].hidden = true;
        res
          .status(200)
          .send(
            `Hidden Status Changed to True: ${JSON.stringify(rows[index])}`
          );
      } else {
        res.status(200).send("Sorry, Given Request Cannot be Fulfiled!");
      }
    }
  } else {
    res.status(406).send("Given Id is invalid and not acceptable");
  }
});
//listen:
app.listen(3000, () => {
  console.log("server listening at http://localhost:3000/");
});