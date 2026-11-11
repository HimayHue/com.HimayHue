// src/components/charts/chart-skeleton.tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { PropertyListing } from "@prisma/client";

interface PriceHistoryChartProps {
   priceHistory: PropertyListing["priceHistory"];
   lineConfig: ChartConfig;
}

export function PriceHistoryChart({ priceHistory, lineConfig }: PriceHistoryChartProps) {
   return (
      <ChartContainer config={lineConfig} className="min-h-[200px] w-full">
         <LineChart accessibilityLayer data={priceHistory}>
            <CartesianGrid vertical={false} />
            <XAxis
               dataKey="recordedAt"
               tickLine={false}
               tickMargin={10}
               axisLine={false}
               tickFormatter={(value) =>
                  new Date(value).toLocaleDateString(undefined, {
                     month: "short",
                     day: "numeric",
                  })
               }
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
               dataKey="price"
               type="monotone"
               stroke="var(--color-price)"
               fill="var(--color-price)"
               radius={4}
            />
         </LineChart>
      </ChartContainer>
   )
}



export function PriceHistoryChartSkeleton() {
   return (
      <div className="flex flex-col gap-4 w-full p-4 border rounded-xl">
         {/* Main Chart Canvas Area */}
         <Skeleton className="min-h-[200px] w-full rounded-lg" />

         {/* Horizontal Axis Ticks Placeholder */}
         <div className="flex justify-between px-2 pt-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-12" />
         </div>
      </div>
   );
}