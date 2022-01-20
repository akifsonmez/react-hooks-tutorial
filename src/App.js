import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [counter, setCounter] = useState(0);
  const [user, setUser] = useState({ name: "Akif", age: 30 });

  useEffect(() => {
    console.log("first mount and every render");
    return () => {
      console.log("every onmount")
    }
  });
  useEffect(() => {
    console.log("first mount and every counter change");
    return () => {
      console.log("after counter change onmount")
    }
  }, [counter]);

  return (
    <div className="App">
      {counter}
      <br />
      <button
        onClick={() => {
          // incorrect way to update state
          const newCount = counter + 1;
          setCounter(newCount);
        }}
      >
        +
      </button>
      <br />
      <button
        onClick={() => {
          // correct way to update state
          setCounter((prevCount) => prevCount - 1);
        }}
      >
        -
      </button>
      <br />
      {user.name} is {user.age} years old.
      <br />
      <button
        onClick={() =>
          setUser((prevUser) => {
            return { ...prevUser, age: 25 };
          })
        }
      >
        Correct the age
      </button>
    </div>
  );
}

export default App;
