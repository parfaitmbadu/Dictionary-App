import SearchBar from "./components/SearchBar";
import useDictionary from "./hooks/useDictionary";
import WordResult from "./components/WordResult";
import TranslationResult from "./components/TranslationResult";

function App() {
  const { data, status, message, search } = useDictionary();

  return (
    <div className="min-h-screen bg-amber-50">
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-gray-900">Dictionary</h1>
        <SearchBar onSearch={search} isLoading={status === "loading"} />

        {status === "idle" && (
          <p className="mt-10 text-gray-500">
            Search for a word to see its definition.
          </p>
        )}
        {status === "loading" && (
          <p className="mt-10 text-gray-500">
            Loading the result. Please wait...
          </p>
        )}

        {status === "notFound" && (
          <p className="mt-10 text-gray-500">{message}</p>
        )}
        {status === "error" && <p className="mt-10 text-red-600">{message}</p>}

        {status === "success" && (
          <>
            <WordResult entry={data} />
            <TranslationResult entry={data.word} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
