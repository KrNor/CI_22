const express = require("express");
require("dotenv").config();
const app = express();
var morgan = require("morgan");
app.use(express.json());
const cors = require("cors");
app.use(express.static("dist"));
app.use(cors());

const Person = require("./models/person");

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((personn) => response.json(personn))
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  const idOfReqPerson = request.params.id;

  Person.findById(idOfReqPerson)
    .exec()
    .then((personn) => {
      if (personn) {
        response.json(personn);
      } else {
        response.status(404).json({ person: "Not Found" });
      }
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  Person.estimatedDocumentCount()
    .then((res) => {
      response.send(
        `<p>The Phonebook has information about ${res} people</p><p>${new Date(
          Date.now()
        )}</p>`
      );
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const idOfReqPerson = request.params.id;

  const updatedPerson = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(idOfReqPerson, updatedPerson, {
    new: true,
    runValidators: true,
  })
    .exec()
    .then((personn) => {
      if (personn) {
        response.json(personn);
      } else {
        response.status(404).json({ person: "Not Found" });
      }
    })
    .catch((error) => {
      console.log(error.response);
      next(error);
    });
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });
  newPerson
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => {
      next(error);
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted/bad id" });
  }
  if (error.name === "SyntaxError") {
    return response.status(400).send({ error: "Syntax error " });
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
