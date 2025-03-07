import { create} from "zustand";

interface Shape {
    id: string,
    type: "shape" | "ellipse" | "line",
    cords: {x: number, y: number},
    size: {height: number, width: number}
}

interface Pencil {
    id: string,
    type: "pencil",
    cords: {x: number, y: number}[]    
}

interface shape_store {
    shapes: (Shape | Pencil)[],
    shapes_length: number,
    shape: string,
    setShapes: (newShapes: (Shape | Pencil)[]) => void,
    setShape: (newShape: string) => void,
    setShapesLength: (shapesLength: number) => void
}


export const shape_store = create<shape_store>()((set) => {
    return{
        shapes: [],
        shapes_length: 0,
        shape: "pencil",
        setShapes: (newShapes: (Shape | Pencil)[]) => set((state) => {
            return {
                shapes: newShapes
            }
        }),
        setShapesLength: (shapesLength: number) => set((state) => {
            return {
                shapes_length: shapesLength+1
            }
        }),
        setShape: (newShape: string) => set((state) => {
            return {
                shape: newShape
            }
        })
    }
})
    