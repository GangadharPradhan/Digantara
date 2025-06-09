"use client"

import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import type { Satellite } from "../app/page"

export default function SelectedPage() {
  const [selectedSatellites, setSelectedSatellites] = useState<Satellite[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem("selected-satellites")
      if (stored) {
        setSelectedSatellites(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Error loading selected satellites:", error)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Selection
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Selected Satellites</h1>
          </div>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl">Your Asset List ({selectedSatellites.length} items)</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedSatellites.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {selectedSatellites.map((satellite, index) => (
                      <div
                        key={satellite.noradCatId}
                        className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-white">{satellite.name}</div>
                            <div className="text-sm text-slate-400">NORAD ID: {satellite.noradCatId}</div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-slate-400">
                          <div>{satellite.objectType}</div>
                          <div>{satellite.countryCode}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  No satellites selected. Go back to make your selection.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
