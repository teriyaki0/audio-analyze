import { useEffect, useRef, useState, useCallback } from "react";

export const useAudioVisualization = (stream: MediaStream | null) => {
  const [volume, setVolume] = useState(0);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(
    new Uint8Array(0)
  );

  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }

    analyzerRef.current = null;
    streamRef.current = null;

    // Используем setTimeout для асинхронного обновления состояния
    setTimeout(() => {
      setVolume(0);
      setFrequencyData(new Uint8Array(0));
    }, 0);
  }, []);

  useEffect(() => {
    // Очистка при размонтировании
    return cleanup;
  }, [cleanup]);

  useEffect(() => {
    if (!stream) {
      cleanup();
      return;
    }

    const setupVisualizer = async () => {
      try {
        cleanup(); // Очищаем предыдущую настройку

        const audioContext = new (window.AudioContext ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyzer = audioContext.createAnalyser();

        analyzer.fftSize = 256;
        analyzer.smoothingTimeConstant = 0.8;
        source.connect(analyzer);

        analyzerRef.current = analyzer;
        audioContextRef.current = audioContext;
        streamRef.current = stream;

        const bufferLength = analyzer.frequencyBinCount;

        // Используем setInterval вместо requestAnimationFrame
        intervalRef.current = setInterval(() => {
          if (!analyzerRef.current) return;

          const dataArray = new Uint8Array(bufferLength);
          analyzerRef.current.getByteFrequencyData(dataArray);

          // Обновляем состояние
          setFrequencyData(new Uint8Array(dataArray));

          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setVolume(average / 255);
        }, 50); // Обновляем каждые 50ms (20 FPS)
      } catch (error) {
        console.error("Ошибка при настройке визуализации:", error);
        cleanup();
      }
    };

    setupVisualizer();

    return cleanup;
  }, [stream, cleanup]);

  return { volume, frequencyData };
};
