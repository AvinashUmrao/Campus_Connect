import { useParams } from 'react-router-dom';
import Navigation from "../../components/Navigation/Navigation.jsx";
import "./RegisterConfirmation.css";

const RegisterConfirmation = () => {
  return (
    <div>
      <Navigation />
      <div className="register-confirmation">
        <h2>Registration is done</h2>
        <Link to="/" className="back-to-events">Back to Events</Link>
      </div>
    </div>
  );
};
const EventDetails = ()=>{
  const {id}=useParams()
  const numId = Number(id)

  const filteredEvent = eventList.find(
    eventDetail=>eventDetail.id===numId)
  }

export default RegisterConfirmation;

