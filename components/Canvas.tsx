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
    
    const [startX, setStartX] = useState<number | null>(null);
    const [startY, setStartY] = useState<number | null>(null);

    const [height, setHeight] = useState<number | null>(null)
    const [width, setWidth] = useState<number | null>(null)

    const [draggingShape, setDraggingShape] = useState<Shape | null>(null);
    const [draggingOffset, setDraggingOffset] = useState({ x: 0, y: 0 });

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
                ctx.fillStyle = "transparent"
                ctx.fillRect(shape.cords.x, shape.cords.y, shape.size.width, shape.size.height);
                ctx.strokeRect(shape.cords.x, shape.cords.y, shape.size.width, shape.size.height)
            }
        });

    }

    useEffect(() => {

        drawShapes(shapes)

    }, [shapes])

    // useEffect(() => {
    //     console.log(draggingShape)
    // }, [draggingShape])

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
        setStartX(x);
        setStartY(y);
        ctx.beginPath()
        ctx.moveTo(x, y)

        switch (shape) {
            case "hand":
                for (let _shape of shapes){
                    if(_shape.type == "shape"){
                        if(x >= _shape.cords.x && x <= (_shape.cords.x + _shape.size.width) && y >= _shape.cords.y && y <= _shape.cords.y + _shape.size.height){
                            setDraggingShape(() => _shape)
                            setDraggingOffset({ x:x - _shape.cords.x, y: y- _shape.cords.y })
                            break;
                        }
                    }
                }
                break;
        
            default:
                break;
        }
        
        setIsDrawing(true);
        
    }

    const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
        if(!canvas.current) return;
        
        const ctx = canvasContext.current
        
        if (!ctx || !isDrawing) return;
        
        const { x, y } = getMousePos(e);
        
        switch (shape) {
            case "pencil":
                ctx.lineTo(x, y)
                ctx.stroke();
                setPencilStroke((prev) => [...prev, {x, y}])
                break;
                
            case "rectangle":
                if(!(startX && startY)) return;
                switch (e.shiftKey) {
                    case true:
                        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
                        drawShapes(shapes)
                        ctx.fillStyle = "transparent"
                        ctx.fillRect(startX,startY,x-startX, x-startX)       
                        ctx.strokeRect(startX,startY,x-startX, x-startX)
                        setWidth(x-startX)
                        setHeight(x-startX)
                        break;
                
                    default:
                        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
                        drawShapes(shapes)
                        ctx.fillStyle = "transparent"
                        ctx.fillRect(startX,startY,x-startX, y-startY)       
                        ctx.strokeRect(startX,startY,x-startX, y-startY)
                        setWidth(x-startX)
                        setHeight(y-startY)       
                        break;
                }  
                break;  

            case "hand":
                if(!draggingShape) return;
                const updatedShapes = shapes.map((shape) => {
                    if (shape.type === "shape" && shape.id === draggingShape.id) {
                        return {
                            ...shape,
                            cords: {
                                x: (x-draggingOffset.x),
                                y: (y-draggingOffset.y)
                            }
                        };
                        
                    }
                    return shape;
                });
                setShapes(updatedShapes);
                drawShapes(shapes)
                break;
            default:
                break;
        }

    }
    
    const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(false);
        if(!canvasContext.current) return;
        canvasContext.current.beginPath()

        const id = nanoid()
        switch (shape) {
            case "pencil":
                if(!pencilStroke.length) return;
                setShapes([...shapes, {
                    id,
                    type: "pencil",
                    cords: pencilStroke
                }])
                setPencilStroke([])
                break;

            case "hand":
                setDraggingShape(null)
                break;

            default:
                if(!(startX && startY)) return;
                if(!(height && width)) return;
                setShapes([...shapes, {
                    id,
                    type: "shape",
                    cords: {x: startX, y: startY},
                    size: { height, width }
                }])
                setHeight(0)
                setWidth(0)
                break;
        }

    }

  return (
    <div className="flex-1 bg-black p-4 flex flex-col h-screen overflow-hidden">
      <canvas ref={canvas} className="border border-gray-800 rounded-xl flex-1 flex items-center justify-center overflow-hidden cursor-pointer" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      </canvas>
    </div>
  )
}