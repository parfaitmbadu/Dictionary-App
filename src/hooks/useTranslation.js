import { useEffect, useState } from "react";
import fetchTranslation from "../api/translation";

const useTranslation = (entry) => {
  const [translation, setTranslation] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!entry) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag for the fetch below is intentional
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
