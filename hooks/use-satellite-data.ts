"use client"

import { useState, useEffect, useCallback } from "react"
import type { Satellite } from "../app/page"

interface UseSatelliteDataProps {
  objectTypes: string[]
  searchTerm: string
}

interface ApiResponse {
  data: Satellite[]
  counts: {
    total: string
    PAYLOAD: string
    "ROCKET BODY": string
    UNKNOWN: string
    DEBRIS: string
  }
}

export function useSatelliteData({ objectTypes, searchTerm }: UseSatelliteDataProps) {
  const [data, setData] = useState<Satellite[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [counts, setCounts] = useState<ApiResponse["counts"] | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (objectTypes.length > 0) {
        params.append("objectTypes", objectTypes.join(","))
      }

      params.append(
        "attributes",
        "noradCatId,intlDes,name,launchDate,decayDate,objectType,launchSiteCode,countryCode,orbitCode",
      )

      console.log("Fetching data from:", `https://backend.digantara.dev/v1/satellites?${params}`)

      const response = await fetch(`https://backend.digantara.dev/v1/satellites?${params}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error:", errorText)
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
      }

      const result: ApiResponse = await response.json()
      console.log("API Response:", {
        dataLength: result.data?.length,
        counts: result.counts,
        firstItem: result.data?.[0],
      })

      let filteredData = result.data || []

      // Apply search filter on client side
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        filteredData = filteredData.filter(
          (satellite) =>
            satellite.name?.toLowerCase().includes(searchLower) || satellite.noradCatId?.includes(searchTerm),
        )
      }

      setData(filteredData)
      setCounts(result.counts)
    } catch (err) {
      console.error("Fetch error:", err)
      setError(err instanceof Error ? err.message : "An error occurred while fetching data")
      setData([])
    } finally {
      setLoading(false)
    }
  }, [objectTypes, searchTerm])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    counts,
    refetch: fetchData,
  }
}
