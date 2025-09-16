import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import About from "./pages/about/About";
import Projects from "./pages/projects/Projects";
import Contact from "./pages/contact/Contact";
import Footer from "./components/footer/Footer";

const ME = {
  name: "Özgür Özbek",
  title: "Full Stack / React Developer",
  description:
    "I build modern, responsive websites and web applications using React, Next.js, and WordPress. Passionate about clean design, user experience, and performance. With a problem-solving mindset, I deliver fast, functional, and visually appealing results.Below, you can find the small web applications and clone projects I created for learning purposes, as well as the projects I worked on in freelance jobs. I'm excited to collaborate and create something great together!",
  email: "ozgurozbek.uk@gmail.com",
  linkedIn: "https://www.linkedin.com/in/ozgurozbekuk/",
  github: "https://github.com/ozgurozbekuk",
  heroImages: [
    "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  ],
};

function App() {
  return (
    <>
      <Router>
        <Header ME={ME} />
        <Routes>
          <Route path="/" element={<Home ME={ME} />} />
          <Route path="/about" element={<About ME={ME} />} />
          <Route path="/contact" element={<Contact ME={ME} />} />
          <Route path="/projects" element={<Projects ME={ME} />} />
        </Routes>
        <Footer ME={ME} />
      </Router>
    </>
  );
}

export default App;
