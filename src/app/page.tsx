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
  const [autoLoadTriggered, setAutoLoadTriggered] = useState(false);

  const loadData = async (pageNumber = 1, search = '') => {
    if ((!hasMore && pageNumber !== 1) || hasError) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/get-words?page=${pageNumber}&search=${encodeURIComponent(search)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await res.json();

      if (res.ok) {
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

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      setAutoLoadTriggered(false); // reset ao fazer nova busca
      loadData(1, searchWord);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchWord]);

  useEffect(() => {
    if (page === 1) return;
    loadData(page, searchWord);
  }, [page]);

  // Scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;

      if (
        scrollTop + windowHeight >= fullHeight - 100 &&
        !loading &&
        hasMore &&
        !hasError
      ) {
        setAutoLoadTriggered(true);
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, hasError]);

  const handleRedirect = async () => {
    window.location.href = '/login';
  }

  return (
    <div className={`
      bg-[url('/images/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed bg-black/50 bg-blend-overlay
      flex flex-col items-center min-h-screen p-8 text-white`
    }>
      <div className="w-full mb-8 md:flex md:flex-row-reverse md:items-center md:justify-between">
        <div className="flex md:w-48 justify-end mb-8 md:mb-0">
          <button 
          onClick={handleRedirect}
          className="bg-sky-700 text-white p-3 rounded-lg font-semibold hover:cursor-pointer hover:bg-zinc-400 transition">
            Fazer Login
          </button>
        </div>

        {/* Título centralizado em todas as telas */}
        <div className='w-full flex justify-center md:pl-32'>
          <h1 className="text-4xl font-bold text-center">O GLOSSÁRIO</h1>
        </div>
      </div>


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

        {!loading && hasMore && !autoLoadTriggered && (
          <div className='flex justify-center items-center mt-2'>
            <button
              onClick={() => {
                setAutoLoadTriggered(true);
                setPage((prev) => prev + 1);
              }}
              className='w-80 bg-zinc-400 p-3 text-xl font-bold rounded-md cursor-pointer hover:bg-zinc-500'
            >
              Carregar mais
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
