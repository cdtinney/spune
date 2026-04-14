import { useParams } from 'react-router-dom';
import './ErrorPage.css';

function safeDecode(str) {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

export default function ErrorPage() {
  const { errorMsg = 'Unknown error' } = useParams();

  return (
    <div className="error-page">
      <h2>Oops! Something bad happened.</h2>
      <p>{safeDecode(errorMsg)}</p>
    </div>
  );
}
