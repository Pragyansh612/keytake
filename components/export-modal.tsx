import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download, Loader2, FileText, FileJson, File } from "lucide-react"
import { api } from "@/lib/api"
import { ExportFormats } from "@/types/types"

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  noteId: string
  noteTitle: string
}

export function ExportModal({ isOpen, onClose, noteId, noteTitle }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormats>("markdown")
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      await api.exportAndDownloadNote(noteId, exportFormat, noteTitle)
      onClose()
    } catch (error) {
      console.error("Export failed:", error)
      alert("Failed to export note. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const formatOptions = [
    {
      value: "markdown" as ExportFormats,
      label: "Markdown",
      description: "Text file with markdown formatting",
      icon: FileText,
    },
    {
      value: "json" as ExportFormats,
      label: "JSON",
      description: "Structured data format",
      icon: FileJson,
    },
    {
      value: "pdf" as ExportFormats,
      label: "PDF",
      description: "Portable document format",
      icon: File,
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Note</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Choose export format:</Label>
            <RadioGroup 
              value={exportFormat} 
              onValueChange={(value) => setExportFormat(value as ExportFormats)}
              className="mt-3"
            >
              {formatOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <option.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}