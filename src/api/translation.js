const fetchTranslation = async (word) => {
  const API_BASE =
    "https://api.mymemory.translated.net/get?q={word}!&langpair=en|fr";
  let response;

  try {
    response = await fetch(
      API_BASE.replace("{word}", encodeURIComponent(word.trim())),
    );
  } catch {
    throw new Error("Something went wrong. Please try again");
  }

  if (response.status === 502) {
    throw new Error("Something went wrong. Please try again");
  }

  if (response.status === 404) {
    const error = new Error(`No translation found for "${word}"`);
    error.notFound = true;
    throw error;
  }

  if (!response.ok) {
    throw new Error("Something went wrong. Please try again.");
  }

  return response.json();
};

export default fetchTranslation;
