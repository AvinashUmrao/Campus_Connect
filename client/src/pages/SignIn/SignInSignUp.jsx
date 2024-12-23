import React, { useState } from "react";
import "./SignInSignUp.css";

const SignInSignUp = () => {
  const [clubHeads, setClubHeads] = useState({ email: "", password: "" });
  const [students, setStudents] = useState({ email: "", password: "" });

  const handleInputChange = (e, userType) => {
    const { name, value } = e.target;
    if (userType === "clubHeads") {
      setClubHeads((prev) => ({ ...prev, [name]: value }));
    } else {
      setStudents((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e, userType) => {
    e.preventDefault();
    const userData = userType === "clubHeads" ? clubHeads : students;
    const endpoint = userType === "clubHeads" ? "http://localhost:5002/api/register" : "/api/students/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Welcome, ${data.name}!`);
        // Handle successful login here
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="section club-heads">
        <h2>Club Heads</h2>
        <form onSubmit={(e) => handleSubmit(e, "clubHeads")}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={clubHeads.email}
            onChange={(e) => handleInputChange(e, "clubHeads")}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={clubHeads.password}
            onChange={(e) => handleInputChange(e, "clubHeads")}
          />
          <button type="submit">Sign In</button>
          <p>
            New here? <a href="#">Sign Up</a>
          </p>
        </form>
      </div>
      <div className="divider"></div>
      <div className="section students">
        <h2>Students</h2>
        <form onSubmit={(e) => handleSubmit(e, "students")}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={students.email}
            onChange={(e) => handleInputChange(e, "students")}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={students.password}
            onChange={(e) => handleInputChange(e, "students")}
          />
          <button type="submit">Sign In</button>
          <p>
            New here? <a href="#">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignInSignUp;
