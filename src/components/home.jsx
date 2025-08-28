import  Header from "./header/Header";
import Footer from "./footer/Footer";
import About from "./about/About";
import Projects from "./projects/Projects";
import Contact from "./contact/Contact";


const ME = {
  name: "Özgür Özbek",
  title: "Full Stack / React Developer",
  description:
    "I build modern, responsive websites and web applications using React, Next.js, and WordPress. Passionate about clean design, user experience, and performance. With a problem-solving mindset, I deliver fast, functional, and visually appealing results. I'm excited to collaborate and create something great together!",
  email: "ozgurozbekuk@gmail.com",
  linkedIn: "https://www.linkedin.com/in/ozgurozbekuk/",
  github: "https://github.com/ozgurozbekuk",
  heroImages: [
    "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  ],
};


export default function PortfolioApp() {
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 scroll-smooth">
      <Header ME={ME} />
      <About ME={ME}/>
      <Projects/>
      <Contact ME={ME}/>
      

      <Footer ME={ME} />
    </div>
  );
}
