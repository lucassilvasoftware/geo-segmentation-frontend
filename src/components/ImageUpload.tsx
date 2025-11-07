import { Upload, X } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const ImageUpload = ({ onFileSelect, selectedFile, onClear }: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const tifFile = files.find(f => f.name.toLowerCase().endsWith('.tif') || f.name.toLowerCase().endsWith('.tiff'));
    
    if (tifFile) {
      onFileSelect(tifFile);
      toast.success("GeoTIFF carregado com sucesso!");
    } else {
      toast.error("Por favor, selecione um arquivo .tif ou .tiff");
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.toLowerCase().endsWith('.tif') || file.name.toLowerCase().endsWith('.tiff')) {
        onFileSelect(file);
        toast.success("GeoTIFF carregado com sucesso!");
      } else {
        toast.error("Por favor, selecione um arquivo .tif ou .tiff");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".tif,.tiff"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm text-foreground mb-2">
            Arraste um arquivo GeoTIFF ou clique para selecionar
          </p>
          <p className="text-xs text-muted-foreground">
            Formatos aceitos: .tif, .tiff (até 20MB)
          </p>
        </label>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="ml-2 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
