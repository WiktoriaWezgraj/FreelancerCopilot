export default function ResultCard({ result }) {
  return (
    <div>
      <h2>Wynik analizy</h2>

      <p>
        <strong>Cena:</strong> {result.price}
      </p>

      <p>
        <strong>Timeline:</strong> {result.timeline}
      </p>

      <p>
        <strong>Tech stack:</strong>
      </p>

      <ul>
        {result.stack.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      <p>{result.summary}</p>
    </div>
  );
}