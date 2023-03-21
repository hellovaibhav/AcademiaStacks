// ...
import React ,{useEffect , useState} from 'react';
export default function App() {
    // ...
  const [data, setData] = useState([])
    useEffect(() => {
      fetch(`https://jsonplaceholder.typicode.com/posts?_limit=8`)
        
        .then((actualData) => {
          setData(actualData);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
          setData(null);
        })
    }, []);
  
    return (
      <div className="App">
        
        <ul>
          {data &&
            data.map(({ id, title }) => (
              <li key={id}>
                <h3>{title}</h3>
              </li>
            ))}
        </ul>
      </div>
    );
  }