import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  MapPin, 
  Home, 
  CheckCircle, 
  Download, 
  Box, 
  Leaf, 
  Phone, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  Info
} from 'lucide-react';

// --- Components ---

const SectionHeading = ({ title, subtitle, light = false }: { title: string, subtitle?: string, light?: boolean }) => (
  <div className="mb-12 text-center">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-caps-dark'}`}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-lg max-w-2xl mx-auto ${light ? 'text-white/80' : 'text-gray-600'}`}
      >
        {subtitle}
      </motion.p>
    )}
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 80 }}
      viewport={{ once: true }}
      className="h-1 bg-caps-orange mx-auto mt-6"
    />
  </div>
);

const Counter = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const end = value;
        const duration = 2000;
        const increment = end / (duration / 16);
        
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.floor(start));
          }
        }, 16);
      }
    }, { threshold: 0.5 });

    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={nodeRef} className="text-center p-6">
      <div className="text-4xl font-bold text-caps-orange mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm uppercase tracking-wider text-gray-500 font-semibold">{label}</div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [utmParams, setUtmParams] = useState({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: ''
  });

  // Handle scroll for header shrink
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Parse UTM params
    const params = new URLSearchParams(window.location.search);
    setUtmParams({
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || ''
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Le Projet', href: '#projet' },
    { name: 'Le Quartier', href: '#quartier' },
    { name: 'Le BRS', href: '#brs' },
    { name: 'Contact', href: '#contact' },
  ];

  const carouselImages = [
    { url: 'https://picsum.photos/seed/residence1/1200/600', title: 'Vue d\'ensemble de la résidence' },
    { url: 'https://picsum.photos/seed/residence2/1200/600', title: 'Espaces verts partagés' },
    { url: 'https://picsum.photos/seed/residence3/1200/600', title: 'Intérieur lumineux' },
    { url: 'https://picsum.photos/seed/residence4/1200/600', title: 'Façade moderne et durable' },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const lots = [
    { type: 'T2', surface: '42 m²', etage: '1er', prix: '154 000 €', plan: '#' },
    { type: 'T3', surface: '65 m²', etage: '2ème', prix: '215 000 €', plan: '#' },
    { type: 'T3', surface: '68 m²', etage: 'RDC', prix: '220 000 €', plan: '#' },
    { type: 'T4', surface: '82 m²', etage: '3ème', prix: '285 000 €', plan: '#' },
    { type: 'T5', surface: '105 m²', etage: 'Dernier', prix: '345 000 €', plan: '#' },
  ];

  const otherPrograms = [
    { name: 'Villa Flora', city: 'Bobigny', image: 'https://picsum.photos/seed/villa/400/300' },
    { name: 'Le Belvédère', city: 'Stains', image: 'https://picsum.photos/seed/belvedere/400/300' },
    { name: 'Horizon Vert', city: 'Pantin', image: 'https://picsum.photos/seed/horizon/400/300' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. HEADER FIXE */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 backdrop-blur-sm py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-caps-orange rounded-lg flex items-center justify-center text-white font-bold text-xl">
              CAPS
            </div>
            <span className="hidden md:block font-display font-bold text-caps-dark text-lg leading-tight">
              Coopérative d'Accession<br/>Sociale à la Propriété
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-caps-dark hover:text-caps-orange font-semibold transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="tel:0102030405" 
              className="flex items-center gap-2 text-caps-turquoise font-bold hover:underline"
            >
              <Phone size={18} /> 01 02 03 04 05
            </a>
            <a 
              href="#contact" 
              className="bg-caps-orange text-white px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-caps-orange/20"
            >
              Contact
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-caps-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href} 
                    className="text-lg font-semibold text-caps-dark py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <a 
                  href="tel:0102030405" 
                  className="flex items-center gap-2 text-caps-turquoise font-bold py-2"
                >
                  <Phone size={20} /> 01 02 03 04 05
                </a>
                <a 
                  href="#contact" 
                  className="bg-caps-orange text-white text-center py-3 rounded-lg font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contactez-nous
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-24 md:pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/traversées/1920/1080" 
            alt="Les Traversées Saint-Denis" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-caps-dark/80 via-caps-dark/40 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-block bg-caps-turquoise text-white px-4 py-1 rounded-full font-bold text-sm mb-6 uppercase tracking-wider"
            >
              Saint-Denis – Confluence Sud
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
            >
              DEVENEZ PROPRIÉTAIRE <br/>
              <span className="text-caps-orange">À 8 MIN DE PARIS</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-white/90 mb-8 font-semibold"
            >
              Grâce au Bail Réel Solidaire (BRS)
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                <CheckCircle size={18} className="text-caps-yellow" /> Frais de notaire offerts
              </div>
              <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                <CheckCircle size={18} className="text-caps-yellow" /> TVA 5,5%
              </div>
              <div className="bg-caps-yellow text-caps-dark px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg">
                2 pièces à partir de 154 000€
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <a 
                href="#projet" 
                className="inline-flex items-center gap-3 bg-caps-orange text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl shadow-caps-orange/30 group"
              >
                Je découvre le projet
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. PRÉSENTATION DU PROGRAMME */}
      <section id="projet" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-caps-dark mb-6">
                Une nouvelle façon d'habiter <br/>
                <span className="text-caps-turquoise">aux portes de Paris</span>
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Découvrez "Les Traversées", une résidence d'exception située au cœur du quartier dynamique de Confluence Sud à Saint-Denis. Ce programme de 50 logements neufs a été conçu pour offrir un cadre de vie serein et moderne aux familles et primo-accédants.
                </p>
                <p>
                  Grâce au dispositif du Bail Réel Solidaire (BRS), devenez propriétaire de votre résidence principale à un prix nettement inférieur au marché, tout en bénéficiant d'une qualité de construction irréprochable et de performances énergétiques de pointe.
                </p>
                <p>
                  L'architecture élégante s'intègre parfaitement dans son environnement urbain, avec des espaces extérieurs pour chaque logement et des jardins partagés favorisant la convivialité entre voisins.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="flex items-start gap-4">
                  <div className="bg-caps-turquoise/10 p-3 rounded-xl text-caps-turquoise">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-caps-dark">Localisation</h4>
                    <p className="text-sm text-gray-500">Quartier Confluence Sud</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-caps-orange/10 p-3 rounded-xl text-caps-orange">
                    <Home size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-caps-dark">50 Logements</h4>
                    <p className="text-sm text-gray-500">Du T2 au T5</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-caps-yellow/10 p-3 rounded-xl text-caps-yellow">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-caps-dark">RE2020</h4>
                    <p className="text-sm text-gray-500">Performance durable</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-caps-turquoise/10 p-3 rounded-xl text-caps-turquoise">
                    <Box size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-caps-dark">BRS</h4>
                    <p className="text-sm text-gray-500">Prix encadrés</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-12">
                <button className="bg-caps-dark text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all">
                  Découvrir la maquette 3D
                </button>
                <button className="border-2 border-caps-orange text-caps-orange px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-caps-orange hover:text-white transition-all">
                  <Download size={20} /> Télécharger la plaquette
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-caps-light rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/maquette/800/1000" 
                  alt="Maquette Les Traversées" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-xl hidden md:block border border-gray-100">
                <div className="flex gap-8">
                  <Counter value={50} label="Logements" />
                  <div className="w-px bg-gray-200"></div>
                  <Counter value={8} label="Min de Paris" suffix=" min" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. CARROUSEL VISUELS */}
      <section className="py-10 bg-caps-light">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
            <div className="aspect-[21/9] relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={carouselImages[currentSlide].url}
                  alt={carouselImages[currentSlide].title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <p className="text-xl font-bold">{carouselImages[currentSlide].title}</p>
              </div>
            </div>

            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white hover:text-caps-dark transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-white hover:text-caps-dark transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-4 right-8 flex gap-2">
              {carouselImages.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-caps-orange w-8' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. LE QUARTIER */}
      <section id="quartier" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Un quartier en pleine mutation" 
            subtitle="Vivez à Confluence Sud, un secteur stratégique entre dynamisme urbain et sérénité fluviale."
          />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-caps-turquoise/5 p-8 rounded-2xl border-l-4 border-caps-turquoise">
                <h3 className="text-2xl font-bold text-caps-dark mb-4">Saint-Denis Confluence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Situé à la pointe sud de Saint-Denis, le quartier Confluence est l'un des projets urbains les plus ambitieux de la métropole. Entre la Seine et le canal Saint-Denis, il offre une qualité de vie rare aux portes de la capitale.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="text-caps-orange shrink-0"><MapPin size={24} /></div>
                  <div>
                    <h4 className="font-bold">Transports</h4>
                    <p className="text-sm text-gray-500">RER D (St-Denis), Métro 13, Tramway T1 & T8 à proximité immédiate.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-caps-orange shrink-0"><CheckCircle size={24} /></div>
                  <div>
                    <h4 className="font-bold">Éducation</h4>
                    <p className="text-sm text-gray-500">Écoles maternelles, primaires et collèges accessibles à pied.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-caps-orange shrink-0"><CheckCircle size={24} /></div>
                  <div>
                    <h4 className="font-bold">Commerces</h4>
                    <p className="text-sm text-gray-500">Marché de Saint-Denis et nouveaux commerces de proximité.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-caps-orange shrink-0"><Leaf size={24} /></div>
                  <div>
                    <h4 className="font-bold">Espaces Verts</h4>
                    <p className="text-sm text-gray-500">Berges de Seine aménagées et parcs urbains pour vos loisirs.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="h-[400px] bg-gray-200 rounded-3xl overflow-hidden relative shadow-inner"
            >
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold">
                <div className="text-center">
                  <MapPin size={48} className="mx-auto mb-4 opacity-20" />
                  [ Placeholder Google Maps ]
                </div>
              </div>
              {/* Overlay for aesthetic */}
              <div className="absolute top-4 left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-100 max-w-[200px]">
                <p className="text-xs font-bold text-caps-orange uppercase mb-1">Adresse du programme</p>
                <p className="text-sm font-semibold">Rue de la Confluence, 93200 Saint-Denis</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. TABLEAU DES LOTS */}
      <section className="py-20 bg-caps-light">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Choisissez votre futur logement" 
            subtitle="Découvrez une sélection de nos lots disponibles. Prix incluant les avantages du BRS."
          />

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-caps-dark text-white">
                    <th className="p-6 font-display uppercase text-sm tracking-wider">Type</th>
                    <th className="p-6 font-display uppercase text-sm tracking-wider">Surface</th>
                    <th className="p-6 font-display uppercase text-sm tracking-wider">Étage</th>
                    <th className="p-6 font-display uppercase text-sm tracking-wider">Prix BRS</th>
                    <th className="p-6 font-display uppercase text-sm tracking-wider text-center">Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {lots.map((lot, idx) => (
                    <tr 
                      key={idx} 
                      className={`border-b border-gray-100 transition-colors hover:bg-caps-turquoise/5 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="p-6 font-bold text-caps-turquoise">{lot.type}</td>
                      <td className="p-6 text-gray-600">{lot.surface}</td>
                      <td className="p-6 text-gray-600">{lot.etage}</td>
                      <td className="p-6 font-bold text-caps-orange">{lot.prix}</td>
                      <td className="p-6 text-center">
                        <button className="text-caps-dark hover:text-caps-orange transition-colors inline-flex items-center gap-2 font-semibold">
                          <Download size={18} /> PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50 text-center text-sm text-gray-500 italic">
              * Prix sous conditions d'éligibilité au Bail Réel Solidaire. Photos et plans non contractuels.
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. LES AVANTAGES DU BRS */}
      <section id="brs" className="py-20 bg-caps-turquoise text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-caps-orange/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading 
            title="Le Bail Réel Solidaire (BRS)" 
            subtitle="Un dispositif innovant pour devenir propriétaire à prix réduit en Île-de-France."
            light
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <Box size={32} />, 
                title: "Prix réduit", 
                desc: "Économisez jusqu'à 40% sur le prix d'achat en ne payant que le bâti, pas le terrain." 
              },
              { 
                icon: <CheckCircle size={32} />, 
                title: "TVA réduite", 
                desc: "Bénéficiez d'une TVA à 5,5% au lieu de 20% pour votre résidence principale." 
              },
              { 
                icon: <Info size={32} />, 
                title: "Foncier séparé", 
                desc: "La CAPS reste propriétaire du terrain, vous êtes pleinement propriétaire de votre logement." 
              },
              { 
                icon: <ArrowRight size={32} />, 
                title: "Pérennité", 
                desc: "Un dispositif qui garantit l'accessibilité sociale sur le long terme pour les générations futures." 
              }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl hover:bg-white/20 transition-all"
              >
                <div className="text-caps-yellow mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-white/80 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-white text-caps-dark p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-2xl"
          >
            <div className="bg-caps-orange/10 p-4 rounded-full text-caps-orange shrink-0">
              <Info size={40} />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold mb-2">Êtes-vous éligible ?</h4>
              <p className="text-gray-600">Le BRS est soumis à des plafonds de ressources. Nos conseillers sont là pour étudier votre dossier et vous accompagner dans votre projet d'accession.</p>
            </div>
            <a href="#contact" className="bg-caps-orange text-white px-8 py-4 rounded-full font-bold hover:bg-opacity-90 transition-all whitespace-nowrap">
              Vérifier mon éligibilité
            </a>
          </motion.div>
        </div>
      </section>

      {/* 8. FORMULAIRE DE CONTACT */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100">
            <div className="lg:w-1/3 bg-caps-dark p-12 text-white flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-6">CONTACTEZ <br/><span className="text-caps-orange">LA CAPS !</span></h2>
                <p className="text-white/70 mb-8">Nos experts vous rappellent sous 24h pour discuter de votre projet immobilier à Saint-Denis.</p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-caps-orange">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase font-bold">Téléphone</p>
                      <p className="font-bold">01 02 03 04 05</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-caps-orange">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase font-bold">Siège Social</p>
                      <p className="font-bold">93200 Saint-Denis</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-white/10">
                <div className="w-12 h-12 bg-caps-orange rounded-lg flex items-center justify-center text-white font-bold text-xl mb-4">
                  CAPS
                </div>
                <p className="text-xs text-white/40">© 2026 CAPS - Coopérative d'Accession Sociale à la Propriété. Tous droits réservés.</p>
              </div>
            </div>

            <div className="lg:w-2/3 p-12">
              <form className="grid sm:grid-cols-2 gap-6">
                {/* Hidden UTM Fields */}
                <input type="hidden" name="utm_source" value={utmParams.utm_source} />
                <input type="hidden" name="utm_medium" value={utmParams.utm_medium} />
                <input type="hidden" name="utm_campaign" value={utmParams.utm_campaign} />
                <input type="hidden" name="utm_content" value={utmParams.utm_content} />

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Civilité</label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="civilite" value="M." className="w-4 h-4 accent-caps-orange" defaultChecked />
                      <span className="text-gray-600">M.</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="civilite" value="Mme" className="w-4 h-4 accent-caps-orange" />
                      <span className="text-gray-600">Mme</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nom *</label>
                  <input 
                    type="text" 
                    name="nom" 
                    required 
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caps-orange focus:ring-2 focus:ring-caps-orange/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Prénom *</label>
                  <input 
                    type="text" 
                    name="prenom" 
                    required 
                    placeholder="Votre prénom"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caps-orange focus:ring-2 focus:ring-caps-orange/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caps-orange focus:ring-2 focus:ring-caps-orange/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone *</label>
                  <input 
                    type="tel" 
                    name="telephone" 
                    required 
                    placeholder="06 00 00 00 00"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caps-orange focus:ring-2 focus:ring-caps-orange/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ville de résidence</label>
                  <input 
                    type="text" 
                    name="ville" 
                    placeholder="Votre ville"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caps-orange focus:ring-2 focus:ring-caps-orange/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Typologie recherchée</label>
                  <select 
                    name="typologie" 
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caps-orange focus:ring-2 focus:ring-caps-orange/20 outline-none transition-all bg-white"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="T2">T2</option>
                    <option value="T3">T3</option>
                    <option value="T4">T4</option>
                    <option value="T5">T5</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                  <textarea 
                    name="message" 
                    rows={4} 
                    placeholder="Votre message..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caps-orange focus:ring-2 focus:ring-caps-orange/20 outline-none transition-all resize-none"
                  ></textarea>
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" required className="mt-1 w-4 h-4 accent-caps-orange" />
                    <span className="text-xs text-gray-500 leading-tight">
                      J'accepte que mes données soient traitées par la CAPS pour la gestion de ma demande. Conformément au RGPD, vous disposez d'un droit d'accès et de rectification. <a href="#" className="text-caps-turquoise underline">Politique de confidentialité</a>.
                    </span>
                  </label>
                </div>
                <div className="sm:col-span-2 mt-4">
                  <button 
                    type="submit" 
                    className="w-full bg-caps-orange text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition-all shadow-xl shadow-caps-orange/30"
                  >
                    Envoyer ma demande
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 9. NOS AUTRES PROGRAMMES */}
      <section className="py-20 bg-caps-light">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Nos autres programmes" 
            subtitle="Découvrez nos opportunités d'accession sociale en Île-de-France."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {otherPrograms.map((program, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={program.image} 
                    alt={program.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-caps-orange text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                    {program.city}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-caps-dark mb-2">{program.name}</h3>
                  <p className="text-gray-500 mb-4">Logements neufs en BRS</p>
                  <div className="flex items-center justify-between">
                    <span className="text-caps-turquoise font-bold">Découvrir</span>
                    <ArrowRight size={20} className="text-caps-orange group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. NOS PARTENAIRES */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-10">Ils nous font confiance</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="h-12 w-32 bg-gray-300 rounded flex items-center justify-center font-bold">LOGO 1</div>
            <div className="h-12 w-32 bg-gray-300 rounded flex items-center justify-center font-bold">LOGO 2</div>
            <div className="h-12 w-32 bg-gray-300 rounded flex items-center justify-center font-bold">LOGO 3</div>
            <div className="h-12 w-32 bg-gray-300 rounded flex items-center justify-center font-bold">LOGO 4</div>
            <div className="h-12 w-32 bg-gray-300 rounded flex items-center justify-center font-bold">LOGO 5</div>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="bg-caps-dark text-white pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-caps-orange rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  CAPS
                </div>
                <span className="font-display font-bold text-lg leading-tight">
                  CAPS
                </span>
              </div>
              <p className="text-white/60 leading-relaxed mb-6">
                La Coopérative d'Accession Sociale à la Propriété accompagne les ménages dans leur projet de vie en proposant des logements de qualité à prix maîtrisés.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-caps-orange">Navigation</h4>
              <ul className="space-y-4 text-white/60">
                <li><a href="#projet" className="hover:text-white transition-colors">Le Projet</a></li>
                <li><a href="#quartier" className="hover:text-white transition-colors">Le Quartier</a></li>
                <li><a href="#brs" className="hover:text-white transition-colors">Le Dispositif BRS</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-caps-orange">Informations</h4>
              <ul className="space-y-4 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Mentions Légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Plan du site</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessibilité</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-caps-orange">Contact</h4>
              <ul className="space-y-4 text-white/60">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-caps-orange shrink-0" />
                  <span>123 Avenue de la République, 93200 Saint-Denis</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={20} className="text-caps-orange shrink-0" />
                  <span>01 02 03 04 05</span>
                </li>
                <li className="flex items-center gap-3">
                  <Info size={20} className="text-caps-orange shrink-0" />
                  <span>Lundi - Vendredi : 9h - 18h</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>© 2026 CAPS. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
