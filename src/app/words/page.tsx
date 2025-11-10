import WordsListPage from "@/components/WordsListPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <WordsListPage />
    </Suspense>
  );
}
