"use client";

import { Box, Lock, Search, Settings, Sparkles, AppWindowIcon, Code } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function Domains() {
  return (
    <section className="w-full px-4 md:px-8 lg:px-16 xl:px-20 py-8">
      <h2 className="text-center text-3xl md:text-4xl font-bold mb-6 text-foreground dark:text-white">
        Our Domains
      </h2>
      <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
        <GridItem
          area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
          icon={<Box className="h-5 w-5 text-primary" />}
          title="Web Development"
          description="Web development refers to the creating, building, and maintaining of websites. It includes aspects such as web design, web publishing, web programming, and database management."
        />
        <GridItem
          area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
          icon={<AppWindowIcon className="h-5 w-5 text-primary" />}
          title="App Development"
          description="Android app development involves creating applications that run on devices powered by the Android operating system."
        />
        <GridItem
          area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
          icon={<Code className="h-5 w-5 text-primary" />}
          title="C/C++"
          description="C is a general-purpose programming language."
        />
        <GridItem
          area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
          icon={<Sparkles className="h-5 w-5 text-primary" />}
          title="AI/ML"
          description="Artificial Intelligence (AI) and Machine Learning (ML) are two closely related but distinct fields within the broader domain of computer science."
        />
        <GridItem
          area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
          icon={<Code className="h-5 w-5 text-primary" />}
          title="DSA"
          description="Data Structures and Algorithms (DSA) is a fundamental part of Computer Science that teaches you how to think and solve complex problems systematically."
        />
      </ul>
    </section>
  );
}

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-xl border border-border p-4 md:p-6 bg-background shadow-md dark:shadow-lg">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border bg-muted p-2 dark:bg-gray-800">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground dark:text-white">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
