"use client";

import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Point = { x: number; y: number; age: number };
    let points: Point[] = [];
    let mouseX = -100;
    let mouseY = -100;

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      points.push({ x: mouseX, y: mouseY, age: 0 });
    };
    window.addEventListener("mousemove", handleMove);

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      points.forEach((p) => (p.age += 1));
      points = points.filter((p) => p.age < 40);

      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const lifeRatio = 1 - p1.age / 40;

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(220, 90, 100, ${lifeRatio * 0.5})`;
        ctx.lineWidth = 14 * lifeRatio;
        ctx.shadowColor = "rgba(220, 90, 100, 0.8)";
        ctx.shadowBlur = 20;
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
}