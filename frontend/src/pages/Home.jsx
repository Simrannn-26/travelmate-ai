import { searchCity } from "../api/travelApi";
import { useState } from "react";

function Home() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    const data = await searchCity(city);
    setResult(data);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter city"
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

export default Home;