"use client"
import { useEffect, useState } from 'react';
import ContainerWord from '@/components/ContainerWord';

interface WordType {
  id: number;
  palavra: string;
  descricao: string;
  referencias: string[];
}

export default function WordsListPage() {
  const [filteredWords, setFilteredWords] = useState<WordType[]>([]);
  const [searchWord, setSearchWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadData = async (pageNumber = 1, search = '') => {
    if ((!hasMore && pageNumber !== 1) || hasError) return;
    setLoading(true);


    try {
      const res = await fetch(
        `https://ecee-api.onrender.com/api/words?page=${pageNumber}&limit=20&search=${search}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Secret': `Zm8DEVjItXxoolTzs1TK/U5bhafaWPpkX/rCQpX/PcudpXU2j3PmO9ldCe7poCWXnyVJekFG6sphAwxBIi1Jpg==`,
          },
        }
      );
      const result = await res.json();

      if (res.ok) {
        console.log("Carregou", result)
        setHasError(false);
        if (pageNumber === 1) {
          setFilteredWords(result);
        } else {
          setFilteredWords((prev) => [...prev, ...result]);
        }
        if (result.length < 20) setHasMore(false);
      } else {
        setHasError(true);
        alert(result.error || 'Erro ao carregar palavras.');
      }
    } catch (err) {
      console.error(err);
      setHasError(true);
      alert('Erro na comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      loadData(1, searchWord);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchWord]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (page === 1) return;
    loadData(page, searchWord);
  }, [page]);

  return (
    <div className={`
      bg-[url('/images/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed bg-black/50 bg-blend-overlay
      flex flex-col items-center min-h-screen p-8 text-white`
      }>
      
      <h1 className='text-4xl font-bold mb-8'>GLOSSÁRIO</h1>
      
      <input
        type="text"
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
        placeholder="Pesquisar palavra"
        className='p-2 w-full text-lg mb-4 bg-white text-black rounded-md'
      />

      <div className='flex flex-col gap-4'>
        {filteredWords.map((item) => (
          <ContainerWord 
            key={item.id}
            id={item.id}
            palavra={item.palavra}
            descricao={item.descricao}
            referencias={item.referencias}
          />
        ))}

        {loading && (
          <div className='flex justify-center'>
            <p className='text-xl'>Carregando...</p>
          </div>
        )}
        
        {!loading && hasMore && (
          <div className='flex justify-center items-center mt-2'>
            <button onClick={() => setPage((prev) => prev + 1)} className='w-80 bg-zinc-400 p-3 text-xl font-bold rounded-md cursor-pointer hover:bg-zinc-500'>
              Carregar mais
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
