import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MapPin, Key, Percent, ChevronDown, Send } from 'lucide-react';

export default function App() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center mix-blend-difference text-white">
        <div className="text-xl font-serif tracking-widest uppercase">June Lab</div>
        <div className="hidden md:flex space-x-8 text-xs uppercase tracking-widest font-normal">
          <a href="#hero" className="hover:text-june-pink transition-colors">Accueil</a>
          <a href="#promesse" className="hover:text-june-pink transition-colors">Notre Vision</a>
          <a href="#contact" className="hover:text-june-pink transition-colors">Contact</a>
        </div>
      </nav>

      {/* Section 1: HERO */}
      <section id="hero" ref={addToRefs} className="relative h-screen overflow-hidden flex items-center justify-center">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <div 
            className="w-full h-[120%] bg-cover bg-center grayscale-[20%] brightness-[0.7]"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop")' }}
          />
        </motion.div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-8xl text-white mb-6 leading-tight"
          >
            Votre futur <br />
            <span className="italic font-normal">commence ici</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-white/80 text-lg md:text-xl font-light mb-10 tracking-wide"
          >
            Une architecture d'exception au cœur d'un écrin de verdure.
          </motion.p>
          <motion.a 
            href="#contact"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="inline-block px-10 py-4 bg-white text-june-teal uppercase text-xs tracking-[0.2em] font-medium hover:bg-june-teal hover:text-white transition-all duration-300 shadow-xl"
          >
            Découvrir le programme
          </motion.a>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <ChevronDown size={32} />
        </div>
      </section>

      {/* Section 2: PROMESSE */}
      <section 
        id="promesse" 
        ref={addToRefs}
        className={`py-24 md:py-40 px-6 bg-june-white transition-all duration-1000 ${isVisible['promesse'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 text-center">
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-june-gray flex items-center justify-center mb-8 group-hover:bg-june-pink transition-colors duration-500">
                <MapPin className="text-june-teal" size={24} />
              </div>
              <h3 className="text-2xl mb-4">À 8 min de Paris</h3>
              <p className="text-june-teal/60 leading-relaxed max-w-[250px]">
                Une localisation stratégique alliant calme résidentiel et proximité urbaine.
              </p>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-june-gray flex items-center justify-center mb-8 group-hover:bg-june-terracotta transition-colors duration-500">
                <Key className="text-june-teal" size={24} />
              </div>
              <h3 className="text-2xl mb-4">Frais de notaire offerts</h3>
              <p className="text-june-teal/60 leading-relaxed max-w-[250px]">
                Profitez d'un avantage financier exclusif pour votre première acquisition.
              </p>
            </div>
            
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 rounded-full bg-june-gray flex items-center justify-center mb-8 group-hover:bg-june-teal group-hover:text-white transition-colors duration-500">
                <Percent className="text-june-teal group-hover:text-white" size={24} />
              </div>
              <h3 className="text-2xl mb-4">TVA réduite</h3>
              <p className="text-june-teal/60 leading-relaxed max-w-[250px]">
                Éligibilité au dispositif de TVA à 5,5% sous conditions de ressources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: FORMULAIRE */}
      <section 
        id="contact" 
        ref={addToRefs}
        className={`py-24 md:py-40 px-6 bg-june-gray transition-all duration-1000 ${isVisible['contact'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-2xl mx-auto bg-june-white p-8 md:p-16 shadow-2xl rounded-sm">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl mb-4">Recevoir la brochure</h2>
            <p className="text-june-teal/60 font-light italic">Laissez-nous vos coordonnées pour être recontacté par un conseiller.</p>
          </div>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-medium opacity-50">Nom</label>
                <input 
                  type="text" 
                  name="nom" 
                  required
                  className="w-full bg-transparent border-b border-june-teal/20 py-2 focus:border-june-teal outline-none transition-colors font-light"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-medium opacity-50">Prénom</label>
                <input 
                  type="text" 
                  name="prenom" 
                  required
                  className="w-full bg-transparent border-b border-june-teal/20 py-2 focus:border-june-teal outline-none transition-colors font-light"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-medium opacity-50">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  required
                  className="w-full bg-transparent border-b border-june-teal/20 py-2 focus:border-june-teal outline-none transition-colors font-light"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-medium opacity-50">Téléphone</label>
                <input 
                  type="tel" 
                  name="telephone" 
                  required
                  className="w-full bg-transparent border-b border-june-teal/20 py-2 focus:border-june-teal outline-none transition-colors font-light"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-medium opacity-50">Ville de résidence</label>
              <input 
                type="text" 
                name="ville" 
                className="w-full bg-transparent border-b border-june-teal/20 py-2 focus:border-june-teal outline-none transition-colors font-light"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-medium opacity-50">Typologie recherchée</label>
              <select 
                name="typologie" 
                className="w-full bg-transparent border-b border-june-teal/20 py-2 focus:border-june-teal outline-none transition-colors font-light appearance-none cursor-pointer"
              >
                <option value="studio">Studio</option>
                <option value="2p">2 Pièces</option>
                <option value="3p">3 Pièces</option>
                <option value="4p">4 Pièces</option>
                <option value="5p">5 Pièces +</option>
              </select>
            </div>

            <div className="flex items-start space-x-3 pt-4">
              <input 
                type="checkbox" 
                id="rgpd" 
                name="rgpd" 
                required
                className="mt-1 accent-june-teal"
              />
              <label htmlFor="rgpd" className="text-[10px] leading-relaxed text-june-teal/50 uppercase tracking-tight">
                J'accepte que mes données soient traitées par June Lab dans le cadre de ma recherche immobilière conformément à la politique de confidentialité.
              </label>
            </div>

            <button 
              type="submit"
              className="w-full mt-8 py-4 bg-june-teal text-white uppercase text-xs tracking-[0.3em] font-medium hover:bg-june-terracotta transition-all duration-500 flex items-center justify-center space-x-2 group"
            >
              <span>Je m'inscris</span>
              <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-june-white border-t border-june-gray text-center">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="text-lg font-serif tracking-[0.3em] uppercase mb-8">June Lab</div>
          <div className="flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-widest text-june-teal/40 mb-8">
            <a href="#" className="hover:text-june-teal transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-june-teal transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-june-teal transition-colors">Cookies</a>
          </div>
          <p className="text-[10px] text-june-teal/20 uppercase tracking-widest">
            © {new Date().getFullYear()} June Lab. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
