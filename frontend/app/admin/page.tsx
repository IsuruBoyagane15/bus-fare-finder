"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { BusType, BusTypeLabels, Route } from "@/lib/types"
import { routeApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth"

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [newRouteNumber, setNewRouteNumber] = useState("")
  const [newRouteName, setNewRouteName] = useState("")
  const [selectedBusTypes, setSelectedBusTypes] = useState<BusType[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }
    loadRoutes()
  }, [isAuthenticated])

  const loadRoutes = async () => {
    try {
      const data = await routeApi.getAll()
      setRoutes(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load routes",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRoutes = routes.filter(
    (route) => route.name.toLowerCase().includes(searchTerm.toLowerCase()) || route.number.includes(searchTerm),
  )

  const handleAddNewRoute = async () => {
    try {
      setIsCreating(true)
      const newRoute = await routeApi.create({
        number: newRouteNumber,
        name: newRouteName,
        busTypes: selectedBusTypes
      })

      setDialogOpen(false)
      router.push(`/admin/route/${newRoute._id}?number=${newRouteNumber}&name=${encodeURIComponent(newRouteName)}&busTypes=${selectedBusTypes.join(',')}`)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create route",
        variant: "destructive"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteRoute = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route?")) return;

    try {
      await routeApi.delete(id)
      toast({
        title: "Success",
        description: "Route deleted successfully"
      })
      loadRoutes()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete route",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4">
      <h1 className="text-3xl font-bold my-8">Admin Dashboard</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search routes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Route</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Route</DialogTitle>
              <DialogDescription>Enter the details for the new bus route.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="routeNumber" className="text-right">
                  Route Number
                </Label>
                <Input
                  id="routeNumber"
                  value={newRouteNumber}
                  onChange={(e) => setNewRouteNumber(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="routeName" className="text-right">
                  Route Name
                </Label>
                <Input
                  id="routeName"
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                  Bus Types
                </Label>
                <div className="col-span-3 space-y-2">
                  {Object.values(BusType).map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`busType-${type}`}
                        checked={selectedBusTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          setSelectedBusTypes(
                            checked 
                              ? [...selectedBusTypes, type] 
                              : selectedBusTypes.filter((t) => t !== type)
                          )
                        }}
                      />
                      <Label htmlFor={`busType-${type}`}>{BusTypeLabels[type]}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleAddNewRoute}
                disabled={isCreating || !newRouteNumber || !newRouteName || selectedBusTypes.length === 0}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Add Route'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Route Number</TableHead>
            <TableHead>Route Name</TableHead>
            <TableHead>Bus Types</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRoutes.map((route) => (
            <TableRow key={route._id}>
              <TableCell>{route.number}</TableCell>
              <TableCell>{route.name}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {route.busTypes.map((type) => (
                    <span key={type} className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                      {BusTypeLabels[type]}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>{new Date(route.lastUpdated).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/admin/route/${route._id}`} passHref>
                    <Button variant="outline" size="sm">
                      View Route
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteRoute(route._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

