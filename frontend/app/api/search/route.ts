import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const startingCity = searchParams.get("startingCity")
  const endingCity = searchParams.get("endingCity")
  const busRoute = searchParams.get("busRoute")
  const busTypes = searchParams.get("busTypes")?.split(",") || []

  // Simulate a database search
  const routes = [
    { id: 1, route: "Colombo - Kandy", luxury: 1000, semiLuxury: 800, expressway: 1200, ac: 1500 },
    { id: 2, route: "Colombo - Galle", luxury: 800, semiLuxury: 600, expressway: 1000, ac: 1200 },
    { id: 3, route: "Kandy - Nuwara Eliya", luxury: 600, semiLuxury: 500, expressway: null, ac: 800 },
    { id: 4, route: "Colombo - Jaffna", luxury: 2000, semiLuxury: 1800, expressway: 2500, ac: 2800 },
    { id: 5, route: "Galle - Matara", luxury: 300, semiLuxury: 250, expressway: null, ac: 400 },
  ]

  const results = routes.filter((route) => {
    const matchesRoute = route.route.toLowerCase().includes(`${startingCity} - ${endingCity}`.toLowerCase())
    const matchesBusRoute = !busRoute || route.route.toLowerCase().includes(busRoute.toLowerCase())
    const matchesBusTypes = busTypes.length === 0 || busTypes.some((type) => route[type] !== null)
    return matchesRoute && matchesBusRoute && matchesBusTypes
  })

  return NextResponse.json(results)
}

