import { Marketplace } from "@/components/Marketplace";
import { getActiveCarMakes } from "@/lib/car-makes";
import { getPublishedVehicles } from "@/lib/vehicles";

export const dynamic = "force-dynamic";

export default async function BuyPage() {
  const [vehicles, makes] = await Promise.all([
    getPublishedVehicles(),
    getActiveCarMakes()
  ]);

  return <Marketplace vehicles={vehicles} makeOptions={makes.map((make) => make.name)} />;
}
