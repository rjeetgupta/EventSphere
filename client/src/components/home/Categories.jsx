import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CATEGORIES, containerVariants, itemVariants } from './constants';

const Categories = ({ selectedCategory, onCategorySelect }) => {
  return (
    <section className="py-16 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-foreground mb-8 text-center"
        >
          Browse by Category
        </motion.h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4"
        >
          {CATEGORIES.map(category => (
            <motion.div key={category.name} variants={itemVariants} className="w-full">
              <Button
                variant="outline"
                className={cn(
                  'w-full h-auto py-3 sm:py-4 flex flex-col gap-2 border-2 transition-all duration-300 hover:scale-105',
                  selectedCategory === category.name 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50',
                  category.color
                )}
                onClick={() => onCategorySelect(category.name)}
              >
                <span className="text-xl sm:text-2xl">{category.icon}</span>
                <span className="text-sm sm:text-base truncate text-foreground">{category.name}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories; 