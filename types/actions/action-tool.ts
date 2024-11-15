export interface ActionTools{
    label: string,
    children: React.ReactNode,
    side? : "top" | "right" | "bottom" | "left",
    align? : "start" | "center" | "end"
}