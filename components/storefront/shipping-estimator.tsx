"use client"

import { useMemo, useState } from "react"
import { Loader2, MapPin, Truck } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/cart"

export type ShippingEstimate = {
  country: string
  region: string
  city: string
  cost: number
  currency: string
  method: string
  eta: string
}

export type ShippingEstimatorProps = {
  subtotal: number
  currency?: string
  freeShippingThreshold?: number
  onEstimate?: (estimate: ShippingEstimate | null) => void
  className?: string
}

type RegionRates = {
  label: string
  countries: { value: string; label: string; rate: number; eta: string }[]
}

const REGION_RATES: RegionRates[] = [
  {
    label: "United States",
    countries: [
      { value: "US", label: "United States", rate: 6, eta: "3–5 business days" },
    ],
  },
  {
    label: "Europe",
    countries: [
      { value: "GB", label: "United Kingdom", rate: 9, eta: "5–7 business days" },
      { value: "DE", label: "Germany", rate: 11, eta: "5–7 business days" },
      { value: "FR", label: "France", rate: 11, eta: "5–7 business days" },
    ],
  },
  {
    label: "Rest of world",
    countries: [
      { value: "CA", label: "Canada", rate: 12, eta: "6–9 business days" },
      { value: "AU", label: "Australia", rate: 15, eta: "7–10 business days" },
      { value: "JP", label: "Japan", rate: 14, eta: "7–10 business days" },
    ],
  },
]

const ALL_COUNTRIES = REGION_RATES.flatMap((region) => region.countries)

export function ShippingEstimator({
  subtotal,
  currency = "$",
  freeShippingThreshold = 50,
  onEstimate,
  className,
}: ShippingEstimatorProps) {
  const [countryValue, setCountryValue] = useState("US")
  const [region, setRegion] = useState("")
  const [city, setCity] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)
  const [estimate, setEstimate] = useState<ShippingEstimate | null>(null)

  const selectedCountry = useMemo(
    () => ALL_COUNTRIES.find((c) => c.value === countryValue),
    [countryValue],
  )

  const canCalculate = Boolean(selectedCountry && city.trim() && region.trim())

  const calculate = () => {
    if (!selectedCountry || !canCalculate) return
    setIsCalculating(true)
    // Simulate a short network delay for a realistic async feel.
    window.setTimeout(() => {
      const free = subtotal >= freeShippingThreshold
      const next: ShippingEstimate = {
        country: selectedCountry.label,
        region: region.trim(),
        city: city.trim(),
        cost: free ? 0 : selectedCountry.rate,
        currency,
        method: free ? "Free shipping" : "Standard",
        eta: free ? "3–5 business days" : selectedCountry.eta,
      }
      setEstimate(next)
      onEstimate?.(next)
      setIsCalculating(false)
    }, 450)
  }

  const inputClass =
    "h-11 w-full rounded-none border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"

  return (
    <div className={cn("border border-zinc-200 bg-white p-6 sm:p-8", className)}>
      <div className="flex items-center gap-3">
        <Truck className="h-4 w-4 text-zinc-500" />
        <h3 className="text-sm font-medium tracking-[-0.01em] text-zinc-950">
          Shipping estimator
        </h3>
      </div>
      <p className="mt-2 text-xs leading-5 text-zinc-500">
        Enter your country, region, and city to estimate shipping before you pay.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="shipping-country"
            className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-zinc-500"
          >
            Country
          </label>
          <select
            id="shipping-country"
            value={countryValue}
            onChange={(e) => {
              setCountryValue(e.target.value)
              setEstimate(null)
              onEstimate?.(null)
            }}
            className={cn(inputClass, "appearance-none")}
          >
            {REGION_RATES.map((regionGroup) => (
              <optgroup key={regionGroup.label} label={regionGroup.label}>
                {regionGroup.countries.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="shipping-region"
            className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-zinc-500"
          >
            Region / State
          </label>
          <input
            id="shipping-region"
            type="text"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value)
              setEstimate(null)
              onEstimate?.(null)
            }}
            placeholder="e.g. California"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="shipping-city"
            className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.2em] text-zinc-500"
          >
            City
          </label>
          <input
            id="shipping-city"
            type="text"
            value={city}
            onChange={(e) => {
              setCity(e.target.value)
              setEstimate(null)
              onEstimate?.(null)
            }}
            placeholder="e.g. Los Angeles"
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={calculate}
        disabled={!canCalculate || isCalculating}
        className="mt-5 flex h-11 w-full items-center justify-center gap-2 border border-zinc-950 bg-zinc-950 text-xs font-medium uppercase tracking-[0.22em] text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isCalculating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Calculating…
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4" /> Calculate shipping
          </>
        )}
      </button>

      {estimate && (
        <div className="mt-5 border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-900">{estimate.method}</p>
            <p className="text-base font-semibold text-zinc-950">
              {estimate.cost === 0 ? "Free" : formatMoney(estimate.cost, currency)}
            </p>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {estimate.method === "Free shipping"
              ? `Free shipping unlocked — you went over ${formatMoney(freeShippingThreshold, currency)}.`
              : `Estimated for ${estimate.city}, ${estimate.region} (${estimate.country}). Delivers in ${estimate.eta}.`}
          </p>
        </div>
      )}

      {!estimate && canCalculate && !isCalculating && (
        <p className="mt-4 text-xs text-zinc-400">
          {subtotal >= freeShippingThreshold
            ? `Orders over ${formatMoney(freeShippingThreshold, currency)} ship free.`
            : `Standard shipping to ${selectedCountry?.label ?? "your region"} starts at ${formatMoney(selectedCountry?.rate ?? 0, currency)}.`}
        </p>
      )}
    </div>
  )
}