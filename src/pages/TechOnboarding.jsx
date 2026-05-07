import React from "react";
import { useNavigate } from "react-router-dom";

export default function TechOnboarding() {
  const navigate = useNavigate();

  const handleSubscribe = (method) => {
    // TODO: Integrate Telebirr/CBE Birr payment logic here
    // For now, just simulate success and redirect
    alert(`Subscribed with ${method}!`);
    navigate("/tech/dashboard");
  };

  const handleSkip = () => {
    navigate("/tech/dashboard");
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h2>Technician Subscription</h2>
      <p>
        Subscribe to unlock premium features and more job opportunities! You can
        skip for now and subscribe later.
      </p>
      <button
        style={{ margin: "8px 0", width: "100%" }}
        onClick={() => handleSubscribe("Telebirr")}
      >
        Subscribe with Telebirr
      </button>
      <button
        style={{ margin: "8px 0", width: "100%" }}
        onClick={() => handleSubscribe("CBE Birr")}
      >
        Subscribe with CBE Birr
      </button>
      <button
        style={{ margin: "8px 0", width: "100%", background: "#eee" }}
        onClick={handleSkip}
      >
        Skip for now
      </button>
    </div>
  );
}
