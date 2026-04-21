require("dotenv").config();
const mongoose = require("mongoose");
const url = process.env.MONGODB_URI;
if (process.argv.length === 4) {
  // creates new contact

  // console.log(url);
  mongoose.set("strictQuery", false);

  mongoose.connect(url);

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "the name must be included"],
      minLength: [3, "the name must be at least 3 letters long"],
    },
    number: {
      type: String,
      required: [true, "the number must be included"],
      minLength: [8, "the number must be at least 8 letters long"],
      validate: {
        validator: function (v) {
          return /^\d{2,3}-\d{4,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
  });
  const Person = mongoose.model("Person", personSchema);
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3],
  });

  person.save().then((result) => {
    console.log(
      `added ${result.name} number ${result.number} to the phonebook`
    );
    mongoose.connection.close();
  });
} else if (process.argv.length === 2) {
  // lists all contacts

  // console.log(url);
  mongoose.set("strictQuery", false);

  mongoose.connect(url);

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "the name must be included"],
      minLength: [3, "the name must be at least 3 letters long"],
    },
    number: {
      type: String,
      required: [true, "the number must be included"],
      minLength: [8, "the number must be at least 8 letters long"],
      validate: {
        validator: function (v) {
          return /^\d{2,3}-\d{4,}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
  });
  const Person = mongoose.model("Person", personSchema);

  Person.find({}).then((result) => {
    console.log("phonebook: ");
    result.forEach((person) => {
      console.log(person.name, " ", person.number);
    });

    mongoose.connection.close();
  });
} else {
  console.log("badly inputed variables");
  process.exit(1);
}
