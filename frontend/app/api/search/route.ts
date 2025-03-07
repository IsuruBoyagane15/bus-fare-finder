import { NextResponse } from "next/server"
import { BusType } from "@/lib/types"

interface RouteResult {
  id: number;
  route: string;
  [BusType.LUXURY]?: number;
  [BusType.SEMI_LUXURY]?: number;
  [BusType.EXPRESSWAY]?: number;
  [BusType.AC]?: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startingCity = searchParams.get("startingCity")
  const endingCity = searchParams.get("endingCity")
  const busRoute = searchParams.get("busRoute")
  const busTypes = searchParams.get("busTypes")?.split(",") as BusType[] || []

  // Simulate a database search
  const routes: RouteResult[] = [
    { id: 1, route: "Colombo - Kandy", [BusType.LUXURY]: 1000, [BusType.SEMI_LUXURY]: 800, [BusType.EXPRESSWAY]: 1200, [BusType.AC]: 1500 },
    { id: 2, route: "Colombo - Galle", [BusType.LUXURY]: 800, [BusType.SEMI_LUXURY]: 600, [BusType.EXPRESSWAY]: 1000, [BusType.AC]: 1200 },
    { id: 3, route: "Kandy - Nuwara Eliya", [BusType.LUXURY]: 600, [BusType.SEMI_LUXURY]: 500, [BusType.AC]: 800 },
    { id: 4, route: "Colombo - Jaffna", [BusType.LUXURY]: 2000, [BusType.SEMI_LUXURY]: 1800, [BusType.EXPRESSWAY]: 2500, [BusType.AC]: 2800 },
    { id: 5, route: "Galle - Matara", [BusType.LUXURY]: 300, [BusType.SEMI_LUXURY]: 250, [BusType.AC]: 400 },
  ]

  const results = routes.filter((route) => {
    const matchesRoute = route.route.toLowerCase().includes(`${startingCity} - ${endingCity}`.toLowerCase())
    const matchesBusRoute = !busRoute || route.route.toLowerCase().includes(busRoute.toLowerCase())
    const matchesBusTypes = busTypes.length === 0 || busTypes.some((type) => route[type] !== undefined)
    return matchesRoute && matchesBusRoute && matchesBusTypes
  })

  return NextResponse.json(results)
}

