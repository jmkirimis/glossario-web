/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import ContainerWord from "@/components/ContainerWord";

interface WordType {
  id: number;
  palavra: string;
  descricao: string;
  referencias: string[];
}

export default function SelectedWord() {
  const router = useRouter();
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

  useEffect(() => {
    loadData();
  }, [ref]);

  return (
    <div
      className={`
    bg-[url('/images/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed bg-black/50 bg-blend-overlay
    flex flex-col items-center min-h-screen py-8 px-12 text-white`}
    >
      <div className="w-full mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-sky-700 px-5 py-2 rounded-md hover:cursor-pointer hover:bg-zinc-400 transition mb-8 md:mb-0"
        >
          <span className="font-bold text-white">Voltar</span>
        </button>

        {/* Título centralizado em todas as telas */}
        <div className="w-full flex justify-center">
          <h1 className="text-4xl font-bold text-center">PALAVRA SELECIONADA</h1>
        </div>
      </div>

      {loading && (
          <div className="flex justify-center items-center gap-2 py-4">
              <p className="text-xl">Carregando</p>
              <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-700 dark:bg-gray-300 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-700 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-2 h-2 bg-gray-700 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:0.3s]"></span>
              </div>
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
