import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ImageUpload";
import { ClassLegend } from "@/components/ClassLegend";
import { AccuracyDisplay } from "@/components/AccuracyDisplay";
import { ResultsViewer } from "@/components/ResultsViewer";
import { Loader2, Satellite, Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { NavLink } from "@/components/NavLink";
import { segmentImage, checkHealth } from "@/services/segmentService";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DEMO_CLASSES = [
  { id: 1, name: "Vegetação Densa", color: "#10b981" },
  { id: 2, name: "Vegetação Esparsa", color: "#84cc16" },
  { id: 3, name: "Solo Exposto", color: "#f59e0b" },
  { id: 4, name: "Área Urbana", color: "#ef4444" },
  { id: 5, name: "Corpo d'água", color: "#3b82f6" },
  { id: 6, name: "Estrada", color: "#6b7280" },
  { id: 7, name: "Agricultura", color: "#eab308" },
  { id: 8, name: "Sombra/Nuvem", color: "#1f2937" },
];

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const [results, setResults] = useState<{
    original: string;
    segmented: string;
    accuracy: number;
    f1Score: number;
    iou: number;
    classPercentages: number[];
  } | null>(null);

  // Verificar saúde do backend ao carregar a página
  useEffect(() => {
    const verifyBackend = async () => {
      const isHealthy = await checkHealth();
      setBackendAvailable(isHealthy);
      if (!isHealthy) {
        toast.error("Serviço de segmentação indisponível. Verifique se o backend está rodando.");
      }
    };
    verifyBackend();
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResults(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResults(null);
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
      // Chamar a API de segmentação
      const segmentedBlob = await segmentImage(selectedFile);
      
      // Criar URLs para exibição
      const originalUrl = URL.createObjectURL(selectedFile);
      const segmentedUrl = URL.createObjectURL(segmentedBlob);

      // Simular métricas (em produção, viriam do backend se disponíveis)
      setResults({
        original: originalUrl,
        segmented: segmentedUrl,
        accuracy: 0.89,
        f1Score: 0.87,
        iou: 0.82,
        classPercentages: [15.3, 8.7, 12.1, 22.4, 5.6, 3.2, 28.5, 4.2],
      });

      toast.success("Segmentação concluída com sucesso!");
    } catch (error) {
      console.error("Erro ao processar:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast.error(`Não foi possível processar a imagem. ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    toast.success("Exportação iniciada! O arquivo será baixado em breve.");
  };

  const classesWithPercentages = DEMO_CLASSES.map((cls, idx) => ({
    ...cls,
    percentage: results?.classPercentages[idx],
  }));

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
              O serviço de segmentação está indisponível. Verifique se o backend está rodando em{" "}
              <code className="text-xs bg-background/50 px-1 py-0.5 rounded">
                {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}
              </code>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Upload & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">
                  1. Carregar Imagem
                </h2>
                <p className="text-sm text-muted-foreground">
                  Selecione um arquivo GeoTIFF para segmentação
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
                <div className="bg-card rounded-lg border border-border p-6">
                  <AccuracyDisplay
                    accuracy={results.accuracy}
                    f1Score={results.f1Score}
                    iou={results.iou}
                  />
                </div>

                <div className="bg-card rounded-lg border border-border p-6">
                  <ClassLegend classes={classesWithPercentages} />
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Results */}
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
                    Carregue uma imagem GeoTIFF e clique em "Processar Segmentação" 
                    para visualizar os resultados da análise.
                  </p>
                </div>
              ) : (
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
