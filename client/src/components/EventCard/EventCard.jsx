import { Link } from "react-router-dom";
import "./EventCard.css";
const EventCard = ({ id, heading, date, location, img }) => {
  const { year, month } = date;
  return (
     <Link to ={`/events/${id}`}>
      <div className="card">
        <div className="card-content">
          <h3>{heading}</h3>
          <span>Club_Name</span>
          <p>
            <span>Time</span>
            <span> {month}</span>
            <span> {year}</span>
          
            
          </p>
          <p>{location}</p>
      
        </div>
        

        <div className="card-img-wrapper">
          <img src={img} alt="image not found" />
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
