import { Download, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResultsViewerProps {
  originalImage: string;
  segmentedImage: string;
  onExport: () => void;
}

export const ResultsViewer = ({ originalImage, segmentedImage, onExport }: ResultsViewerProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Resultado da Segmentação
        </h3>
        <Button onClick={onExport} size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </Button>
      </div>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison">Comparação</TabsTrigger>
          <TabsTrigger value="original">Original</TabsTrigger>
          <TabsTrigger value="segmented">Segmentado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comparison" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Original</p>
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border border-border">
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Segmentado</p>
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden border border-border">
                <img 
                  src={segmentedImage} 
                  alt="Segmentado" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="original" className="mt-4">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border">
            <img 
              src={originalImage} 
              alt="Imagem Original" 
              className="w-full h-full object-contain"
            />
          </div>
        </TabsContent>

        <TabsContent value="segmented" className="mt-4">
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border">
            <img 
              src={segmentedImage} 
              alt="Imagem Segmentada" 
              className="w-full h-full object-contain"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
