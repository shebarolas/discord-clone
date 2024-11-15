import { ActionTools } from "@/types/actions/action-tool";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export default function ActionTool({ label, children, side, align} : ActionTools) {
  return (
    <TooltipProvider>
        <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
            {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
            <p className="font-semibold text-sm capitalize">
                {label.toLowerCase()}
            </p>
        </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}
