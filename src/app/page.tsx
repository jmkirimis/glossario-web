"use client"
import { useRouter } from "next/navigation";

type LetterBoxProps = {
  letter: string;
}

const LetterBox = ({ letter }: LetterBoxProps) => {
  const router = useRouter();
  return (
    <button
      type="button" 
      className="flex items-center justify-center w-14 py-3 bg-white rounded-md hover:cursor-pointer hover:bg-zinc-400 transition"
      onClick={() => router.push("/words?letter=" + letter)}
      >
      <span className="text-[#4c4c4c] font-black text-center text-2xl">{letter}</span>
    </button>
  );
}
export default function HomePage() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("");

  return (
    <div className={`
      bg-[url('/images/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed bg-black/50 bg-blend-overlay
      flex flex-col items-center min-h-screen p-12 text-white`
    }>
      {/* Título centralizado em todas as telas */}
      <div className='w-full flex justify-center mb-8'>
        <h1 className="text-4xl font-bold text-center">O GLOSSÁRIO</h1>
      </div>

      <div className="flex  w-[90%] md:w-1/2 flex-wrap gap-3 justify-center">
        {alphabet.map((letter) => (
            <LetterBox key={letter} letter={letter} />
          ))}
      </div>
        
      
    </div>
  );
}
