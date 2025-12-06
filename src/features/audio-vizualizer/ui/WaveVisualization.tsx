import React, { useEffect, useRef } from "react";
import styles from "./WaveVisualization.module.scss";

interface WaveVisualizationProps {
  volume: number;
  frequencyData: Uint8Array;
  isActive: boolean;
  size?: number;
}

export const WaveVisualization: React.FC<WaveVisualizationProps> = ({
  volume,
  frequencyData,
  isActive,
  size = 400,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current || !isActive) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = size / 6;

    const animate = (timestamp: number) => {
      if (!ctx) return;

      // Прозрачный фон - только очищаем
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Время для анимации
      const time = timestamp * 0.001;
      timeRef.current = time;

      // Усиленный volume для большей чувствительности
      const responsiveVolume = Math.min(volume * 5, 1);

      // 3 волны
      const waveCount = 3;
      const waves: Array<{
        points: { x: number; y: number }[];
        radius: number;
      }> = [];

      // Сначала собираем все точки для всех волн
      for (let wave = 0; wave < waveCount; wave++) {
        // Базовые параметры волны
        const waveScale = 0.8 + wave * 0.3;

        // Собираем точки для волны
        const points: { x: number; y: number }[] = [];
        const pointCount = 96; // ЕЩЕ БОЛЬШЕ точек для максимальной плавности

        for (let i = 0; i < pointCount; i++) {
          const angle = (i / pointCount) * Math.PI * 2;

          // Берем значение из frequencyData с учетом волны
          const freqIndex = Math.floor((i / pointCount) * frequencyData.length);
          const freqValue = frequencyData[freqIndex] / 255 || 0;

          // Очень плавная анимация для закругленных волн
          const animation = Math.sin(angle * 2 + time * 1.2 + wave * 0.8) * 1.5;

          // Радиус точки - более плавные изменения
          const pointRadius =
            baseRadius +
            wave * 55 + // увеличил расстояние между волнами
            responsiveVolume * 65 * waveScale + // уменьшил реакцию на громкость для плавности
            freqValue * 15 + // уменьшил влияние частоты для плавности
            animation; // анимация

          // Координаты точки
          const x = centerX + Math.cos(angle) * pointRadius;
          const y = centerY + Math.sin(angle) * pointRadius;

          points.push({ x, y });
        }

        waves.push({ points, radius: baseRadius + wave * 55 });
      }

      // Рисуем волны с заливкой от внешней к внутренней
      for (let wave = waveCount - 1; wave >= 0; wave--) {
        const { points, radius } = waves[wave];

        // Цвет волны - красный с разной интенсивностью
        const redIntensity = 220 - wave * 30;
        const waveOpacity = 1 - wave * 0.001;

        if (points.length > 2) {
          // Используем сверхплавный алгоритм Catmull-Rom сплайна
          ctx.beginPath();

          // Функция для расчета Catmull-Rom сплайна
          const getCatmullRomPoint = (
            t: number,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            p0: any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            p1: any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            p2: any,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            p3: any
          ) => {
            const t2 = t * t;
            const t3 = t2 * t;

            return {
              x:
                0.5 *
                (2 * p1.x +
                  (-p0.x + p2.x) * t +
                  (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                  (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
              y:
                0.5 *
                (2 * p1.y +
                  (-p0.y + p2.y) * t +
                  (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                  (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
            };
          };

          // Рисуем Catmull-Rom сплайн
          const segments = 10; // Количество сегментов между точками
          const numPoints = points.length;

          // Начинаем с первой точки
          const firstPoint = getCatmullRomPoint(
            0,
            points[(numPoints - 1) % numPoints],
            points[0],
            points[1 % numPoints],
            points[2 % numPoints]
          );
          ctx.moveTo(firstPoint.x, firstPoint.y);

          for (let i = 0; i < numPoints; i++) {
            const p0 = points[(i - 1 + numPoints) % numPoints];
            const p1 = points[i];
            const p2 = points[(i + 1) % numPoints];
            const p3 = points[(i + 2) % numPoints];

            for (let j = 1; j <= segments; j++) {
              const t = j / segments;
              const point = getCatmullRomPoint(t, p0, p1, p2, p3);
              ctx.lineTo(point.x, point.y);
            }
          }

          // Замыкаем кривую к первой точке
          ctx.closePath();

          // Создаем градиент для заливки
          const gradient = ctx.createRadialGradient(
            centerX,
            centerY,
            radius * 0.3, // увеличил внутренний радиус
            centerX,
            centerY,
            radius * 1.6 // уменьшил внешний радиус
          );

          // Более насыщенный градиент
          gradient.addColorStop(
            0,
            `rgba(${redIntensity}, 40, 40, ${waveOpacity * 0.5})`
          );
          gradient.addColorStop(
            0.3,
            `rgba(${redIntensity + 10}, 50, 50, ${waveOpacity * 0.4})`
          );
          gradient.addColorStop(
            0.6,
            `rgba(${redIntensity + 20}, 60, 60, ${waveOpacity * 0.25})`
          );
          gradient.addColorStop(
            1,
            `rgba(${redIntensity + 30}, 70, 70, ${waveOpacity * 0.1})`
          );

          // Заливаем волну
          ctx.fillStyle = gradient;
          ctx.fill();

          // ОБВОДКА - ТОЛЩЕ И ЯРЧЕ
          ctx.strokeStyle = `rgba(${redIntensity + 1}, 70, 70, ${
            waveOpacity * 0.8
          })`;
          ctx.lineWidth = 2.5 + wave * 0.8; // ТОЛЩЕ для внешних волн
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.stroke();

          // Внутренняя обводка для объема
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i += 3) {
            const prev = points[i - 1];
            const current = points[i];
            const cpX = (prev.x + current.x) / 2;
            const cpY = (prev.y + current.y) / 2;
            ctx.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(${redIntensity + 25}, 80, 80, ${
            waveOpacity * 0.4
          })`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Центральная заливка - больший и более заметный круг
      if (responsiveVolume > 0.05) {
        const centerRadius = baseRadius * (0.8 + responsiveVolume * 0.4);

        // Внешний градиент для центра
        const outerGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          centerRadius * 1.6
        );

        outerGradient.addColorStop(
          0,
          `rgba(220, 50, 50, ${0.2 + responsiveVolume * 0.25})`
        );
        outerGradient.addColorStop(
          0.5,
          `rgba(200, 40, 40, ${0.1 + responsiveVolume * 0.15})`
        );
        outerGradient.addColorStop(1, "rgba(180, 30, 30, 0)");

        ctx.beginPath();
        ctx.arc(centerX, centerY, centerRadius * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = outerGradient;
        ctx.fill();

        // Основной центральный круг
        const mainGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          centerRadius
        );

        mainGradient.addColorStop(
          0,
          `rgba(240, 60, 60, ${0.3 + responsiveVolume * 0.3})`
        );
        mainGradient.addColorStop(
          0.6,
          `rgba(220, 50, 50, ${0.2 + responsiveVolume * 0.2})`
        );
        mainGradient.addColorStop(
          1,
          `rgba(200, 40, 40, ${0.1 + responsiveVolume * 0.1})`
        );

        ctx.beginPath();
        ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
        ctx.fillStyle = mainGradient;
        ctx.fill();

        // Обводка центрального круга - ТОЛЩАЯ
        ctx.beginPath();
        ctx.arc(centerX, centerY, centerRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 85, 85, ${0.4 + responsiveVolume * 0.3})`;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.stroke();

        // Внутренняя обводка центрального круга
        ctx.beginPath();
        ctx.arc(centerX, centerY, centerRadius * 0.9, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 100, 100, ${
          0.2 + responsiveVolume * 0.2
        })`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Точки в центре - более плавные
        const pointCount = 20;
        for (let i = 0; i < pointCount; i++) {
          const angle = (i / pointCount) * Math.PI * 2;
          const freqIndex = Math.floor((i / pointCount) * frequencyData.length);
          const freqValue = frequencyData[freqIndex] / 255 || 0;

          const radius = centerRadius * 0.7 + freqValue * 6;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          // Плавная анимация точек
          const pulse = Math.sin(time * 1.5 + angle * 3) * 1.5;

          ctx.beginPath();
          ctx.arc(x, y, 1.5 + freqValue * 1.5 + pulse * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 95, 95, ${0.25 + freqValue * 0.3})`;
          ctx.fill();
        }
      }

      // Эффект свечения по краям - ТОЛЩЕ
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2.1, 0, Math.PI * 2);
      const glowGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        size / 2.4,
        centerX,
        centerY,
        size / 2.0
      );
      glowGradient.addColorStop(
        0,
        `rgba(200, 50, 50, ${0.12 + responsiveVolume * 0.18})`
      );
      glowGradient.addColorStop(1, "rgba(200, 50, 50, 0)");
      ctx.strokeStyle = glowGradient;
      ctx.lineWidth = 4; // ТОЛЩЕ
      ctx.lineCap = "round";
      ctx.stroke();

      // Дополнительный слой свечения
      ctx.beginPath();
      ctx.arc(centerX, centerY, size / 2.15, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(220, 60, 60, ${0.05 + responsiveVolume * 0.08})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [volume, frequencyData, isActive, size]);

  return (
    <div className={styles.container} style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        className={`${styles.canvas} ${isActive ? styles.active : ""}`}
      />
    </div>
  );
};
