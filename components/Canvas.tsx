"use client"

import { shape_store } from "@/zustand_store/shapes_store";
import { nanoid } from "nanoid";
import { useEffect, useRef, useState, MouseEvent } from "react"

interface Shape {
    id: string,
    type: "shape",
    cords: {x: number, y: number},
    size: {height: number, width: number}
}

interface Pencil {
    id: string,
    type: "pencil",
    cords: {x: number, y: number}[]    
}

export default function Canvas() {

    const canvas = useRef<HTMLCanvasElement | null>(null);
    const canvasContext = useRef<CanvasRenderingContext2D | null>(null)
    const [isDrawing, setIsDrawing] = useState(false);
    const [pencilStroke, setPencilStroke] = useState<{ x: number; y: number }[]>([])

    const { shapes, setShapes, shape } = shape_store();

    useEffect(() => {
        if (canvas.current) {
            const ctx = canvas.current.getContext("2d");
            canvasContext.current = ctx;
      
            const rect = canvas.current.getBoundingClientRect();
            const scale = window.devicePixelRatio;
      
            canvas.current.width = rect.width * scale;
            canvas.current.height = rect.height * scale;
      
            if (ctx) {
              ctx.scale(scale, scale);
            }
          }
    }, []);

    const drawShapes = (shapes: (Shape | Pencil)[]) => {
        const ctx = canvasContext.current;
        if(!ctx) return;
        
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        shapes.forEach((shape) => {
            if(shape.type == "pencil"){
                if (shape.cords.length < 2) return;
                ctx.strokeStyle = "white";
                ctx.lineWidth = 1;
                ctx.lineJoin = "round";
                ctx.lineCap = "round";
    
                ctx.beginPath();
                ctx.moveTo(shape.cords[0].x, shape.cords[0].y);
    
                for (let i = 1; i < shape.cords.length; i++) {
                    ctx.lineTo(shape.cords[i].x, shape.cords[i].y);
                }
                ctx.stroke();
            } else {
                ctx.fillRect(shape.cords.x, shape.cords.y, shape.size.width, shape.size.height);
            }
        });

    }

    useEffect(() => {

        drawShapes(shapes)

    }, [shapes])

    const getMousePos = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!canvas.current) return { x: 0, y: 0 };
    
        const rect = canvas.current.getBoundingClientRect();
        const scaleX = canvas.current.width / rect.width;
        const scaleY = canvas.current.height / rect.height;
    
        return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY,
        };
      };

    const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {   
        if (!canvasContext.current) return;

        const ctx = canvasContext.current
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        const { x, y } = getMousePos(e);
        ctx.beginPath()
        ctx.moveTo(x, y)

        setIsDrawing(true);

    }

    const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {

        if (!canvasContext.current || !isDrawing) return;

        const { x, y } = getMousePos(e);

        switch (shape) {
            case "pencil":
                const ctx = canvasContext.current
                ctx.lineTo(x, y)
                ctx.stroke();
                setPencilStroke((prev) => [...prev, {x, y}])
                break;

            default:
                break;
        }

    }
    
    const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(false);
        if(!canvasContext.current) return;
        canvasContext.current.beginPath()

        switch (shape) {
            case "pencil":
                const id = nanoid()
                setShapes({
                    id,
                    type: "pencil",
                    cords: pencilStroke
                })
                setPencilStroke([])
                break;
        
            default:
                break;
        }

    }

  return (
    <div className="flex-1 bg-black p-4 flex flex-col h-screen overflow-hidden">
      <canvas ref={canvas} className="border border-gray-800 rounded-xl flex-1 flex items-center justify-center overflow-hidden cursor-pointer" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      </canvas>
    </div>
  )
}