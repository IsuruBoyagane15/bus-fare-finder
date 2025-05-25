import { NextResponse } from "next/server"
import { BusType } from "@/lib/types"

interface RouteResult {
  id: number;
  route: string;
  [BusType.SUPER_LUXURY]?: number;
  [BusType.LUXURY]?: number;
  [BusType.SEMI_LUXURY]?: number;
  [BusType.NORMAL]?: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startingCity = searchParams.get("startingCity")
  const endingCity = searchParams.get("endingCity")
  const busRoute = searchParams.get("busRoute")
  const busTypes = searchParams.get("busTypes")?.split(",") as BusType[] || []

  // Simulate a database search
  const routes: RouteResult[] = [
    { id: 1, route: "Colombo - Kandy", [BusType.LUXURY]: 1000, [BusType.SEMI_LUXURY]: 800, [BusType.NORMAL]: 1500 },
    { id: 2, route: "Colombo - Galle", [BusType.SUPER_LUXURY]: 800, [BusType.SEMI_LUXURY]: 600, [BusType.NORMAL]: 1200 },
    { id: 3, route: "Kandy - Nuwara Eliya", [BusType.SUPER_LUXURY]: 600, [BusType.LUXURY]: 500, [BusType.NORMAL]: 800 },
    { id: 4, route: "Colombo - Jaffna", [BusType.LUXURY]: 2000, [BusType.SEMI_LUXURY]: 1800, [BusType.NORMAL]: 2800 },
    { id: 5, route: "Galle - Matara", [BusType.LUXURY]: 300, [BusType.SEMI_LUXURY]: 250, [BusType.NORMAL]: 400 },
  ]

  const results = routes.filter((route) => {
    const matchesRoute = route.route.toLowerCase().includes(`${startingCity} - ${endingCity}`.toLowerCase())
    const matchesBusRoute = !busRoute || route.route.toLowerCase().includes(busRoute.toLowerCase())
    const matchesBusTypes = busTypes.length === 0 || busTypes.some((type) => route[type] !== undefined)
    return matchesRoute && matchesBusRoute && matchesBusTypes
  })

  return NextResponse.json(results)
}

