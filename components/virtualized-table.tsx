"use client"

import type React from "react"

import { useMemo } from "react"
import { FixedSizeList as List } from "react-window"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { Satellite } from "../app/page"

interface VirtualizedTableProps {
  data: Satellite[]
  onSort: (key: keyof Satellite) => void
  sortConfig: { key: keyof Satellite; direction: "asc" | "desc" } | null
  selectedSatellites: Satellite[]
  onSelectSatellite: (satellite: Satellite, checked: boolean) => void
  isSelected: (satellite: Satellite) => boolean
}

interface RowProps {
  index: number
  style: React.CSSProperties
  data: {
    satellites: Satellite[]
    onSelectSatellite: (satellite: Satellite, checked: boolean) => void
    isSelected: (satellite: Satellite) => boolean
  }
}

const Row = ({ index, style, data }: RowProps) => {
  const satellite = data.satellites[index]
  const selected = data.isSelected(satellite)

  return (
    <div
      style={style}
      className={`flex items-center px-4 py-2 border-b border-slate-700 hover:bg-slate-700/50 ${
        selected ? "bg-blue-900/30" : ""
      }`}
    >
      <div className="w-12 flex justify-center">
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => data.onSelectSatellite(satellite, checked as boolean)}
        />
      </div>
      <div className="w-24 text-sm font-mono">{satellite.noradCatId}</div>
      <div className="w-48 text-sm truncate">{satellite.name}</div>
      <div className="w-32 text-sm">{satellite.orbitCode}</div>
      <div className="w-32 text-sm">{satellite.objectType}</div>
      <div className="w-24 text-sm">{satellite.countryCode}</div>
      <div className="w-32 text-sm">{satellite.launchDate}</div>
    </div>
  )
}

const SortButton = ({
  children,
  sortKey,
  onSort,
  sortConfig,
}: {
  children: React.ReactNode
  sortKey: keyof Satellite
  onSort: (key: keyof Satellite) => void
  sortConfig: { key: keyof Satellite; direction: "asc" | "desc" } | null
}) => {
  const isActive = sortConfig?.key === sortKey
  const direction = sortConfig?.direction

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSort(sortKey)}
      className="h-auto p-1 text-slate-300 hover:text-white hover:bg-slate-700"
    >
      {children}
      {isActive &&
        (direction === "asc" ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />)}
    </Button>
  )
}

export function VirtualizedTable({
  data,
  onSort,
  sortConfig,
  selectedSatellites,
  onSelectSatellite,
  isSelected,
}: VirtualizedTableProps) {
  const itemData = useMemo(
    () => ({
      satellites: data,
      onSelectSatellite,
      isSelected,
    }),
    [data, onSelectSatellite, isSelected],
  )

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-slate-800 border-b border-slate-700 font-medium text-sm">
        <div className="w-12"></div>
        <div className="w-24">
          <SortButton sortKey="noradCatId" onSort={onSort} sortConfig={sortConfig}>
            NORAD ID
          </SortButton>
        </div>
        <div className="w-48">
          <SortButton sortKey="name" onSort={onSort} sortConfig={sortConfig}>
            Name
          </SortButton>
        </div>
        <div className="w-32">Orbit Code</div>
        <div className="w-32">Object Type</div>
        <div className="w-24">
          <SortButton sortKey="countryCode" onSort={onSort} sortConfig={sortConfig}>
            Country
          </SortButton>
        </div>
        <div className="w-32">
          <SortButton sortKey="launchDate" onSort={onSort} sortConfig={sortConfig}>
            Launch Date
          </SortButton>
        </div>
      </div>

      {/* Virtualized List */}
      <div className="bg-slate-800">
        {data.length > 0 ? (
          <List height={600} itemCount={data.length} itemSize={50} itemData={itemData}>
            {Row}
          </List>
        ) : (
          <div className="flex items-center justify-center py-12 text-slate-400">No satellites found</div>
        )}
      </div>
    </div>
  )
}
