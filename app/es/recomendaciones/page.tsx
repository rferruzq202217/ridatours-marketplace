import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import { Star, Clock, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const breadcrumbItems = [
  { label: 'Inicio', href: '/es' },
  { label: 'Recomendaciones Ridatours' }
];

export default async function RecomendacionesPage() {
  const { data: allExperiences } = await supabase.from('experiences').select('id, title, slug, price, rating, reviews, duration, main_image, cities!inner(slug, name)').eq('active', true).order('created_at', { ascending: false });

  const experiences = (allExperiences || []).map((exp: any) => ({
    city: exp.cities?.slug || '', slug: exp.slug, title: exp.title, cityName: exp.cities?.name || '',
    image: exp.main_image || '', price: exp.price, rating: exp.rating, reviews: exp.reviews, duration: exp.duration || ''
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang="es" transparent={false} showSearch={true} />
      <div className="h-24"></div>
      <div className="bg-white border-b"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3"><Breadcrumb items={breadcrumbItems} /></div></div>
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4"><Award size={40} className="text-yellow-300" /><h1 className="text-4xl md:text-5xl font-bold">Recomendaciones de Ridatours</h1></div>
          <p className="text-xl text-violet-100 max-w-2xl">Nuestra selección personal de experiencias.</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8"><span className="font-semibold text-gray-900">{experiences.length} experiencias recomendadas</span></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {experiences.map((exp) => (
            <Link key={exp.slug} href={`/es/${exp.city}/${exp.slug}`} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all">
              <div className="relative h-48">
                <Image src={exp.image} alt={exp.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="25vw" />
                <div className="absolute top-3 left-3 bg-violet-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Award size={12} /> RECOMENDADO</div>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">{exp.cityName.toUpperCase()}</p>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">{exp.title}</h3>
                {exp.duration && <div className="flex items-center gap-2 text-sm text-gray-600 mb-3"><Clock size={14} /><span>{exp.duration}</span></div>}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-current" /><span className="font-medium text-gray-700">{exp.rating}</span><span className="text-xs text-gray-400">({exp.reviews.toLocaleString('es-ES')})</span></div>
                  <div className="text-right"><span className="text-xs text-gray-500">Desde</span><p className="font-bold text-lg">€{exp.price}</p></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {experiences.length === 0 && <div className="text-center py-16"><div className="text-6xl mb-4">💜</div><h3 className="text-xl font-semibold text-gray-900 mb-2">No hay recomendaciones</h3><Link href="/es" className="inline-flex bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700">Explorar</Link></div>}
      </div>
      <Footer lang="es" />
    </div>
  );
}
