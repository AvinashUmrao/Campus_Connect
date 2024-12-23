import "./SignInSignUp.css";
const SignInSignUp = () => {
    return (
      <div className="container">
        <div className="section club-heads">
          <h2>Club Heads</h2>
          <form>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Sign In</button>
            <p>
              New here? <a href="#">Sign Up</a>
            </p>
          </form>
        </div>
        <div className="divider"></div>
        <div className="section students">
          <h2>Students</h2>
          <form>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
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