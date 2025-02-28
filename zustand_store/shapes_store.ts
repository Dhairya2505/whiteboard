import { create} from "zustand";

interface Shape {
    id: string,
    type: "shape",
    cords: {x: number, y: number},
    size: {height: number, width: number}
}

interface Pencil {
    id: string,
    type: "pencil" | "eraser",
    cords: {x: number, y: number}[]    
}

interface shape_store {
    shapes: (Shape | Pencil)[],
    shape: string
    setShapes: (newShapes: (Shape | Pencil)[]) => void
    setShape: (newShape: string) => void
}


export const shape_store = create<shape_store>()((set) => {
    return{
        shapes: [],
        shape: "pencil",
        setShapes: (newShapes: (Shape | Pencil)[]) => set((state) => {
            return {
                shapes: newShapes
            }
        }),
        setShape: (newShape: string) => set((state) => {
            return {
                shape: newShape
            }
        })
    }
})
    