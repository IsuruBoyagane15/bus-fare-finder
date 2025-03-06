"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
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

const sampleRoutes = [
  { id: 1, number: "001", name: "Colombo - Kandy", lastUpdated: "2023-05-15" },
  { id: 2, number: "002", name: "Colombo - Galle", lastUpdated: "2023-05-14" },
  { id: 3, number: "003", name: "Kandy - Nuwara Eliya", lastUpdated: "2023-05-13" },
  { id: 4, number: "004", name: "Colombo - Jaffna", lastUpdated: "2023-05-12" },
  { id: 5, number: "005", name: "Galle - Matara", lastUpdated: "2023-05-11" },
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [newRouteNumber, setNewRouteNumber] = useState("")
  const [newRouteName, setNewRouteName] = useState("")
  const router = useRouter()

  const filteredRoutes = sampleRoutes.filter(
    (route) => route.name.toLowerCase().includes(searchTerm.toLowerCase()) || route.number.includes(searchTerm),
  )

  const handleAddNewRoute = () => {
    // In a real application, you would add the new route to your database here
    console.log("Adding new route:", { number: newRouteNumber, name: newRouteName })

    // Navigate to the new route page
    router.push(`/admin/route/new?number=${newRouteNumber}&name=${encodeURIComponent(newRouteName)}`)
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
        <Dialog>
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
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddNewRoute}>
                Add Route
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
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRoutes.map((route) => (
            <TableRow key={route.id}>
              <TableCell>{route.number}</TableCell>
              <TableCell>{route.name}</TableCell>
              <TableCell>{route.lastUpdated}</TableCell>
              <TableCell>
                <Link href={`/admin/route/${route.id}`} passHref>
                  <Button variant="outline" size="sm">
                    View Route
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

