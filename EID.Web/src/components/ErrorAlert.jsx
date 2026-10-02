export default function ErrorAlert({ error }) {
  if (!error) return null;

  return (
    <div className="alert" role="alert">
      <strong>{error.title}</strong>
      {error.messages.length > 0 && (
        <ul>
          {error.messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
