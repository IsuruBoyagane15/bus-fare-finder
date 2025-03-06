"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PlusCircle, X, Edit2, Check, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const busTypes = ["Luxury", "Semi-Luxury", "Expressway", "AC"]

// Helper functions for flat array operations
function getFareIndex(fromIndex: number, toIndex: number, totalStops: number): number {
  if (fromIndex >= toIndex) return -1;
  let index = 0;
  for (let i = 1; i < toIndex; i++) {
    index += i;
  }
  return index + fromIndex;
}

function calculateFareArraySize(numStops: number): number {
  return (numStops * (numStops - 1)) / 2;
}

const sampleMatrix = {
  id: 1,
  route: "Colombo - Kandy",
  locations: {
    Luxury: ["Colombo Fort", "Kadawatha", "Kegalle", "Kandy"],
    "Semi-Luxury": [
      "Colombo Fort",
      "Maradana",
      "Kelaniya",
      "Kadawatha",
      "Warakapola",
      "Kegalle",
      "Mawanella",
      "Kadugannawa",
      "Peradeniya",
      "Kandy",
    ],
    Expressway: ["Colombo Fort", "Kadawatha", "Kegalle", "Kandy"],
    AC: ["Colombo Fort", "Kadawatha", "Kegalle", "Kandy"],
  }
}

interface FareMatrix {
  [busType: string]: number[];
}

export default function MatrixPage() {
  const params = useParams()
  const matrixId = params.id
  const [activeTab, setActiveTab] = useState(busTypes[0])
  const [matrix, setMatrix] = useState(sampleMatrix)
  const [fares, setFares] = useState<FareMatrix>(() => {
    // Initialize empty fare arrays for each bus type
    const initial: FareMatrix = {};
    busTypes.forEach(type => {
      const numStops = sampleMatrix.locations[type].length;
      initial[type] = new Array(calculateFareArraySize(numStops)).fill(0);
    });
    return initial;
  })
  const [isEditingLocations, setIsEditingLocations] = useState(false)
  const [editableLocations, setEditableLocations] = useState(matrix.locations)
  const [newLocation, setNewLocation] = useState("")
  const [addingAtIndex, setAddingAtIndex] = useState<number | null>(null)

  const handleFareChange = (fromIndex: number, toIndex: number, value: string) => {
    const fareIndex = getFareIndex(fromIndex, toIndex, editableLocations[activeTab].length);
    if (fareIndex === -1) return;

    setFares(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map((fare, i) => 
        i === fareIndex ? Number(value) || 0 : fare
      )
    }));
  }

  const getFare = (fromIndex: number, toIndex: number): string => {
    const fareIndex = getFareIndex(fromIndex, toIndex, editableLocations[activeTab].length);
    if (fareIndex === -1) return "";
    return fares[activeTab][fareIndex].toString();
  }

  const handleSave = () => {
    // Here we would send the flat array to the backend
    console.log("Saving fares:", {
      routeId: matrixId,
      busType: activeTab,
      stops: editableLocations[activeTab],
      fares: fares[activeTab]
    });
    alert("Fares saved successfully!");
  }

  const handleAddLocation = (index: number | null) => {
    if (newLocation && !editableLocations[activeTab].includes(newLocation)) {
      const updatedLocations = { ...editableLocations }
      const oldStops = updatedLocations[activeTab];
      
      if (index === null) {
        updatedLocations[activeTab] = [...oldStops, newLocation]
      } else {
        updatedLocations[activeTab] = [
          ...oldStops.slice(0, index),
          newLocation,
          ...oldStops.slice(index),
        ]
      }

      // Recalculate fares array size
      const newSize = calculateFareArraySize(updatedLocations[activeTab].length);
      const newFares = new Array(newSize).fill(0);
      
      // Copy existing fares to new array
      const oldSize = calculateFareArraySize(oldStops.length);
      for (let i = 0; i < oldSize; i++) {
        newFares[i] = fares[activeTab][i];
      }

      setEditableLocations(updatedLocations);
      setFares(prev => ({
        ...prev,
        [activeTab]: newFares
      }));
      setNewLocation("");
      setAddingAtIndex(null);
    }
  }

  const handleRemoveLocation = (location: string) => {
    const updatedLocations = { ...editableLocations }
    const oldStops = updatedLocations[activeTab];
    const removeIndex = oldStops.indexOf(location);
    
    updatedLocations[activeTab] = oldStops.filter((loc) => loc !== location);
    
    // Recalculate fares array
    const newStops = updatedLocations[activeTab];
    const newFares = new Array(calculateFareArraySize(newStops.length)).fill(0);
    
    // Copy relevant fares to new array
    for (let to = 1; to < newStops.length; to++) {
      for (let from = 0; from < to; from++) {
        const oldTo = to + (to >= removeIndex ? 1 : 0);
        const oldFrom = from + (from >= removeIndex ? 1 : 0);
        const newIndex = getFareIndex(from, to, newStops.length);
        const oldIndex = getFareIndex(oldFrom, oldTo, oldStops.length);
        if (oldIndex !== -1 && newIndex !== -1) {
          newFares[newIndex] = fares[activeTab][oldIndex];
        }
      }
    }

    setEditableLocations(updatedLocations);
    setFares(prev => ({
      ...prev,
      [activeTab]: newFares
    }));
  }

  const handleSaveLocations = () => {
    setMatrix({ ...matrix, locations: editableLocations });
    setIsEditingLocations(false);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-6">Fare Matrix: {matrix.route}</h1>

        <div className="mb-4 flex space-x-2">
          {busTypes.map((type) => (
            <Button key={type} variant={activeTab === type ? "default" : "outline"} onClick={() => setActiveTab(type)}>
              {type}
            </Button>
          ))}
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Stops for {activeTab}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isEditingLocations) {
                  handleSaveLocations()
                }
                setIsEditingLocations(!isEditingLocations)
              }}
            >
              {isEditingLocations ? <Check className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
              {isEditingLocations ? "Save" : "Edit"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {editableLocations[activeTab].map((location, index) => (
              <div
                key={location}
                className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm flex items-center"
              >
                {location}
                {isEditingLocations && (
                  <>
                    <button
                      onClick={() => handleRemoveLocation(location)}
                      className="ml-2 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="ml-1 text-muted-foreground hover:text-primary">
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setAddingAtIndex(index)}>Add stop before</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setAddingAtIndex(index + 1)}>Add stop after</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            ))}
            {isEditingLocations && (editableLocations[activeTab].length === 0 || addingAtIndex !== null) && (
              <div className="flex items-center">
                <Input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="New stop"
                  className="w-32 h-8 text-sm"
                />
                <Button variant="ghost" size="sm" onClick={() => handleAddLocation(addingAtIndex)} className="ml-1">
                  <PlusCircle className="h-4 w-4" />
                </Button>
                {addingAtIndex !== null && (
                  <Button variant="ghost" size="sm" onClick={() => setAddingAtIndex(null)} className="ml-1">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {editableLocations[activeTab].length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40 text-right">To \ From</TableHead>
                  {editableLocations[activeTab].slice(0, -1).map((location, index) => (
                    <TableHead key={location} className="w-40">
                      {location}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {editableLocations[activeTab].slice(1).map((toLocation, rowIndex) => (
                  <TableRow key={toLocation}>
                    <TableCell className="font-medium text-right">{toLocation}</TableCell>
                    {editableLocations[activeTab].slice(0, -1).map((fromLocation, colIndex) => (
                      <TableCell key={fromLocation}>
                        {colIndex <= rowIndex ? (
                          <Input
                            type="number"
                            value={getFare(colIndex, rowIndex + 1)}
                            onChange={(e) => handleFareChange(colIndex, rowIndex + 1, e.target.value)}
                            className="w-20"
                          />
                        ) : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>
    </div>
  )
}

