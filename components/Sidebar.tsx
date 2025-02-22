import {
    Pen,
    Eraser,
    Square,
    Circle,
    Type,
    Undo,
    Redo,
    Save,
    Trash2,
    PenTool,
    Highlighter,
} from "lucide-react"

const tools = [
    { icon: Pen, name: "Pen" },
    { icon: Highlighter, name: "Highlighter" },
    { icon: PenTool, name: "Brush" },
    { icon: Eraser, name: "Eraser" },
    { icon: Square, name: "Rectangle" },
    { icon: Circle, name: "Ellipse" },
    { icon: Type, name: "Text" }
]

const actions = [
    { icon: Undo, name: "Undo" },
    { icon: Redo, name: "Redo" },
    { icon: Save, name: "Save" },
    { icon: Trash2, name: "Clear" }
]

export default function Sidebar() {
    return (
        <div className="bg-black w-14 flex flex-col h-screen border-r border-gray-800 overflow-y-auto">
            <div className="flex-1 py-2 space-y-2">
                <div className="space-y-1">
                    {tools.map((Tool, index) => (
                        <div
                            key={index}
                            className="w-10 h-10 mx-auto flex flex-col items-center justify-center rounded-xl cursor-pointer hover:bg-gray-800 hover:rounded-xl transition-colors group"
                            title={Tool.name}
                        >
                            <Tool.icon size={18} className="text-gray-400 group-hover:text-white" />
                        </div>
                    ))}
                </div>
                <div className="w-full h-px bg-gray-800 my-1" />
                <div className="space-y-1">
                    {actions.map((Action, index) => (
                        <div
                            key={index}
                            className="w-10 h-10 mx-auto flex flex-col items-center justify-center rounded-xl cursor-pointer hover:bg-gray-800 hover:rounded-xl transition-colors group"
                            title={Action.name}
                        >
                            <Action.icon size={18} className="text-gray-400 group-hover:text-white" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}  