const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en";

const fetchWord = async (word) => {
  const response = await fetch(
    `${API_BASE}/${encodeURIComponent(word.trim())}`,
  );

  if (response.status === 404) {
    const error = new Error(`No definition found for "${word}"`);
    error.notFound = true;
    throw error;
  }

  if (!response.ok) {
    throw new Error("Something went wrong. Please try again.");
  }

  return response.json();
};

export { fetchWord };
