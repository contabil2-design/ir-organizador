"use client";

import { ChangeEvent, useMemo, useState } from "react";

type Category = {
  name: string;
  documents: string[];
};

const categories: Category[] = [
  {
    name: "Dados pessoais",
    documents: [
      "CPF",
      "Comprovante de residência",
      "Título de eleitor",
      "Recibo da declaração anterior",
    ],
  },
  {
    name: "Informe de rendimentos",
    documents: [
      "Informe da empresa",
      "Pró-labore",
      "Aposentadoria ou pensão",
      "Rendimentos de aluguel",
    ],
  },
  {
    name: "Informes bancários",
    documents: [
      "Saldo em conta corrente",
      "Saldo em poupança",
      "Informe de cartão de crédito",
      "Comprovante de empréstimos",
    ],
  },
  {
    name: "Despesas médicas",
    documents: [
      "Recibos de consultas",
      "Exames e internações",
      "Plano de saúde",
      "Despesas odontológicas",
    ],
  },
  {
    name: "Educação",
    documents: [
      "Comprovante de mensalidade escolar",
      "Cursos técnicos ou graduação",
      "Pós-graduação",
      "Educação infantil",
    ],
  },
  {
    name: "Imóveis",
    documents: [
      "Escritura ou contrato de compra e venda",
      "IPTU",
      "Comprovante de financiamento",
      "Recibos de aluguel recebido",
    ],
  },
  {
    name: "Veículos",
    documents: [
      "CRLV",
      "Comprovante de compra ou venda",
      "IPVA",
      "Financiamento do veículo",
    ],
  },
  {
    name: "Investimentos",
    documents: [
      "Informe da corretora",
      "Ações e fundos",
      "Tesouro direto",
      "Criptoativos",
    ],
  },
];

export default function ChecklistPage() {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string[]>>({});

  const totalDocuments = useMemo(
    () => categories.reduce((acc, category) => acc + category.documents.length, 0),
    []
  );

  const checkedCount = useMemo(
    () => Object.values(checkedDocs).filter(Boolean).length,
    [checkedDocs]
  );

  const toggleDocument = (docKey: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [docKey]: !prev[docKey],
    }));
  };

  const attachFiles = (docKey: string, event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const names = Array.from(selectedFiles).map((file) => file.name);

    setUploadedFiles((prev) => ({
      ...prev,
      [docKey]: [...(prev[docKey] ?? []), ...names],
    }));

    event.target.value = "";
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 text-zinc-900 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Checklist de documentos do Imposto de Renda
          </h1>
          <p className="mt-2 text-sm text-zinc-600 sm:text-base">
            Marque os itens concluídos e anexe os arquivos para manter sua declaração organizada.
          </p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${(checkedCount / totalDocuments) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-700">
            {checkedCount} de {totalDocuments} documentos concluídos
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <article
              key={category.name}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <h2 className="text-lg font-semibold text-zinc-900">{category.name}</h2>
              <ul className="mt-4 space-y-3">
                {category.documents.map((doc) => {
                  const docKey = `${category.name}-${doc}`;
                  const files = uploadedFiles[docKey] ?? [];

                  return (
                    <li
                      key={docKey}
                      className="rounded-xl border border-zinc-100 bg-zinc-50 p-3"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <label className="flex cursor-pointer items-start gap-3 text-sm sm:text-base">
                          <input
                            type="checkbox"
                            checked={Boolean(checkedDocs[docKey])}
                            onChange={() => toggleDocument(docKey)}
                            className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span>{doc}</span>
                        </label>

                        <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 sm:w-auto">
                          Anexar arquivos
                          <input
                            type="file"
                            multiple
                            onChange={(event) => attachFiles(docKey, event)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {files.length > 0 && (
                        <p className="mt-2 text-xs text-zinc-600 sm:text-sm">
                          Arquivos anexados: {files.join(", ")}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
