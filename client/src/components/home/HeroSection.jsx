import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/authSlice';
import { HERO_CONTENT } from './constants';

const HeroSection = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <section className="relative h-[600px] flex items-center justify-center w-full overflow-hidden">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${HERO_CONTENT.backgroundImage})`,
          transform: 'scale(1.03)', // Less blur
          filter: 'brightness(0.85)', // Slight dim for readability
        }}
      />

      {/* Lighter Overlay or No Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 text-center w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg"
        >
          {HERO_CONTENT.title}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200 drop-shadow-md"
        >
          {HERO_CONTENT.description}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
            <Link to={HERO_CONTENT.buttons.primary.link}>
              {HERO_CONTENT.buttons.primary.text}
            </Link>
          </Button>
          {!user && (
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-gray-900 hover:bg-gray-100" asChild
            >
              <Link to={HERO_CONTENT.buttons.secondary.link}>
                {HERO_CONTENT.buttons.secondary.text}
              </Link>
            </Button>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
