import Image from 'next/image'
import Link from 'next/link'
import banner from './assets/images/banner.png'
import Incredibles from './components/Incredibles/Incredibles'

export default function Home() {
  return (
   <main>
      <Image className='m-0' src='/banner.png' width='2000' height='1000' alt='banner'/>

      <div className='p-5 mt-10'>
        <Incredibles/>
      </div>

      <div className='p5 mt-3 '>
        <h1 className='text-black text-center pb-5'>خرید بر اساس دسته بندی</h1>
      </div>
    </main>
  )
}
