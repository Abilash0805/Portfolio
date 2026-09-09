import { Stage } from "@/components/Stage";
import { Marquee } from "@/components/ui/Marquee";
import { MobileNav } from "@/components/ui/MobileNav";
import { Nav } from "@/components/ui/Nav";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { Hero } from "@/sections/Hero";
import { Projects } from "@/sections/Projects";
import { Skills } from "@/sections/Skills";
import { MARQUEE } from "@/data/work";

export default function Page() {
  return (
    <>
      <Stage />
      <Nav />
      <MobileNav />

      <main className="relative z-10">
        {/* The scroll range the camera path is measured against. */}
        <div id="journey">
          <Hero />
          <About />
          <Marquee items={MARQUEE} />
          <Skills />
          <Projects />
        </div>
        <Contact />
      </main>
    </>
  );
}
