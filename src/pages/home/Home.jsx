import  Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer"
import About from "../about/About";
import Projects from "../projects/Projects";
import Contact from "../contact/Contact";
import ChatHero from "../../components/chatai/ChatHero"






export default function Home() {
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 scroll-smooth">
      <ChatHero/>
    </div>
  );
}
