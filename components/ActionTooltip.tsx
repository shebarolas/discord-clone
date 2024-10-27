import { TooltipInterface } from "@/types/interfaces/tooltip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function ActionTooltip({
    label,
    children,
    side,
    align
}: TooltipInterface) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p className="font-semibold text-sm capitalize">{label.toLowerCase()}</p>

                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
