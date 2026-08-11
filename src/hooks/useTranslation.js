import { useEffect, useState } from "react";
import fetchTranslation from "../api/translation";

const useTranslation = (entry) => {
  const [translation, setTranslation] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!entry) return;

    setStatus("loading");

    fetchTranslation(entry)
      .then((data) => {
        setTranslation(data.responseData.translatedText);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [entry]);

  return { translation, status };
};

export default useTranslation;
