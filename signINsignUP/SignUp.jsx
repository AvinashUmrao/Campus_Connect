// SignUp.jsx
import React from 'react';
import './SignUp.css'; // Import the CSS file for styling

const SignUp = () => {
    return (
        <div className="container">
            <div className="section club-heads">
                <h2>Sign Up for Club Heads</h2>
                <form>
                    <input type="text" placeholder="Full Name" required />
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                    <input type="text" placeholder="Enrollment Batch" required />
                    <button type="submit">Sign Up</button>
                    <p>
                        Already have an account? <a href="#">Sign In</a>
                    </p>
                </form>
            </div>
            <div className="divider"></div>
            <div className="section students">
                <h2>Sign Up for Students</h2>
                <form>
                    <input type="text" placeholder="Full Name" required />
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                    <input type="text" placeholder="Enrollment Batch" required />
                    <button type="submit">Sign Up</button>
                    <p>
                        Already have an account? <a href="#">Sign In</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;