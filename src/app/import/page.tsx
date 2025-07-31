"use client";
import { useState, useRef } from "react";

export default function ImportPage() {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importErrors, setImportErrors] = useState<
    { palavra: string; erro: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleImport = async () => {
    if (!file) {
      alert("Por favor, selecione um arquivo para importar.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("arquivo", file);

    try {
      const res = await fetch("/api/import-words", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        let msg = `Importação concluída.\nPalavras importadas: ${data.palavras_importadas}`;
        if (data.palavras_com_erro > 0) {
          msg += `\nPalavras com erro: ${data.palavras_com_erro}`;
          setImportErrors(data.erros);
        } else {
          setImportErrors([]);
        }
        alert(msg);
      } else {
        alert(data.message || data.error || "Erro ao importar palavras.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-[url('/images/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed bg-black/50 bg-blend-overlay flex flex-col items-center min-h-screen p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">IMPORTAR PALAVRAS</h1>

      <div className="bg-white flex flex-col text-zinc-400 rounded-md w-full max-w-1/2 p-5 gap-4 shadow-lg">
        {/* Campo customizado de input de arquivo */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={file?.name || ""}
            placeholder="Nenhum arquivo selecionado"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-600"
          />
          <button
            type="button"
            onClick={handleChooseFileClick}
            className="px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-800 transition"
          >
            Escolher
          </button>
          <input
            type="file"
            accept=".docx"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <button
          onClick={handleImport}
          className="bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2 px-4 rounded w-40 transition"
        >
          {loading ? "Importando..." : "Importar"}
        </button>

        <div className="bg-sky-200 w-full p-3 items-center justify-center rounded-lg text-zinc-600">
          <h2 className="text-center font-bold text-lg mb-4">Instruções para Importação</h2>
          <ul className="list-disc ml-5">
            <li>O arquivo deve estar no formato <strong>.docx</strong>.</li>
            <li>O arquivo deve conter uma lista de palavras, com <strong>uma palavra por linha</strong>.</li>
            <li>Cada linha deve seguir a seguinte estrutura: <strong>nome, separador e descrição</strong>.</li>
            <li>As referências devem estar no final da palavra, sempre precedidas da palavra <strong>Vide</strong>.</li>
            <li><strong>Exemplo de formatação: </strong> <br /> <strong>Assim seja</strong> - Assim seja é “que ainda seja feito”, está no futuro, 
              está ainda para ser feito. Portanto, “assim seja”, não é a tradução da palavra amém, 
              que é aquilo que está no agora e é o que já aconteceu. Vide Amém</li>
          </ul>
        </div>

        {importErrors.length > 0 && (
          <div className="mt-4 text-red-600 max-h-60 overflow-y-auto bg-red-100 p-3 rounded text-sm">
            <h2 className="font-bold mb-2">Erros na importação:</h2>
            <ul className="list-disc ml-5">
              {importErrors.map((err, index) => (
                <li key={index}>
                  <strong>{err.palavra}:</strong>{" "}
                  {typeof err.erro === "string"
                    ? err.erro
                    : JSON.stringify(err.erro)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
