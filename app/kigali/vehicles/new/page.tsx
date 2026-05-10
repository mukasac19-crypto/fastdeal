"use client";

import Link from "next/link";
import { emptyVehicle, VehicleForm } from "@/components/admin/VehicleForm";

export default function NewVehiclePage() {
  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <p className="admin-breadcrumb">
            <Link href="/kigali/vehicles">Vehicles</Link> / new
          </p>
          <h1>New vehicle</h1>
        </div>
      </div>
      <VehicleForm initial={emptyVehicle} />
    </div>
  );
}
