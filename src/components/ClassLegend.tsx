interface ClassLegendProps {
  classes: Array<{
    id: number;
    name: string;
    color: string;
    percentage?: number;
  }>;
}

export const ClassLegend = ({ classes }: ClassLegendProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Classes de Segmentação
      </h3>
      {classes.map((cls) => (
        <div key={cls.id} className="flex items-center gap-3 group">
          <div
            className="w-4 h-4 rounded flex-shrink-0 border border-border/50"
            style={{ backgroundColor: cls.color }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground group-hover:text-primary transition-colors">
              {cls.name}
            </p>
            {cls.percentage !== undefined && (
              <p className="text-xs text-muted-foreground">
                {cls.percentage.toFixed(1)}% da área
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
