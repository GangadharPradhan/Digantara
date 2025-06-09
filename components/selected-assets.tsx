"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import type { Satellite } from "../app/page"

interface SelectedAssetsProps {
  selectedSatellites: Satellite[]
  onRemove: (satellite: Satellite) => void
  onClearAll: () => void
}

export function SelectedAssets({ selectedSatellites, onRemove, onClearAll }: SelectedAssetsProps) {
  const router = useRouter()

  const handleProceed = () => {
    if (selectedSatellites.length > 0) {
      router.push("/selected")
    }
  }

  return (
    <Card className="w-80 bg-slate-800 border-slate-700 h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">Selected Assets</CardTitle>
          {selectedSatellites.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll} className="text-slate-400 hover:text-white">
              Clear all
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-600">
            {selectedSatellites.length} objects selected
          </Badge>
          {selectedSatellites.length >= 10 && (
            <Badge variant="destructive" className="text-xs">
              Max reached
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="max-h-96 overflow-y-auto space-y-2">
          {selectedSatellites.map((satellite) => (
            <div key={satellite.noradCatId} className="flex items-center justify-between p-2 bg-slate-700 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{satellite.name}</div>
                <div className="text-xs text-slate-400">ID: {satellite.noradCatId}</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(satellite)}
                className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {selectedSatellites.length === 0 && <div className="text-center py-8 text-slate-400">No assets selected</div>}

        <Button
          onClick={handleProceed}
          disabled={selectedSatellites.length === 0}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600"
        >
          PROCEED
        </Button>
      </CardContent>
    </Card>
  )
}
