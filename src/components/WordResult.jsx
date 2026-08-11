import Meaning from "./Meaning";

const WordResult = ({ entry }) => {
  const phoneticText =
    entry.phonetic || entry.phonetics.find((p) => p.text)?.text;
  const audioSource = entry.phonetics.find((p) => p.audio)?.audio;

  return (
    <article className="mt-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-gray-900">{entry.word}</h2>
          {phoneticText && (
            <p className="mt-1 text-lg text-gray-500">{phoneticText}</p>
          )}
        </div>

        {audioSource && (
          <button
            type="button"
            onClick={() => new Audio(audioSource).play()}
            aria-label={`Play pronunciation of ${entry.word}`}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            ▶
          </button>
        )}
      </div>

      <div className="flex flex-col mt-8 gap-8">
        {entry.meanings.map((meaning, index) => (
          <Meaning key={index} meaning={meaning} />
        ))}
      </div>
    </article>
  );
};

export default WordResult;
