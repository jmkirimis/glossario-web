"use client";
import { useState } from "react";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userName || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://ecee-api.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, password }),
      });

      const result = await res.json();

      if (res.ok) {
        await Cookies.set('token', result.access_token);
        window.location.href = "/import"; // Redireciona para a página de palavras após o login
      } else {
        alert(result.error || "Erro ao fazer login. Verifique se o usuário e senha estão corretos.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro na comunicação com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`
      bg-[url('/images/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed bg-black/50 bg-blend-overlay
      flex flex-col items-center justify-center min-h-screen p-8 text-white`}
    >
      <div className="w-full md:w-2/3 lg:w-1/2 p-8 bg-white flex flex-col rounded-lg items-center justify-center">
        <img src={"/images/Glossário ECEE.png"} className="w-36 mb-8" alt="Logo" />
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Digite o usuário"
          className="p-2 w-full text-lg mb-4 bg-white text-black rounded-md border border-zinc-300"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha"
          className="p-2 w-full text-lg mb-4 bg-white text-black rounded-md border border-zinc-300"
        />
        <button className="bg-sky-700 p-2 w-full font-semibold hover:bg-zinc-400 transition" onClick={handleLogin}>{loading ? "Carregando..." : "Entrar"}</button>
      </div>
    </div>
  );
}
