"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ContainerWord from "@/components/ContainerWord";

interface WordType {
  id: number;
  palavra: string;
  descricao: string;
  referencias: string[];
}

export default function SelectedWord() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [selectedWord, setSelectedWord] = useState<WordType | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    if (!ref) return;

    setLoading(true);
    try {
      const res = await fetch(`https://ecee-api.onrender.com/api/word/${ref}`, {
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret":
            "Zm8DEVjItXxoolTzs1TK/U5bhafaWPpkX/rCQpX/PcudpXU2j3PmO9ldCe7poCWXnyVJekFG6sphAwxBIi1Jpg==",
        },
      });
      const result = await res.json();

      if (res.ok) {
        setSelectedWord(result[0]);
      } else {
        alert(result.error || "Erro ao carregar palavras.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
  }, [ref]);

  return (
    <div
      className={`
    bg-[url('/images/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed bg-black/50 bg-blend-overlay
    flex flex-col items-center min-h-screen p-8 text-white`}
    >
      <h1 className="text-4xl font-bold mb-8 text-center">
        PALAVRA SELECIONADA
      </h1>

      {loading && (
          <div className='flex justify-center'>
            <p className='text-xl'>Carregando...</p>
          </div>
        )}

      {selectedWord && (
        <Suspense fallback={<div>Carregando...</div>}>
            <ContainerWord 
                id={selectedWord.id}
                palavra={selectedWord.palavra}
                descricao={selectedWord.descricao}
                referencias={selectedWord.referencias}
            />
        </Suspense>
      )}
    </div>
  );
}
