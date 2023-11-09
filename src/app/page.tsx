import Image from 'next/image'
import HomeComponent from './components/home-component'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-10">
      <div className='flex flex-col'>
        <h1>Type Painter</h1>
      </div>
      <HomeComponent></HomeComponent>
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col'>
          <h2>How to:</h2>
          <p>(Optional) Select the keyboard layout</p>
          <p>(Optional) Select the color palette</p>
          <p>Type with your keyboard or use the virtual keyboard to draw on the canvas.</p>
        </div>
        <div className='flex flex-col'>
          <h2>Informations:</h2>
          <p>This is a toy project, made after seeing a post on Facebook about a typewriter that was modified to paint instead of writing letters.</p>
          <p>This website and the author do not have any affiliation with the Facebook post or the original typewriter.</p>
          <p>The keyboard events are filtered to draw on the canvas, the accepted keys are only the letters (no special character) and the arrow keys.</p>
        </div>
      </div>
    </main>
  )
}
