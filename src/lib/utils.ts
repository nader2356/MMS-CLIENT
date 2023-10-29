import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatMoney(amount: number): string {
	const dtAmount = amount / 1000
	const formattedDt = dtAmount.toLocaleString('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	})

	if (formattedDt.endsWith('.00')) {
		return `${formattedDt.slice(0, -3)} DT` // Remove ".00" if present
	} else {
		return `${formattedDt} DT`
	}
}