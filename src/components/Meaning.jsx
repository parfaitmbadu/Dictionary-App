const Meaning = ({ meaning }) => {
  return (
    <section>
      <h3>{meaning.partOfSpeech}</h3>

      <ul>
        {meaning.definitions.map((definition, index) => (
          <li key={index}>
            <p>{definition.definition}</p>
            {definition.example && <p>“{definition.example}”</p>}
          </li>
        ))}
      </ul>

      {meaning.synonyms.length > 0 && (
        <p>Synonyms: {meaning.synonyms.join(", ")}</p>
      )}
    </section>
  );
};

export default Meaning;
