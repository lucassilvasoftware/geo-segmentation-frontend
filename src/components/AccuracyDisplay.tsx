import { Progress } from "@/components/ui/progress";

interface AccuracyDisplayProps {
  accuracy: number;
  f1Score?: number;
  iou?: number;
}

export const AccuracyDisplay = ({ accuracy, f1Score, iou }: AccuracyDisplayProps) => {
  const metrics = [
    { label: "Acurácia Geral", value: accuracy, color: "bg-primary" },
    ...(f1Score ? [{ label: "F1-Score", value: f1Score, color: "bg-secondary" }] : []),
    ...(iou ? [{ label: "IoU Médio", value: iou, color: "bg-accent" }] : []),
  ];

  return (
    <div className="space-y-4 p-4 bg-card/50 rounded-lg border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Métricas do Modelo
      </h3>
      {metrics.map((metric) => (
        <div key={metric.label} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{metric.label}</span>
            <span className="font-semibold text-foreground">
              {(metric.value * 100).toFixed(1)}%
            </span>
          </div>
          <Progress value={metric.value * 100} className="h-2" />
        </div>
      ))}
    </div>
  );
};
