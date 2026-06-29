import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "Is this project using real AI (Gemini API)?",
      answer:
        "Currently, the project is running in demo mode. The Gemini API is not enabled in the public version to prevent misuse and unexpected charges.",
    },
    {
      question: "Why do I get similar or fixed responses?",
      answer:
        "Since the API is disabled, the system uses a predefined test logic to simulate responses. This helps demonstrate the UI and flow without using real API calls.",
    },
    {
      question: "Can I use my own API key?",
      answer:
        "Yes. You can clone this repository, add your own Gemini API key in a .env file, and enable real AI responses locally.",
    },
    {
      question: "How do I enable real AI responses?",
      answer:
        "Add your Gemini API key in the environment variables and update the config to enable API usage. Once enabled, responses will be dynamic based on your prompts.",
    },
    {
      question: "Why is the API disabled in this version?",
      answer:
        "The API is disabled for security reasons and to avoid exceeding usage limits or incurring unexpected costs when the project is publicly accessible.",
    },
    {
      question: "Is the data shown here real?",
      answer:
        "No, all data shown in demo mode is generated or predefined for testing purposes only.",
    },
  ];

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ marginBottom: "20px" }}>Frequently Asked Questions</h2>

      {faqs.map((faq, index) => (
        <div
          key={index}
          style={{
            marginBottom: "15px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ marginBottom: "8px" }}>Question❓ {faq.question}</h4>
          <p style={{ margin: 0, color: "#555" }}>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQ;





