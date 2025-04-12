//import Logo from "@/components/Website/Logo";
import Navigator from "./Navigator";
import Auth from "./Auth";
import { getLoggedInUser, LogOutUser } from "@/lib/Appwrite/api";
import Image from "next/image";
import { NavigationMenu } from "./NavigationMenu";


const Navbar = async () => {
    const user =await getLoggedInUser()
  
      
  
    return (
      <div className='border-b-2  px-8 py-2 flex justify-between items-center sticky top-0 z-10 bg-white '>
      
          <Image src={'/PuregreenLogo.jpg'} height={40} width={40} alt='logo'/>
          <div className="hidden lg:flex">
            <Navigator />
          </div>
          <div className="hidden lg:flex items-center space-x-3">

          <Auth name= {user.name} />
          <NavigationMenu />
          </div>
         
          

      </div>
    )
  }
  
  export default Navbar;