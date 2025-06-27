"use client";
import { useState } from "react";

type Label = {
  description: string;
  score: number;
};

export default function VisionComponent() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLabels([]);
      } else {
        setLabels(data.labels ?? []);
      }
    } catch (e) {
      console.error(e);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter image URL"
        className="border p-2"
      />
      <button
        onClick={handleAnalyze}
        className="bg-blue-500 text-white px-4 py-2 ml-2"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <ul className="mt-4">
        {labels.map((label) => (
          <li key={label.description}>
            {label.description} ({(label.score * 100).toFixed(2)}%)
          </li>
        ))}
      </ul>
    </div>
  );
}
