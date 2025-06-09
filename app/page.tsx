"use client"

import type React from "react"

import { useState, useMemo, useCallback } from "react"
import { Search, ChevronDown, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { VirtualizedTable } from "../components/virtualized-table"
import { SelectedAssets } from "../components/selected-assets"
import { useDebounce } from "../hooks/use-debounce"
import { useSatelliteData } from "../hooks/use-satellite-data"
import { useLocalStorage } from "../hooks/use-local-storage"

const OBJECT_TYPES = ["ROCKET BODY", "DEBRIS", "UNKNOWN", "PAYLOAD"]
const ORBIT_CODES = [
  "LEO",
  "LEO1",
  "LEO2",
  "LEO3",
  "LEO4",
  "MEO",
  "GEO",
  "HEO",
  "IGO",
  "EGO",
  "NSO",
  "GTO",
  "GHO",
  "HAO",
  "MGO",
  "LMO",
  "UFO",
  "ESO",
  "UNKNOWN",
]

export interface Satellite {
  noradCatId: string
  intlDes: string
  name: string
  launchDate: string
  decayDate: string | null
  objectType: string
  launchSiteCode: string
  countryCode: string
  orbitCode: string
}

export default function SatelliteTracker() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [selectedObjectTypes, setSelectedObjectTypes] = useState<string[]>(OBJECT_TYPES)
  const [selectedOrbitCodes, setSelectedOrbitCodes] = useState<string[]>([])
  const [selectedSatellites, setSelectedSatellites] = useLocalStorage<Satellite[]>("selected-satellites", [])
  const [sortConfig, setSortConfig] = useState<{ key: keyof Satellite; direction: "asc" | "desc" } | null>(null)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const { data, loading, error, counts, refetch } = useSatelliteData({
    objectTypes: selectedObjectTypes,
    searchTerm: debouncedSearchTerm,
  })

  const handleSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        setSearchTerm(searchInput)
      }
    },
    [searchInput],
  )

  const handleApplyFilters = useCallback(() => {
    refetch()
  }, [refetch])

  const filteredData = useMemo(() => {
    if (!data) return []

    let filtered = data

    // Filter by orbit codes if any selected
    if (selectedOrbitCodes.length > 0) {
      filtered = filtered.filter((satellite) => selectedOrbitCodes.some((code) => satellite.orbitCode.includes(code)))
    }

    return filtered
  }, [data, selectedOrbitCodes])

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredData, sortConfig])

  const handleSort = useCallback((key: keyof Satellite) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }, [])

  const handleSelectSatellite = useCallback(
    (satellite: Satellite, checked: boolean) => {
      if (checked) {
        if (selectedSatellites.length >= 10) {
          alert("Maximum 10 selections allowed")
          return
        }
        setSelectedSatellites((prev) => [...prev, satellite])
      } else {
        setSelectedSatellites((prev) => prev.filter((s) => s.noradCatId !== satellite.noradCatId))
      }
    },
    [selectedSatellites.length, setSelectedSatellites],
  )

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const availableSlots = 10 - selectedSatellites.length
        const toSelect = sortedData
          .slice(0, availableSlots)
          .filter((satellite) => !selectedSatellites.some((s) => s.noradCatId === satellite.noradCatId))
        setSelectedSatellites((prev) => [...prev, ...toSelect])
      } else {
        const currentPageIds = new Set(sortedData.map((s) => s.noradCatId))
        setSelectedSatellites((prev) => prev.filter((s) => !currentPageIds.has(s.noradCatId)))
      }
    },
    [sortedData, selectedSatellites, setSelectedSatellites],
  )

  const isSelected = useCallback(
    (satellite: Satellite) => {
      return selectedSatellites.some((s) => s.noradCatId === satellite.noradCatId)
    },
    [selectedSatellites],
  )

  const allCurrentPageSelected = useMemo(() => {
    return sortedData.length > 0 && sortedData.every((satellite) => isSelected(satellite))
  }, [sortedData, isSelected])

  const someCurrentPageSelected = useMemo(() => {
    return sortedData.some((satellite) => isSelected(satellite))
  }, [sortedData, isSelected])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto p-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white">Create My Asset List</CardTitle>

                {/* Object Type Filters */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge
                    variant="secondary"
                    className="bg-slate-700 text-white hover:bg-slate-600 cursor-pointer"
                    onClick={() => setSelectedObjectTypes(OBJECT_TYPES)}
                  >
                    All Objects ({counts?.total || 0})
                  </Badge>
                  {OBJECT_TYPES.map((type) => (
                    <Badge
                      key={type}
                      variant={selectedObjectTypes.includes(type) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedObjectTypes.includes(type)
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }`}
                      onClick={() => {
                        setSelectedObjectTypes((prev) =>
                          prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
                        )
                      }}
                    >
                      {type === "ROCKET BODY"
                        ? "Rocket Bodies"
                        : type === "DEBRIS"
                          ? "Debris"
                          : type === "UNKNOWN"
                            ? "Unknown"
                            : "Payloads"}{" "}
                      ({counts?.[type] || 0})
                    </Badge>
                  ))}
                </div>

                {/* Search and Filters */}
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search by Name/NORAD ID"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onKeyDown={handleSearch}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                        Orbit Code <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-slate-800 border-slate-700">
                      {ORBIT_CODES.map((code) => (
                        <DropdownMenuCheckboxItem
                          key={code}
                          checked={selectedOrbitCodes.includes(code)}
                          onCheckedChange={(checked) => {
                            setSelectedOrbitCodes((prev) =>
                              checked ? [...prev, code] : prev.filter((c) => c !== code),
                            )
                          }}
                          className="text-white"
                        >
                          {code}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Apply Filters
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {error && (
                  <Alert className="mb-4 bg-red-900 border-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-red-200">
                      <div>Error: {error}</div>
                      <div className="text-xs mt-1">Check the browser console for more details</div>
                    </AlertDescription>
                  </Alert>
                )}

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2 text-slate-300">Loading satellites...</span>
                    <div className="text-xs text-slate-400 mt-2">This may take a moment due to large dataset</div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all"
                          checked={allCurrentPageSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someCurrentPageSelected && !allCurrentPageSelected
                          }}
                          onCheckedChange={handleSelectAll}
                        />
                        <label htmlFor="select-all" className="text-sm text-slate-300">
                          Select all
                        </label>
                      </div>
                      <span className="text-sm text-slate-400">
                        {sortedData.length} objects{" "}
                        {data.length !== sortedData.length && `(filtered from ${data.length})`}
                      </span>
                    </div>

                    <VirtualizedTable
                      data={sortedData}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      selectedSatellites={selectedSatellites}
                      onSelectSatellite={handleSelectSatellite}
                      isSelected={isSelected}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Selected Assets Sidebar */}
          <SelectedAssets
            selectedSatellites={selectedSatellites}
            onRemove={(satellite) => handleSelectSatellite(satellite, false)}
            onClearAll={() => setSelectedSatellites([])}
          />
        </div>
      </div>
    </div>
  )
}
