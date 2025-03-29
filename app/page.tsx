import UserSignIn from "@/components/UserSignIn";
import Image from "next/image";

export default function Home() {
  return (
    <div className='flex flex-col py-12 w-1/2  max-w-4xl mx-auto'>
      <div className="justify-center mx-auto">
        <Image src={`/PuregreenLogo.jpg`} height={100} width={100} alt="logo"/>
      </div>
    <div className="mt-3">
      <h1 className='text-2xl  text-center text-neutral'>Inventory Management System</h1>
    </div>
    <div className='flex  w-full mx-auto '><UserSignIn /></div>
  </div>
  );
}
