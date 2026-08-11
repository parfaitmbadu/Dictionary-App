import Meaning from "./Meaning";

const WordResult = ({ entry }) => {
  const phoneticText =
    entry.phonetic || entry.phonetics.find((p) => p.text)?.text;
  const audioSource = entry.phonetics.find((p) => p.audio)?.audio;

  return (
    <article>
      <h2>{entry.word}</h2>
      {phoneticText && <p>{phoneticText}</p>}
      {audioSource && (
        <button type="button" onClick={() => new Audio(audioSource).play()}>
          ▶ Play
        </button>
      )}
      {entry.phonetic && <p>{entry.phonetic}</p>}

      {entry.meanings.map((meaning, index) => (
        <Meaning key={index} meaning={meaning} />
      ))}
    </article>
  );
};

export default WordResult;
