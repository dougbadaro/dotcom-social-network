'use client'

import Image from 'next/image';
import background from '../assets/background-home.png';
import timeLineImage from '../assets/timeline-image-home.svg';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="h-full grid grid-cols-2">
      <div style={{backgroundImage: `url(${background.src})`}} className='bg-no-repeat bg-cover bg-center flex flex-col space-y-16 text-center justify-center p-32'>
        <div>
          <h1 className='text-8xl font-black'>.com</h1>
          <h5 className='text-xs tracking-wider'>Conectando Memórias Ponto a Ponto</h5>
        </div>
        <h3 className='text-5xl font-black'>Em cada interação, um ponto na trama de memórias compartilhadas se revela.</h3>
      </div>
      <div className='relative'>
        <div className='absolute w-full h-full flex flex-col justify-center items-center'>
          <div className='font-black text-4xl'>
            <p>Conecte-se,</p>
            <p>Crie Memórias,</p>
            <p>Faça Parte.</p>
            <Link href='/auth'>
              <Button className='w-full mt-8 font-black text-xl'>Entrar</Button>
            </Link>
          </div>
        </div>
        <div className="absolute h-full">
          <Image
            src={timeLineImage}
            alt='timeLineImage'
            objectFit='cover'
            className="w-full h-full"
          />
        </div>
      </div>
      <p className='fixed p-6 right-0 bottom-0 text-xs text-muted-foreground'>by <a href="">@dougbadaro</a></p>
    </main>
  );
}
