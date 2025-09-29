import { useState } from "react";

export default function StudentLearning() {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState({});
  const [style, setStyle] = useState(null);
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState("");
  const [loading, setLoading] = useState(false);

  const questions = [
    { key: "prefers_examples", q: "How do you prefer explanations?", a: "Examples & stories", b: "Concise facts" },
    { key: "tone_casual", q: "What tone helps you learn best?", a: "Casual", b: "Formal" },
    { key: "likes_checks", q: "Do you like check questions?", a: "Yes, pause & reflect", b: "No, keep flowing" },
    { key: "detail_step_by_step", q: "How detailed should explanations be?", a: "Step-by-step", b: "High-level overview" },
    { key: "pacing_short_bursts", q: "Preferred pace?", a: "Short bursts", b: "Longer flow" },
  ];

  const handleAnswer = (key, value) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const submitPrefs = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/student-learning/match-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      const data = await res.json();
      setStyle(data);
      setStep(2);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to match style");
    }
    setLoading(false);
  };

 // StudentLearning.jsx

const submitTopic = async () => {
  setLoading(true);
  setLesson(""); // Clear previous lesson
  
  // Debug log to check the data being sent
  console.log("Sending style and topic to backend:", { style, topic });

  try {
    const res = await fetch("http://localhost:5000/api/student-learning/generate-lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ style, topic }),
    });

    // Debug log to check the response status
    console.log("Backend response status:", res.status);

    if (!res.ok) {
      const errorData = await res.json();
      // Debug log for backend errors
      console.error("Backend error:", errorData.error);
      throw new Error(`HTTP error! status: ${res.status}, message: ${errorData.error}`);
    }

    const data = await res.json();
    setLesson(data.lesson);

  } catch (err) {
    // Debug log for any catch-all errors
    console.error("Failed to generate lesson:", err);
    alert(`Error: ${err.message}`);
  } finally {
    setLoading(false);
  }
};
  const speakLesson = () => {
    if (!lesson) return;
    const speech = new SpeechSynthesisUtterance(lesson);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold mb-4">Answer a few questions</h2>
          {questions.map((q, i) => (
            <div key={q.key} className="mb-4">
              <p className="font-medium">{i + 1}. {q.q}</p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleAnswer(q.key, true)}
                  className={`px-3 py-1 rounded ${prefs[q.key] === true ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  {q.a}
                </button>
                <button
                  onClick={() => handleAnswer(q.key, false)}
                  className={`px-3 py-1 rounded ${prefs[q.key] === false ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  {q.b}
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={submitPrefs}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Matching..." : "Find My Style"}
          </button>
        </>
      )}

      {step === 2 && style && (
        <>
          <h2 className="text-xl font-bold mb-4">Your style: {style.name}</h2>
          <input
            type="text"
            placeholder="What topic do you want to learn?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={submitTopic}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Generating lesson..." : "Generate Lesson"}
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-xl font-bold mb-4">Your Lesson</h2>
          <div className="bg-gray-100 p-4 rounded mb-4 whitespace-pre-wrap">{lesson}</div>
          <div className="flex gap-4">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
            >
              Back
            </button>
            <button
              onClick={speakLesson}
              className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
            >
              🔊 Listen
            </button>
          </div>
        </>
      )}
    </div>
  );
}
