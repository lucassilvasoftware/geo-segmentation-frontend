import { NavLink } from "@/components/NavLink";
import { ArrowLeft, Satellite, Brain, Database, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-darker via-background to-surface-dark">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header with back button */}
        <div className="mb-8">
          <NavLink
            to="/"
            className="inline-flex items-center gap-2 text-geo-blue hover:text-geo-green transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para o aplicativo
          </NavLink>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-geo-blue via-geo-green to-geo-orange bg-clip-text text-transparent">
            Segmentação Semântica de Imagens Aéreas
          </h1>
          <p className="text-xl text-muted-foreground">
            Análise inteligente de imagens de sensoriamento remoto com resolução
            de 30cm
          </p>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* About the project */}
          <Card className="border-border/50 bg-surface-dark/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Satellite className="w-6 h-6 text-geo-blue" />
                Sobre o Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Este sistema utiliza técnicas avançadas de visão computacional e
                aprendizado profundo para realizar a segmentação semântica
                automática de imagens aéreas de alta resolução (30cm).
              </p>
              <p>
                A aplicação foi desenvolvida especificamente para processar
                imagens no formato GeoTIFF, amplamente utilizado em
                sensoriamento remoto e sistemas de informação geográfica (SIG).
              </p>
            </CardContent>
          </Card>

          {/* Technical features */}
          <Card className="border-border/50 bg-surface-dark/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-geo-green" />
                Recursos Técnicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4 text-geo-orange" />
                    Processamento Rápido
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Backend otimizado com Lovable Cloud para processar imagens
                    de grande porte com eficiência
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <Database className="w-4 h-4 text-geo-blue" />
                    Suporte a GeoTIFF
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Processamento nativo de arquivos .tif e .tiff com metadados
                    geoespaciais preservados
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">
                    8 Classes de Segmentação
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Identificação automática de diferentes tipos de cobertura do
                    solo e uso da terra
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">
                    Métricas de Precisão
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Visualização de acurácia geral, F1-Score e IoU (Intersection
                    over Union)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Use cases */}
          <Card className="border-border/50 bg-surface-dark/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Casos de Uso</CardTitle>
              <CardDescription>Aplicações práticas do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-geo-orange font-bold mt-1">•</span>
                  <span>
                    Planejamento urbano e análise de expansão de cidades
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-geo-green font-bold mt-1">•</span>
                  <span>
                    Monitoramento de mudanças no uso do solo e desmatamento
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-geo-blue font-bold mt-1">•</span>
                  <span>Agricultura de precisão e análise de cultivos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-geo-orange font-bold mt-1">•</span>
                  <span>Gestão de recursos naturais e áreas protegidas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-geo-green font-bold mt-1">•</span>
                  <span>
                    Análise de impacto ambiental e estudos de viabilidade
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Technology stack */}
          <Card className="border-border/50 bg-surface-dark/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Tecnologias Utilizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Frontend
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>React + TypeScript (Vite)</li>
                    <li>Tailwind CSS</li>
                    <li>Shadcn UI + Lucide Icons</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Backend
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>FastAPI (Python)</li>
                    <li>PyTorch (DeepLabV3+)</li>
                    <li>Segmentation Models PyTorch</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Infra & Integração
                  </h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>Railway (Deploy Docker)</li>
                    <li>Docker (python:slim)</li>
                    <li>API REST com API Key</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <NavLink
            to="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-geo-blue to-geo-green text-white font-semibold rounded-lg hover:shadow-elegant transition-all"
          >
            Começar a usar
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default About;
