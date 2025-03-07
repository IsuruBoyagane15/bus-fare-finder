"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import Select from "react-select"
import { BusType, BusTypeLabels } from "@/lib/types"
import { api } from "@/lib/api"
import { toast } from "sonner"

const busTypes = Object.values(BusType).map(type => ({
  id: type,
  label: BusTypeLabels[type]
}))

export default function Home() {
  const [routes, setRoutes] = useState<Array<{ value: string; label: string }>>([])
  const [selectedRoute, setSelectedRoute] = useState<{ value: string; label: string } | null>(null)
  const [startingCity, setStartingCity] = useState<{ value: string; label: string } | null>(null)
  const [endingCity, setEndingCity] = useState<{ value: string; label: string } | null>(null)
  const [selectedBusTypes, setSelectedBusTypes] = useState<BusType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<Record<BusType, number | null> | null>(null)
  const [availableCities, setAvailableCities] = useState<{ value: string; label: string }[]>([])

  // Load routes on component mount
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const { routes } = await api.routes.getList()
        setRoutes(routes.map(route => ({
          value: route._id,
          label: `${route.number} - ${route.name}`
        })))
      } catch (error) {
        console.error('Failed to load routes:', error)
        toast.error('Failed to load routes')
      }
    }
    loadRoutes()
  }, [])

  // Load cities when route is selected
  useEffect(() => {
    const loadCities = async () => {
      if (selectedRoute) {
        try {
          const { cities } = await api.routes.getCities(selectedRoute.value)
          setAvailableCities(cities.map(city => ({ value: city, label: city })))
          setStartingCity(null)
          setEndingCity(null)
        } catch (error) {
          console.error('Failed to load cities:', error)
          toast.error('Failed to load cities')
        }
      } else {
        setAvailableCities([])
      }
    }
    loadCities()
  }, [selectedRoute])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRoute || !startingCity || !endingCity) {
      toast.error("Please select a route, starting city, and ending city.")
      return
    }

    setIsLoading(true)
    setSearchResults(null)

    try {
      const response = await api.routes.searchFare(
        selectedRoute.value,
        startingCity.value,
        endingCity.value,
        selectedBusTypes.length > 0 ? selectedBusTypes : undefined
      )
      setSearchResults(response.results)
    } catch (error) {
      console.error('Failed to search fare:', error)
      toast.error('Failed to search fare')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mt-8 mx-auto max-w-2xl px-4">
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-center">Sri Lanka Bus Fare Finder</h1>
        <p className="text-center text-muted-foreground">Find fares for bus routes across Sri Lanka</p>
        <form onSubmit={handleSearch} className="space-y-4">
          <Select
            className="w-full"
            options={routes}
            value={selectedRoute}
            onChange={setSelectedRoute}
            placeholder="Select Bus Route"
            isClearable
          />
          {selectedRoute && (
            <>
              <Select
                className="w-full"
                options={availableCities}
                value={startingCity}
                onChange={setStartingCity}
                placeholder="Starting City"
                isClearable
              />
              <Select
                className="w-full"
                options={availableCities}
                value={endingCity}
                onChange={setEndingCity}
                placeholder="Ending City"
                isClearable
              />
            </>
          )}
          <div className="space-y-2">
            <p className="font-medium">Bus Type (Optional):</p>
            <div className="flex flex-wrap gap-4">
              {busTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.id}
                    checked={selectedBusTypes.includes(type.id as BusType)}
                    onCheckedChange={(checked) => {
                      setSelectedBusTypes(
                        checked ? [...selectedBusTypes, type.id as BusType] : selectedBusTypes.filter((id) => id !== type.id),
                      )
                    }}
                  />
                  <label htmlFor={type.id}>{type.label}</label>
                </div>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            disabled={isLoading || !selectedRoute || !startingCity || !endingCity}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </form>
        {isLoading && (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">Searching for bus fares...</p>
          </div>
        )}
        {searchResults && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Bus Fare from {startingCity?.label} to {endingCity?.label}
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bus Type</TableHead>
                  <TableHead>Fare</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(searchResults).map(([busType, fare]) => (
                  <TableRow key={busType}>
                    <TableCell className="font-medium">{BusTypeLabels[busType as BusType]}</TableCell>
                    <TableCell>{fare !== null ? `Rs. ${fare}` : "Not Available"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

