//import Logo from "@/components/Website/Logo";
import Navigator from "./Navigator";
import Auth from "./Auth";
import { getLoggedInUser } from "@/lib/Appwrite/api";
import { NavigationMenu } from "@radix-ui/react-navigation-menu";
import Image from "next/image";


const Navbar = async () => {
    const user =await getLoggedInUser()
    return (
      <div className='border-b-2  px-8 py-2 flex justify-between items-center sticky top-0 z-10 bg-white '>
      
          <Image src={'/PuregreenLogo.jpg'} height={40} width={40} alt='logo'/>
          <div className="hidden lg:flex">
            <Navigator />
          </div>
          <div className="hidden lg:flex">

          <Auth name= {user.name} />
          </div>
          <div className="flex lg:hidden">

          <NavigationMenu />
          </div>
      </div>
    )
  }
  
  export default Navbar;