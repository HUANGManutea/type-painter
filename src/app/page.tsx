import Image from 'next/image'
import HomeComponent from './components/home-component'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className='flex flex-col'>
        <h1>Type Painter</h1>
      </div>
      <HomeComponent></HomeComponent>
    </main>
  )
}
