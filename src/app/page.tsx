import { Stage } from "@/components/Stage";
import { Nav } from "@/components/ui/Nav";
import { About } from "@/sections/About";
import { Contact } from "@/sections/Contact";
import { Hero } from "@/sections/Hero";
import { Projects } from "@/sections/Projects";
import { Skills } from "@/sections/Skills";

export default function Page() {
  return (
    <>
      <Stage />
      <Nav />

      <main className="relative z-10">
        {/* The scroll range the camera path is measured against. */}
        <div id="journey">
          <Hero />
          <About />
          <Skills />
          <Projects />
        </div>
        <Contact />
      </main>
    </>
  );
}
