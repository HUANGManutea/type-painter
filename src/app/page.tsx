import Image from 'next/image'
import HomeComponent from './components/home-component'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-5 md:p-20">
      <div className='flex flex-col'>
        <h1>Type Painter</h1>
        <h2>A chromatic typewriter with a canvas inspired by Tyree Callahan</h2>
      </div>
      <HomeComponent></HomeComponent>
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-2'>
          <h2>How to:</h2>
          <p>(Optional) Select the keyboard layout</p>
          <p>(Optional) Select the color palette</p>
          <p>Type with your keyboard or use the virtual keyboard to draw on the canvas.</p>
        </div>
        <div className='flex flex-col gap-2'>
          <h2>Informations:</h2>
          <p>This is a toy project, made after seeing a post on Facebook about a typewriter that was modified to paint instead of writing letters. (<Link href={"https://tyreecallahan.blogspot.com/2011/12/introducing-chromatic-typewriter-2012.html?m=1"}>original blogpost</Link>, artist: Tyree Callahan)</p>
          <p>This website and the author do not have any affiliation with the Facebook post, the blogpost, or the original typewriter.</p>
          <p>The keyboard events are filtered to draw on the canvas, the accepted keys are only the letters (no special character) and the arrow keys.</p>
          <p>In the original palette, I tried to reproduce the colors on the original typewriter, but as I have reduced the number of keys, it is not an exact match.</p>
           <Link className='flex flex-row' href={"https://github.com/HUANGManutea/type-painter"}><FontAwesomeIcon icon={faGithub} width={16} height={16} /> Github source code</Link>
        </div>
      </div>
    </main>
  )
}
