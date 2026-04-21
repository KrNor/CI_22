import { useState, useEffect } from "react";
import contactsService from "./services/contacts";

import Numbers from "./components/Numbers";
import PersonForm from "./components/PersonForm";
import PhoneBook from "./components/PhoneBook";

const Notification = ({ message, isErr }) => {
  if (message === null) {
    return null;
  }
  if (isErr) {
    return <div className="error">{message}</div>;
  }

  return <div className="success">{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setnewNumber] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isError, setNewisError] = useState(true);

  useEffect(() => {
    contactsService.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);
  const changeName = (event) => {
    setNewName(event.target.value);
  };
  const changeNumber = (event) => {
    setnewNumber(event.target.value);
  };
  const changeSearch = (event) => {
    setNewSearch(event.target.value);
  };
  const delContact = (event) => {
    if (
      window.confirm(
        `are you sure you want to delete the contact "${
          persons.find((val) => val.id === event).name
        }"?`
      )
    ) {
      contactsService
        .deleteContact(event)
        .then((pres) => {
          contactsService.getAll().then((response) => {
            setPersons(response.data);
          });
        })
        .catch((error) => {
          setNewisError(true);
          setErrorMessage(
            `the contact you wanted to delete is already deleted !`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 20000);
        });
    }
  };
  const addContact = (event) => {
    event.preventDefault();

    if (newName.length < 1) {
      window.alert(`the name: "${newName}" is invalid!`);
      {
        setNewisError(true);
        setErrorMessage(`to create a contact please write in a valid name`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 20000);
      }
    } else if (persons.map((person) => person.name).includes(newName)) {
      if (
        window.confirm(
          `the contact ${newName} already exists, do you want to update it ?`
        )
      ) {
        const contactObject = {
          name: newName,
          number: newNumber,
        };
        contactsService
          .updateContact(
            persons.find((val) => val.name === newName).id,
            contactObject
          )
          .then(() => {
            contactsService.getAll().then((response) => {
              setPersons(response.data);
              setNewisError(false);
              setNewName("");
              setnewNumber("");
              setErrorMessage(`the contact ${newName} was updated !`);
              setTimeout(() => {
                setErrorMessage(null);
              }, 2000);
            });
          })
          .catch((error) => {
            setNewisError(true);
            setErrorMessage(`there was a problem with updating the contact !`);
            setTimeout(() => {
              setErrorMessage(null);
            }, 20000);
          });
      } else {
        console.log(`the contact ${newName} was not updated`);
      }
    } else {
      const contactObject = {
        name: newName,
        number: newNumber,
      };
      contactsService
        .create(contactObject)
        .then((response) => {
          setPersons(persons.concat(response.data));
          setNewisError(false);
          setNewName("");
          setnewNumber("");
          setErrorMessage(`the contact ${newName} was created !`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000);
        })
        .catch((error) => {
          setNewisError(true);
          setErrorMessage(`there was a problem with updating the contact !`);
          setTimeout(() => {
            setErrorMessage(null);
          }, 20000);
        });
    }
  };
  const personsToShow =
    newSearch.length < 1
      ? persons
      : persons.filter((persona) =>
          persona.name.toLowerCase().includes(newSearch)
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} isErr={isError} />
      <PhoneBook value={newSearch} onChange={changeSearch} />
      <h2>Add a new Contact</h2>
      <PersonForm
        onSubmit={addContact}
        nameValue={newName}
        onNameChange={changeName}
        numberValue={newNumber}
        onNumberChange={changeNumber}
      />
      <h2>Numbers</h2>
      <Numbers listToShow={personsToShow} delFunc={delContact} />
    </div>
  );
};

export default App;
