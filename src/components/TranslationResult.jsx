import useTranslation from "../hooks/useTranslation";

const TranslationResult = ({ entry }) => {
  const { translation, status } = useTranslation(entry);

  if (status === "loading") return <p>Translating...</p>;
  if (status === "error") return null;
  if (status !== "success") return null;

  return (
    <div>
      <p className="mt-4 text-sm">
        <span className="text-gray-400">Translation (FR) </span>
        <span className="font-medium text-gray-900">{translation}</span>
      </p>
    </div>
  );
};

export default TranslationResult;
