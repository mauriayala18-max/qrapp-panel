import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DashboardStatSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[60px] mb-1" />
        <Skeleton className="h-3 w-[80px]" />
      </CardContent>
    </Card>
  );
}

export function TableCardSkeleton() {
  return (
    <Card className="flex flex-col items-center justify-center p-6 h-32">
      <Skeleton className="h-10 w-10 rounded-full mb-2" />
      <Skeleton className="h-5 w-16 mb-2" />
      <Skeleton className="h-4 w-20" />
    </Card>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center space-x-4 py-3">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === 0 ? 'w-[100px]' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function MenuCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-32 w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
