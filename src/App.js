import "./App.css";
import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
} from "react";

const useLocalStorageValueCustomHook = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue || initialValue;
  });

  const setLocalStorageValue = (newValue) => {
    let newStoredValue = value;
    if (newValue instanceof Function) {
      newStoredValue = newValue(value);
    }

    setValue(newStoredValue);
    localStorage.setItem(key, newStoredValue);
  };

  return [value, setLocalStorageValue];
};

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
  const inputRef = useRef(null);
  const [counterForCustomHook, setCounterForCustomHook] =
    useLocalStorageValueCustomHook("counter", 2);

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

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const counterSquareRootWithMemo = useMemo(() => {
    console.log("counter square root calculated in with useMemo");
    return Math.sqrt(counter);
  }, [counter]);

  const logCounterWithCallback = useCallback(() => {
    console.log("log counter with user callback", counter);
  }, [counter]);

  return (
    <div className="App">
      <h1>Counter with useState hook</h1>
      {counter}
      <br />
      Square Root withMemo: {counterSquareRootWithMemo}
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
          dispatch({ type: "DECREMENT" });
        }}
      >
        -
      </button>
      <br />
      <br />
      {user.name} is {user.age} years old.
      <br />
      <h1>Counter with customHook</h1>
      {counterForCustomHook}
      <br />
      <button
        onClick={() => {
          setCounterForCustomHook((prev) => prev + 1);
        }}
      >
        +
      </button>
      <br />
      <button
        onClick={() => {
          setCounterForCustomHook((prev) => prev - 1);
        }}
      >
        -
      </button>
      <br />
      <ChildColorContext.Provider value={childColor}>
        <ChildComponent />
        <AnotherChildComponent />
      </ChildColorContext.Provider>
      <PureChildComponent logCounterWithCallback={logCounterWithCallback} />
      <button
        onClick={() =>
          setChildColor((prevColor) => (prevColor === "red" ? "blue" : "red"))
        }
      >
        Switch color
      </button>
      <br />
      <input ref={inputRef} />
      <button
        onClick={() => {
          inputRef.current.focus();
        }}
      >
        focus to input
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

class PureChildComponent extends React.PureComponent {
  render() {
    this.props.logCounterWithCallback();

    return <h1>PureChildComponent</h1>;
  }
}

export default App;
