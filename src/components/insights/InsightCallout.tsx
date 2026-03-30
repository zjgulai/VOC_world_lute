import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InsightCalloutProps {
  title: string;
  summary: string;
  bullets?: string[];
  scopeNote?: string;
  badge?: string;
  icon?: ReactNode;
}

export function InsightCallout({
  title,
  summary,
  bullets = [],
  scopeNote,
  badge,
  icon,
}: InsightCalloutProps) {
  return (
    <Card className="card-shadow border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {icon}
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{summary}</p>
        {bullets.length > 0 ? (
          <div className="space-y-2">
            {bullets.map((bullet) => (
              <div key={bullet} className="flex items-start gap-2 text-sm">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">{bullet}</span>
              </div>
            ))}
          </div>
        ) : null}
        {scopeNote ? <p className="text-xs text-muted-foreground">{scopeNote}</p> : null}
      </CardContent>
    </Card>
  );
}
