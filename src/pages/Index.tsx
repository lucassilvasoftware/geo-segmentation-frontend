import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { ClassLegend } from "@/components/ClassLegend";
// import { AccuracyDisplay } from "@/components/AccuracyDisplay"; // Comentado por enquanto
import { ResultsViewer } from "@/components/ResultsViewer";
import { Loader2, Satellite, Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { NavLink } from "@/components/NavLink";
import {
  checkHealth,
  segmentImageFull,
  SegmentClassStat,
} from "@/services/segmentService";
import { Alert, AlertDescription } from "@/components/ui/alert";

const API_URL_DISPLAY =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Cores alinhadas com o backend
const CLASS_COLOR_MAP: Record<number, string> = {
  0: "#ff0000", // Urbano
  1: "#267300", // Vegetação Densa
  2: "#000000", // Sombra
  3: "#85c77e", // Vegetação Esparsa
  4: "#ffff00", // Agricultura
  5: "#808080", // Rocha
  6: "#8b4513", // Solo Exposto
  7: "#5475a8", // Água
};

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTiff, setIsTiff] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const [results, setResults] = useState<{
    original: string; // URL da imagem original (quando suportada)
    segmented: string; // URL (data URL) da máscara segmentada
    stats: SegmentClassStat[];
    accuracy: number;
    f1Score: number;
    iou: number;
  } | null>(null);

  // Verifica a saúde do backend ao carregar a página
  useEffect(() => {
    const verifyBackend = async () => {
      const isHealthy = await checkHealth();
      setBackendAvailable(isHealthy);
      if (!isHealthy) {
        toast.error(
          "Serviço de segmentação indisponível. Verifique se o backend está rodando."
        );
      }
    };
    verifyBackend();
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResults(null);

    const lower = file.name.toLowerCase();
    const tiff = lower.endsWith(".tif") || lower.endsWith(".tiff");
    setIsTiff(tiff);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResults(null);
    setIsTiff(false);
  };

  const handleProcess = async () => {
    if (!selectedFile) {
      toast.error("Selecione uma imagem antes de segmentar.");
      return;
    }

    if (backendAvailable === false) {
      toast.error("O serviço de segmentação está indisponível no momento.");
      return;
    }

    setIsProcessing(true);

    try {
      // Sempre geramos uma URL para o arquivo original,
      // mas só vamos usar na UI se não for TIFF.
      const originalUrl = URL.createObjectURL(selectedFile);

      // Chama /segment-full para obter máscara + stats
      const { segmentedUrl, stats } = await segmentImageFull(selectedFile);

      setResults({
        original: originalUrl,
        segmented: segmentedUrl,
        stats,
        // Métricas mockadas por enquanto; bloco visual está comentado.
        accuracy: 0.89,
        f1Score: 0.87,
        iou: 0.82,
      });

      toast.success("Segmentação concluída com sucesso!");
    } catch (error) {
      console.error("Erro ao processar:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Não foi possível processar a imagem. ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Exportar máscara segmentada (front-only)
  const handleExport = () => {
    if (!results) {
      toast.error("Nenhum resultado para exportar.");
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = results.segmented; // data:image/png;base64,... vindo do backend
      link.download = "segmentacao_mascara.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Máscara segmentada exportada com sucesso.");
    } catch (error) {
      console.error("Erro na exportação:", error);
      toast.error("Não foi possível exportar a máscara segmentada.");
    }
  };

  // Legenda com base nas stats reais do backend
  const classesWithPercentages =
    results?.stats.map((s) => ({
      id: s.class_id,
      name: s.class_name,
      percentage: s.percent,
      color: CLASS_COLOR_MAP[s.class_id] || "#ffffff",
    })) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Satellite className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  GeoSegment AI
                </h1>
                <p className="text-xs text-muted-foreground">
                  Segmentação Semântica de Imagens Aéreas
                </p>
              </div>
            </div>
            <NavLink
              to="/sobre"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-sm"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Sobre</span>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Alerta de backend indisponível */}
        {backendAvailable === false && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              O serviço de segmentação está indisponível. Verifique se o backend
              está rodando em{" "}
              <code className="text-xs bg-background/50 px-1 py-0.5 rounded">
                {API_URL_DISPLAY}
              </code>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel esquerdo - Upload & Controles */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  1. Carregar Imagem
                </h2>
                <p className="text-sm text-muted-foreground">
                  Selecione um arquivo de imagem. Para visualização direta no
                  navegador use PNG/JPEG; arquivos GeoTIFF (.tif) serão
                  processados, mas não possuem pré-visualização nativa.
                </p>
              </div>

              <ImageUpload
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onClear={handleClear}
              />

              <Button
                onClick={handleProcess}
                disabled={!selectedFile || isProcessing}
                className="w-full gap-2"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Processar Segmentação"
                )}
              </Button>
            </div>

            {results && (
              <>
                {/* 
                  ===========================================
                  BLOCO DE PRECISÃO (AccuracyDisplay)
                  -------------------------------------------
                  Temporariamente comentado.
                  Quando o backend passar a retornar
                  métricas reais, basta descomentar.
                  ===========================================
                */}
                {/*
                <div className="bg-card rounded-lg border border-border p-6">
                  <AccuracyDisplay
                    accuracy={results.accuracy}
                    f1Score={results.f1Score}
                    iou={results.iou}
                  />
                </div>
                */}

                <div className="bg-card rounded-lg border border-border p-6">
                  <ClassLegend classes={classesWithPercentages} />
                </div>
              </>
            )}
          </div>

          {/* Painel direito - Resultados */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border border-border p-6 min-h-[600px]">
              {!results ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Satellite className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhuma segmentação disponível
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Carregue uma imagem e clique em &quot;Processar
                    Segmentação&quot; para visualizar a máscara gerada e as
                    estatísticas de uso do solo.
                  </p>
                </div>
              ) : isTiff ? (
                // Caso especial: arquivo .tif
                <div className="flex flex-col items-center text-center gap-4 py-10">
                  <p className="text-sm text-muted-foreground max-w-md">
                    A imagem original está em formato{" "}
                    <code>.tif</code>, que não é suportado diretamente
                    pelos navegadores para pré-visualização. Abaixo
                    você pode visualizar e exportar a máscara
                    segmentada gerada a partir desse arquivo.
                  </p>
                  <img
                    src={results.segmented}
                    alt="Máscara segmentada"
                    className="max-w-full max-h-[420px] rounded-lg border border-border object-contain"
                  />
                  <Button onClick={handleExport} className="mt-2">
                    Baixar máscara segmentada
                  </Button>
                </div>
              ) : (
                // Fluxo normal: formatos suportados (PNG/JPEG)
                <ResultsViewer
                  originalImage={results.original}
                  segmentedImage={results.segmented}
                  onExport={handleExport}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
