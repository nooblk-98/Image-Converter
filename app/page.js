import ImageConverter from '../components/ImageConverter';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Convert Images Online — <span className="text-indigo-600">Fast, Free & Easy</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-500 leading-relaxed">
              Convert PNG, JPG, WEBP, GIF and HEIC images instantly and safely. No installations, no sign-ups, processed 100% locally.
            </p>
          </div>

          {/* Main Upload Converter Section */}
          <div className="w-full font-sans">
            <ImageConverter />
          </div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10">
          <div className="absolute top-12 left-10 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  );
}
