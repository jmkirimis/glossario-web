"use client";
import { useState } from "react";

export default function AccountPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName.trim(),
          password: password.trim(),
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert('Usuário deletado com sucesso.');
      } else {
        alert(result.error || 'Erro ao deletar usuário.');
      }
    } catch (err) {
      console.log(err);
      alert('Não foi possível se comunicar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className={`
          bg-zinc-200 bg-cover bg-center bg-no-repeat bg-fixed bg-blend-overlay
          flex flex-col items-center min-h-screen p-8 text-zinc-800`
          }>
          
      <h1 className='text-4xl font-bold mb-4'>EXCLUIR CONTA</h1>
      <div>
        <p className='text-xl mb-6'>Para excluir sua conta, digite seu nome de usuário e senha abaixo:</p>
      </div>
      <div className="flex flex-col items-center w-1/2">
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Digite o nome de usuário"
          className='p-2 w-full text-lg mb-4 bg-white text-black rounded-md'
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha"
          className='p-2 w-full text-lg mb-4 bg-white text-black rounded-md'
        />
      </div>
      <div className='flex justify-center items-center mt-2'>
          <button onClick={handleDelete} className='w-72 bg-red-500 p-2 text-white text-xl font-bold rounded-md cursor-pointer hover:bg-zinc-500'>
            {loading ? "Carregando..." : "Excluir"}
          </button>
        </div>

      </div>
  );
}