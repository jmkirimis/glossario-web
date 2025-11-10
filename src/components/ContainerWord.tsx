import { useRouter } from 'next/navigation';

interface Props {
  id: number;
  palavra: string;
  descricao: string;
  referencias: string[];
}

export default function ContainerWord(item: Props) {
    const router = useRouter();
    return (
        <div
            key={item.id}
            className='rounded-lg shadow-lg bg-white text-black p-4'
          >
            <h3 className='font-bold mb-2'>{item.palavra}</h3>
            <p>{item.descricao}</p>
            {item.referencias.length > 0 && (
              <div className='flex items-center gap-2 flex-wrap'>
                <h4>Referências:</h4>
                {item.referencias.map((ref, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(`/selected?ref=${encodeURIComponent(ref)}`)}
                    className="p-1.5 bg-zinc-300 text-blue-500 rounded-md cursor-pointer"
                  >
                    {ref}
                  </button>
                ))}
              </div>
            )}
        </div>
    );
}