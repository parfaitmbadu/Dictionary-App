import { fetchWord } from "../api/dictionary";
import { useState } from "react";

const useDictionary = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const search = async (word) => {
    if (!word.trim()) return;

    setStatus("loading");
    setData(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
      const entries = await fetchWord(word);
      setData(entries[0]);
      setStatus("success");
    } catch (error) {
      setMessage(error.message);
      setStatus(error.notFound ? "notFound" : "error");
    }
  };

  return { data, status, message, search };
};

export default useDictionary;
