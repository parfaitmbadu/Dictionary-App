const Meaning = ({ meaning }) => {
  return (
    <section>
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-semibold italic text-gray-900">
          {meaning.partOfSpeech}
        </h3>
        <span className="flex-1 h-px bg-gray-200" />
      </div>

      <ul className="mt-4 pl-5 space-y-3 list-disc marker:text-gray-300">
        {meaning.definitions.slice(0, 5).map((definition, index) => (
          <li key={index} className="text-gray-700 leading-relaxed">
            {definition.definition}
            {definition.example && (
              <p className="mt-1 text-gray-400">“{definition.example}”</p>
            )}
          </li>
        ))}
      </ul>

      {meaning.synonyms.length > 0 && (
        <p className="mt-4 text-sm">
          <span className="text-gray-400">Synonyms </span>
          <span className="font-medium text-gray-900">
            {meaning.synonyms.join(", ")}
          </span>
        </p>
      )}
    </section>
  );
};

export default Meaning;
