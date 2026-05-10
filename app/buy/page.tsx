import { Suspense } from "react";
import { Marketplace } from "@/components/Marketplace";
import { getActiveCarMakes } from "@/lib/car-makes";
import { getPublishedVehicles } from "@/lib/vehicles";

export const revalidate = 60;

export default async function BuyPage() {
  const [vehicles, makes] = await Promise.all([
    getPublishedVehicles(),
    getActiveCarMakes()
  ]);

  return (
    <Suspense fallback={null}>
      <Marketplace
        vehicles={vehicles}
        makeOptions={makes.map((make) => make.name)}
      />
    </Suspense>
  );
}
