import Image from "next/image"
import Link from "next/link"
import Navitems from "./Navitems"
import UserDropDown from "./userDropDown"

const Header = ({user}: {user: User}) => {
  return (
    <header className="sticky top-0 header">
        <div className="container header-wrapper">
         <Link href="/" className="flex items-center group">
                 <div className="flex items-center space-x-3">
                     <Image 
                         src="/assets/icons/logo.svg" 
                         alt="Stoxie icon" 
                         width={32} 
                         height={32} 
                         className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
                     />
                     <span className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                         Stoxie
                     </span>
                 </div>
             </Link>
            <nav className="hidden sm:block">
            <Navitems/>
            </nav>
            <UserDropDown user={user} />
        </div>
    </header>
  )
}

export default Header