import "./App.css";
import {
  useState,
  useEffect,
  createContext,
  useContext,
  useReducer,
} from "react";

const appStoreReducer = (state, action) => {
  if (action.type === "INCREMENT") {
    const newState = { ...state };
    newState.counter = state.counter + 1;
    return newState;
  } else if (action.type === "DECREMENT") {
    const newState = { ...state };
    newState.counter = state.counter - 1;
    return newState;
  }
};
const initialAppStore = { counter: 0 };

const ChildColorContext = createContext();

function App() {
  const [counter, setCounter] = useState(0);
  const [childColor, setChildColor] = useState("red");
  const [user, setUser] = useState({ name: "Akif", age: 30 });
  const [AppsStore, dispatch] = useReducer(appStoreReducer, initialAppStore);

  useEffect(() => {
    console.log("first mount and every render");
    return () => {
      console.log("every onmount");
    };
  });

  useEffect(() => {
    console.log("first mount and every counter change");
    return () => {
      console.log("after counter change onmount");
    };
  }, [counter]);

  return (
    <div className="App">
      <h1>Counter with useState hook</h1>
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
      <button
        onClick={() =>
          setUser((prevUser) => {
            return { ...prevUser, age: 25 };
          })
        }
      >
        Correct the age
      </button>
      <br />
      {user.name} is {user.age} years old.
      <br />
      <h1>Counter with useReducer</h1>
      {AppsStore.counter}
      <br />
      <button
        onClick={() => {
          dispatch({ type: "INCREMENT" });
        }}
      >
        +
      </button>
      <br />
      <button
        onClick={() => {
          // correct way to update state
          dispatch({ type: "DECREMENT" });
        }}
      >
        -
      </button>
      <br />
      <ChildColorContext.Provider value={childColor}>
        <ChildComponent />
        <AnotherChildComponent />
      </ChildColorContext.Provider>
      <button
        onClick={() =>
          setChildColor((prevColor) => (prevColor === "red" ? "blue" : "red"))
        }
      >
        Switch color
      </button>
    </div>
  );
}

const ChildComponent = () => {
  const color = useContext(ChildColorContext);
  return <h1 style={{ color }}>This is a child component</h1>;
};

const AnotherChildComponent = () => {
  const color = useContext(ChildColorContext);
  return <h2 style={{ color }}>Another child component</h2>;
};

export default App;
