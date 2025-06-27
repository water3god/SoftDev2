"use client";
import { useState, useEffect, useRef } from "react";

type Label = {
  description: string;
  score: number;
};

export default function VisionComponent() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (showCamera && videoRef.current) {
      (async () => {
        setCapturedImage(null);
        if (navigator.mediaDevices) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          videoRef.current!.srcObject = stream;
          videoRef.current!.play();
        }
      })();
    }
  }, [showCamera]);

  const handleStartCamera = () => {
    setShowCamera(true);
  };

  // Capture photo
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setCapturedImage(dataUrl);
        setUrl(dataUrl); // Set as image for analysis
      }
      // Stop the camera stream
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setShowCamera(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/istrash", {
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
    <div className="p-4 rounded-lg bg-white shadow">
      <div className="mb-4 flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter image URL or use camera"
          className="border p-2 rounded-md flex-1"
        />
        <button
          onClick={handleStartCamera}
          className="bg-green-500 text-white px-4 py-2 rounded-md transition-transform duration-150 hover:scale-105"
          type="button"
        >
          Use Camera
        </button>
      </div>

      {showCamera && (
        <div className="mb-4">
          <video
            ref={videoRef}
            className="rounded-lg border"
            width={320}
            height={240}
            autoPlay
          />
          <div>
            <button
              onClick={handleCapture}
              className="bg-blue-600 text-white px-4 py-2 mt-2 rounded-md transition-transform duration-150 hover:scale-105"
              type="button"
            >
              Capture Photo
            </button>
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}

      {capturedImage && (
        <div className="mb-4">
          <img
            src={capturedImage}
            alt="Captured"
            className="rounded-lg border max-w-xs"
          />
        </div>
      )}

      <button
        onClick={handleAnalyze}
        className="bg-blue-500 text-white px-4 py-2 rounded-md transition-transform duration-150 hover:scale-105"
        disabled={loading || !url}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {error && <p className="text-red-500 mt-2 rounded">{error}</p>}

      <ul className="mt-4">
        {labels.map((label) => (
          <li
            key={label.description}
            className="bg-gray-100 rounded px-3 py-1 my-1"
          >
            {label.description} ({(label.score * 100).toFixed(2)}%)
          </li>
        ))}
      </ul>
    </div>
  );
}
