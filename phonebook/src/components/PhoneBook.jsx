const PhoneBook = (props) => {
  return (
    <div>
      Find(filter) name: <input value={props.value} onChange={props.onChange} />
    </div>
  );
};
export default PhoneBook;
