"\"use client"

import Image from "next/image"

export function SecurityBadges() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex items-center space-x-2 rounded-md border p-2">
        <Image src="/placeholder.svg?height=24&width=24" alt="Secure" width={24} height={24} />
        <span className="text-xs text-zinc-500">Secure Transactions</span>
      </div>
      <div className="flex items-center space-x-2 rounded-md border p-2">
        <Image src="/placeholder.svg?height=24&width=24" alt="Encrypted" width={24} height={24} />
        <span className="text-xs text-zinc-500">End-to-End Encryption</span>
      </div>
    </div>
  )
}
