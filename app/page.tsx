/**
 * Watly - Aplicativo de Controle de Hidratação
 * © 2025 Erick Nunes
 * Desenvolvido com Next.js e TypeScript
 */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatarQuantidade = (quantidade: number): string => {
  if (quantidade >= 1000) {
    const litros = quantidade / 1000;
    return Number.isInteger(litros) ? `${litros} L` : `${litros.toFixed(1)} L`;
  }

  return `${quantidade} mL`;
};

export default function Home() {
  const botoesRapidos = [200, 300, 400, 500];
  const [inputValue, setInputValue] = useState("");
  const [tempoRestante, setTempoRestante] = useState("");
  const [quantidadeIngerida, setQuantidadeIngerida] = useState(0);
  const [ultimoDiaReset, setUltimoDiaReset] = useState(new Date().getDate());
  const [unidadeMedidaSelecionada, setUnidadeMedidaSelecionada] =
    useState("mL");

  const adicionarAgua = (quantidade: number, unidadeMedida: string = "mL") => {
    if (quantidade <= 0 || isNaN(quantidade)) {
      console.log("Quantidade não permitida");
      return;
    }

    let quantidadeEmMl = quantidade;
    if (unidadeMedida === "L") {
      quantidadeEmMl = quantidade * 1000;
    }

    setQuantidadeIngerida((prev) => prev + quantidadeEmMl);
    setInputValue("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setInputValue(valor);
  };

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("watly-data");
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      setQuantidadeIngerida(dados.quantidadeIngerida || 0);
      setUltimoDiaReset(dados.ultimoDiaReset || new Date().getDate());
    }
  }, []);

  useEffect(() => {
    const dados = {
      quantidadeIngerida: quantidadeIngerida,
      ultimoDiaReset: ultimoDiaReset,
    };
    localStorage.setItem("watly-data", JSON.stringify(dados));
  }, [quantidadeIngerida, ultimoDiaReset]);

  useEffect(() => {
    const verificarReset = () => {
      const hoje = new Date().getDate();
      if (hoje !== ultimoDiaReset) {
        setQuantidadeIngerida(0);
        setUltimoDiaReset(hoje);
        console.log("Resetando quantidade ingerida");
      }
    };

    verificarReset();
    const intervalo = setInterval(verificarReset, 60000);
    return () => clearInterval(intervalo);
  }, [ultimoDiaReset]);

  useEffect(() => {
    const atualizarTempo = () => {
      const agora = new Date();
      const fimdoDia = new Date();
      fimdoDia.setHours(23, 59, 59, 999);

      const diferenca = fimdoDia.getTime() - agora.getTime();
      if (diferenca > 0) {
        const horas = Math.floor(diferenca / (1000 * 60 * 60));
        const minutos = Math.floor(
          (diferenca % (1000 * 60 * 60)) / (1000 * 60),
        );
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

        const horasFormatadas = horas.toString().padStart(2, "0");
        const minutosFormatados = minutos.toString().padStart(2, "0");
        const segundosFormatados = segundos.toString().padStart(2, "0");

        setTempoRestante(
          `${horasFormatadas}:${minutosFormatados}:${segundosFormatados}`,
        );
      } else {
        setTempoRestante("00:00:00");
      }
    };

    atualizarTempo();
    const intervalo = setInterval(atualizarTempo, 1000);
    return () => clearInterval(intervalo);
  }, []);

  let textoQuantidade = formatarQuantidade(quantidadeIngerida);

  return (
    <div className="h-screen flex flex-col">
      <h1 className="md:text-4xl text-3xl font-bold text-center mt-10">
        Watly
      </h1>
      <div className="flex md:flex-row flex-col justify-center items-center mt-20 gap-2 md:text-2xl text-xl font-bold">
        <p>Quantidade de água ingerida:</p>
        <p>{textoQuantidade}</p>
      </div>
      <div className="fixed inset-0 flex flex-col justify-center items-center z-10">
        <p className="md:text-2xl text-xl font-bold text-center">
          Adicionar quantidade ingerida:
        </p>
        <div className="flex justify-center items-center mt-4 gap-2 w-100 mx-auto">
          <Input
            type="number"
            placeholder="100"
            className="w-84"
            value={inputValue}
            onChange={handleInputChange}
            aria-label="Quantidade de água"
            min="0"
            step="1"
          />
          <Select
            value={unidadeMedidaSelecionada}
            onValueChange={(value) => setUnidadeMedidaSelecionada(value)}
          >
            <SelectTrigger className="w-84">
              <SelectValue placeholder="Unidade de medida" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mL">mL</SelectItem>
              <SelectItem value="L">L</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() =>
              adicionarAgua(Number(inputValue), unidadeMedidaSelecionada)
            }
          >
            <Plus />
          </Button>
          <Button
            onClick={() => {
              console.log("Resetado!!!");
              setQuantidadeIngerida(0);
              textoQuantidade = formatarQuantidade(quantidadeIngerida);
            }}
          >
            <RefreshCw />
          </Button>
        </div>
        <div className="flex justify-center items-center mt-2 gap-2 w-1/3 mx-auto">
          {botoesRapidos.map((quantidade) => (
            <Button key={quantidade} onClick={() => adicionarAgua(quantidade)}>
              {quantidade} mL
            </Button>
          ))}
        </div>
      </div>
      <footer className="flex md:flex-row flex-col justify-center gap-2 md:text-2xl text-xl font-bold fixed bottom-0 md:left-0 text-center w-full py-4">
        <div className="flex flex-col md:flex-row justify-center gap-2 w-full">
          <div className="flex md:flex-row flex-col justify-center gap-2">
            <p>Quantidade de horas para o fim do dia:</p>
            <p>{tempoRestante}</p>
          </div>
          <p className="text-xs opacity-70 md:text-sm  md:absolute md:right-4 md:bottom-2">
            © 2025 Erick Nunes
          </p>
        </div>
      </footer>
    </div>
  );
}
