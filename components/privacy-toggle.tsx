import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Lock, Globe, ChevronDown, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

interface PrivacyToggleProps {
  noteId: string
  isPublic: boolean
  onPrivacyChange?: (isPublic: boolean) => void
  disabled?: boolean
  size?: "sm" | "default" | "lg"
  showLabel?: boolean
}

export function PrivacyToggle({ 
  noteId, 
  isPublic, 
  onPrivacyChange, 
  disabled = false,
  size = "default",
  showLabel = true
}: PrivacyToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentState, setCurrentState] = useState(isPublic)

  const handlePrivacyToggle = async (newPublicState: boolean) => {
    if (isUpdating || disabled) return

    try {
      setIsUpdating(true)
      await api.updateNote(noteId, { is_public: newPublicState })
      setCurrentState(newPublicState)
      onPrivacyChange?.(newPublicState)
    } catch (error) {
      console.error("Failed to update privacy:", error)
      // Optionally show error toast here
    } finally {
      setIsUpdating(false)
    }
  }

  const PrivacyIcon = currentState ? Globe : Lock
  const privacyLabel = currentState ? "Public" : "Private"
  const privacyDescription = currentState 
    ? "Anyone can view this note" 
    : "Only you can view this note"

  if (showLabel) {
    return (
      <TooltipProvider>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size={size}
                  className="gap-2"
                  disabled={disabled || isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <PrivacyIcon className="h-4 w-4" />
                  )}
                  {privacyLabel}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>{privacyDescription}</p>
            </TooltipContent>
          </Tooltip>
          
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handlePrivacyToggle(false)}
              className="flex items-center gap-2"
              disabled={!currentState}
            >
              <Lock className="h-4 w-4" />
              <div>
                <div className="font-medium">Private</div>
                <div className="text-xs text-muted-foreground">Only you can view</div>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem
              onClick={() => handlePrivacyToggle(true)}
              className="flex items-center gap-2"
              disabled={currentState}
            >
              <Globe className="h-4 w-4" />
              <div>
                <div className="font-medium">Public</div>
                <div className="text-xs text-muted-foreground">Anyone can view</div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    )
  }

  // Icon-only version
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePrivacyToggle(!currentState)}
            disabled={disabled || isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PrivacyIcon className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to make {currentState ? 'private' : 'public'}</p>
          <p className="text-xs text-muted-foreground">{privacyDescription}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}