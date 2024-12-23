import { useState, useEffect } from "react";

function TypingEffect() {
  const messages = [
    "Don't Miss Out on Any Event...",
    "Stay Updated with JPnotifications...",
  ];
  const [currentMessage, setCurrentMessage] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 100; // Speed in ms
  const deletingSpeed = 50;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < messages[index].length) {
        setCurrentMessage((prev) => prev + messages[index][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setCurrentMessage((prev) => prev.slice(0, -1));
        setCharIndex((prev) => prev - 1);
      } else if (!isDeleting && charIndex === messages[index].length) {
        setTimeout(() => setIsDeleting(true), 1000); // Pause before deleting
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % messages.length); // Move to next message
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, messages, index]);

  return (
    <div style={styles.container}>
      <span style={styles.text}>{currentMessage}</span>
    </div>
  );
}

const styles = {
  container: {
    height: "100px", // Adjust height to account for the navbar
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    marginTop: "0%", // Add margin to position below the navbar
  },
  text: {

    fontSize: "24px",
    fontWeight: "bold", // Increase font weight

  },
};

export default TypingEffect;