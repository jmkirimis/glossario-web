// app/selected/page.tsx ou page.jsx
import SelectedWord from '@/components/SelectedWord';
import React, { Suspense } from 'react';
// supondo que aqui está seu componente client

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SelectedWord />
    </Suspense>
  );
}