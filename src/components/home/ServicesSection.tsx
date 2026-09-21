import React from 'react';
import {
  Package,
  Activity,
  Tag,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Inbox,
  CheckCircle2,
  Boxes,
} from 'lucide-react';
import { ProductRecord, WebsiteSettingsRecord } from '../../types';

interface ServicesSectionProps {
  products: ProductRecord[];
  settings: WebsiteSettingsRecord;
  onSelectServiceForInquiry?: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  products,
  settings,
  onSelectServiceForInquiry,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All');

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    products?.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = React.useMemo(() => {
    if (selectedCategory === 'All') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleInquire = (title: string) => {
    if (onSelectServiceForInquiry) {
      onSelectServiceForInquiry(title);
    }
    const contactElement = document.getElementById('contact');
    if (contactElement) {
      contactElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Clinical Offerings & Equipment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Services & Products
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 dark:text-slate-300">
            Professional physical therapy consultations, customized rehabilitation programs, and ergonomic support solutions.
          </p>

          {/* Category Filter Tabs */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-teal-800 dark:bg-teal-700 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 hover:text-teal-800 dark:hover:text-teal-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Empty State Handler */}
        {(!filteredProducts || filteredProducts.length === 0) ? (
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Services or Products Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Currently no items match the selected category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-500 transition-all overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.image || '/images/physio_clinic.jpg'}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-teal-800 dark:text-teal-300 shadow-xs backdrop-blur-xs border border-transparent dark:border-slate-700">
                      <Tag className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                      <span>{item.category}</span>
                    </span>

                    {item.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-white shadow-xs backdrop-blur-xs">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Featured Tool</span>
                      </span>
                    )}
                  </div>

                  {item.status && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-600/90 text-white shadow-xs">
                        {item.status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal-800 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    {item.itemType === 'physical' && item.sku && (
                      <div className="mt-2 text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        Item Code: {item.sku}
                      </div>
                    )}
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    {item.price ? (
                      <div>
                        <span className="text-[11px] font-medium text-slate-400 uppercase">
                          {item.itemType === 'physical' ? 'Price' : 'Fee / Pricing'}
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-teal-900 dark:text-teal-300 block">
                          {item.price}
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        In-Clinic Service
                      </div>
                    )}

                    {item.contactButton && (
                      <button
                        onClick={() => handleInquire(item.title)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 hover:bg-teal-700 hover:text-white dark:hover:bg-teal-600 dark:hover:text-white border border-teal-200 dark:border-teal-800 transition-all cursor-pointer"
                      >
                        <span>{item.itemType === 'physical' ? 'Order / Inquire' : 'Inquire'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
