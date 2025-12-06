import { useRef } from "react";

export const useAudioRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = async (): Promise<MediaStream> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.start();
      return stream; // Возвращаем stream для визуализации
    } catch (error) {
      console.error("Ошибка при запуске записи:", error);
      throw error;
    }
  };

  const stop = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current || !streamRef.current) {
        reject(new Error("Запись не была начата"));
        return;
      }

      // Обработчик остановки
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm; codecs=opus",
        });

        // ВАЖНО: Останавливаем поток микрофона
        streamRef.current?.getTracks().forEach((track) => {
          track.stop();
          track.enabled = false;
        });

        // Очищаем ссылки
        streamRef.current = null;
        mediaRecorderRef.current = null;
        chunksRef.current = [];

        resolve(blob);
      };

      // Обработчик ошибок
      mediaRecorderRef.current.onerror = (event) => {
        console.error("Ошибка MediaRecorder:", event);
        reject(new Error("Ошибка при остановке записи"));
      };

      try {
        // Пытаемся остановить запись
        if (mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
        } else {
          // Если запись уже остановлена, создаем пустой blob
          resolve(new Blob());
        }
      } catch (error) {
        console.error("Ошибка при вызове stop():", error);
        reject(error);
      }
    });
  };

  // Функция для принудительной остановки
  const forceStop = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      streamRef.current = null;
    }

    if (mediaRecorderRef.current) {
      try {
        if (mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
        }
      } catch (error) {
        console.error("Ошибка при принудительной остановке:", error);
      }
      mediaRecorderRef.current = null;
    }

    chunksRef.current = [];
  };

  return {
    start,
    stop,
    forceStop,
    getStream: () => streamRef.current, // Добавляем геттер для потока
  };
};
