"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2 } from "lucide-react"
import Select from "react-select"

const busTypes = [
  { id: "luxury", label: "Luxury" },
  { id: "semi-luxury", label: "Semi-Luxury" },
  { id: "expressway", label: "Expressway" },
  { id: "ac", label: "AC" },
]

const sampleRoutes = [
  { value: "Colombo-Kandy", label: "Colombo - Kandy" },
  { value: "Colombo-Galle", label: "Colombo - Galle" },
  { value: "Kandy-Nuwara Eliya", label: "Kandy - Nuwara Eliya" },
  { value: "Colombo-Jaffna", label: "Colombo - Jaffna" },
  { value: "Galle-Matara", label: "Galle - Matara" },
]

const sampleCities = {
  "Colombo-Kandy": ["Colombo", "Kadawatha", "Warakapola", "Kegalle", "Mawanella", "Kadugannawa", "Kandy"],
  "Colombo-Galle": ["Colombo", "Panadura", "Kalutara", "Beruwala", "Aluthgama", "Hikkaduwa", "Galle"],
  "Kandy-Nuwara Eliya": ["Kandy", "Peradeniya", "Gampola", "Nawalapitiya", "Hatton", "Nuwara Eliya"],
  "Colombo-Jaffna": ["Colombo", "Kurunegala", "Dambulla", "Anuradhapura", "Vavuniya", "Kilinochchi", "Jaffna"],
  "Galle-Matara": ["Galle", "Unawatuna", "Weligama", "Mirissa", "Matara"],
}

const sampleResults = [
  { id: 1, route: "Colombo - Kandy", luxury: 1000, semiLuxury: 800, expressway: 1200, ac: 1500 },
  { id: 2, route: "Colombo - Galle", luxury: 800, semiLuxury: 600, expressway: 1000, ac: 1200 },
  { id: 3, route: "Kandy - Nuwara Eliya", luxury: 600, semiLuxury: 500, expressway: null, ac: 800 },
]

export default function Home() {
  const [selectedRoute, setSelectedRoute] = useState<{ value: string; label: string } | null>(null)
  const [startingCity, setStartingCity] = useState<{ value: string; label: string } | null>(null)
  const [endingCity, setEndingCity] = useState<{ value: string; label: string } | null>(null)
  const [selectedBusTypes, setSelectedBusTypes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])

  const [availableCities, setAvailableCities] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    if (selectedRoute) {
      const cities = sampleCities[selectedRoute.value].map((city) => ({ value: city, label: city }))
      setAvailableCities(cities)
      setStartingCity(null)
      setEndingCity(null)
    } else {
      setAvailableCities([])
    }
  }, [selectedRoute])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRoute || !startingCity || !endingCity) {
      alert("Please select a route, starting city, and ending city.")
      return
    }
    setIsLoading(true)
    setResults([])

    // Simulate API call with a delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setResults(sampleResults)
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto max-w-2xl px-4">
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-center">Sri Lanka Bus Fare Finder</h1>
        <p className="text-center text-muted-foreground">Find fares for over 10,000 bus routes across Sri Lanka</p>
        <form onSubmit={handleSearch} className="space-y-4">
          <Select
            className="w-full"
            options={sampleRoutes}
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
                    checked={selectedBusTypes.includes(type.id)}
                    onCheckedChange={(checked) => {
                      setSelectedBusTypes(
                        checked ? [...selectedBusTypes, type.id] : selectedBusTypes.filter((id) => id !== type.id),
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
        {results.length > 0 && (
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
                {Object.entries(results[0]).map(([key, value]) => {
                  if (key !== "id" && key !== "route") {
                    return (
                      <TableRow key={key}>
                        <TableCell className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</TableCell>
                        <TableCell>{value ? `Rs. ${value}` : "N/A"}</TableCell>
                      </TableRow>
                    )
                  }
                  return null
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

