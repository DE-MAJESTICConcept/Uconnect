// frontend/src/components/TeacherStyleForm.jsx
import { useState } from "react";
import axios from "axios";

export default function TeacherStyleForm() {
  const [sampleText, setSampleText] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sampleText.trim()) {
      setStatus("❌ Please enter your teaching sample.");
      return;
    }

    // Prepend instruction for style analysis
    const lessonWithInstruction = `
Teach as if a student is standing right in front of you.
Include natural gestures, ask questions to check understanding, 
and explain concepts step by step in a way you would if teaching live.

Lesson:
${sampleText}
    `;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/styles/analyze",
        { sampleText: lessonWithInstruction }
      );
      setStatus(`✅ Style saved: ${res.data.name}`);
    } catch (err) {
      console.error(err);
      setStatus(`❌ Error: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">
        Create a Teaching Style
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Write your lesson as if teaching a student..."
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          className="w-full p-2 border rounded h-48"
        ></textarea>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700"
        >
          Analyze & Save Style
        </button>
      </form>

      {status && <p className="mt-4 font-semibold">{status}</p>}
    </div>
  );
}




// Good morning, today I will be teaching you how to fry an egg. So if you want to fry an egg,
//  you go and buy your egg or you take it from your poultry, whatever form you want to. And
//  then you will carefully break your egg into a cup. You add your spice to it, whichever kind 
// of spice you like. So let's take an example, somebody like John. John likes to use onions, fish, 
// carrots, and pepper. So you make sure you put all those things on a side. And then you break your 
// egg in another plate. I don't know if you are following me. You should ask questions once you need
//  to learn something. Ask questions very well. So then, back to the class. Once you stir the egg very 
// well, you light your gas, you fry your oil, and then you drop a piece of onion to know if it is
//  properly fried. And then you pour in your mixed egg together with the pepper, the fish, the carrot, 
// and onions. You mix them together very well and then you pour it inside your oil. And then it starts
//  frying. That way, you have a super fried egg. And you will definitely enjoy eating it. Any questions?