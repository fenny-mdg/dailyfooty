import { cn } from "@/lib/utils.ts";

export const Container = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <main className="relative min-h-screen flex py-8">
    <div className="flex w-full justify-center">
      <div
        className={cn(
          "w-full  lg:w-[80%] flex  flex-col lg:flex-row gap-8 px-4 lg:px-0",
          className,
        )}
        {...props}
      />
    </div>
  </main>
);
