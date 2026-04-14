import { useParams } from 'react-router-dom';
import './ErrorPage.css';

export default function ErrorPage() {
  const { errorMsg = 'Unknown error' } = useParams();

  return (
    <div className="error-page">
      <h2>Oops! Something bad happened.</h2>
      <p>{decodeURIComponent(errorMsg)}</p>
    </div>
  );
}
