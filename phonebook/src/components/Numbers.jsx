const Numbers = (props) => {
  if (props.listToShow.length < 1) {
    return <div>there are no contacts that fit the search criteria</div>;
  }
  return (
    <div>
      {props.listToShow.map((person) => (
        <Number key={person.id} numb={person} delFunc={props.delFunc} />
      ))}
    </div>
  );
};

const Number = (props) => {
  return (
    <p>
      {props.numb.name} {props.numb.number}
      <button type="button" onClick={() => props.delFunc(props.numb.id)}>
        delete contact
      </button>
    </p>
  );
};
export default Numbers;
