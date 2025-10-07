"use client"
import { NAV_ITEMS } from "@/lib/constants"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SearchCommand from "./SearchCommand"

type Stock = {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
};

const Navitems = ({initialStocks}: { initialStocks: Stock[]})  => {
  const pathname = usePathname()

  const isActive = (path:string) => {
    if(path === '/' )  return pathname === '/';

    return pathname.startsWith(path);
  }
  return (
    <ul className="flex flex-col sm:flex-row p-2 gap-3 sm:gap-10 font-medium">
        {NAV_ITEMS.map(({ href, label }) => {
            if(href === '/search') return (
                <li key="search-trigger">
                    <SearchCommand
                        renderAs="text"
                        label="Search"
                        initialStocks={initialStocks}
                    />
                </li>
            )

            return <li key={href}>
                <Link href={href} className={`nav-item ${
                    isActive(href) ? 'nav-item-active' : ''
                }`}>
                    {label}
                </Link>
            </li>
        })}
    </ul>
  )
}

export default Navitems