import SearchBar from "./components/SearchBar";
import useDictionary from "./hooks/useDictionary";
import WordResult from "./components/WordResult";

function App() {
  const { data, status, message, search } = useDictionary();

  return (
    <div>
      <h1>Dictionary App</h1>
      <SearchBar onSearch={search} />

      {status === "loading" && <p>Loading…</p>}
      {status === "notFound" && <p>{message}</p>}
      {status === "error" && <p>{message}</p>}
      {status === "success" && <WordResult entry={data} />}
    </div>
  );
}

export default App;
