import React from 'react';
import { Download, Smartphone, Star, Shield } from 'lucide-react';
import { Footer } from '../Footer/page';
import { NavBar } from '../NavBar/page';

const App = () => {
  return (

    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <NavBar/>
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Download Our Amazing App
          </h1>
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    The Coding Junction App
                </h3>
          <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300">
            Transform your mobile experience with our innovative solution
          </p>
          
          {/* Download Button */}
          <a 
            href="https://dl.dropboxusercontent.com/s/0zeznf2a5rvrs7x/release_coding_junction_VC_6.apk?dl=1" 
            className="inline-flex items-center px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold 
            bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-300"
          >
            <Download className="mr-3" />
            Download Now
          </a>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: Smartphone,
              lightIconColor: 'text-blue-600',
              darkIconColor: 'text-blue-400',
              title: 'User-Friendly Design',
              description: 'Intuitive interface that makes navigation a breeze'
            },
            {
              icon: Star,
              lightIconColor: 'text-yellow-500',
              darkIconColor: 'text-yellow-400',
              title: 'Premium Features',
              description: 'Packed with cutting-edge functionality you\'ll love'
            },
            {
              icon: Shield,
              lightIconColor: 'text-green-600',
              darkIconColor: 'text-green-400',
              title: 'Secure & Private',
              description: 'Your data protection is our top priority'
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl shadow-lg dark:shadow-none text-center 
              bg-white dark:bg-gray-800 
              border border-gray-100 dark:border-gray-700 
              transition-colors duration-300"
            >
              <feature.icon 
                className={`mx-auto mb-4 ${feature.lightIconColor} dark:${feature.darkIconColor}`} 
                size={48} 
              />
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Social Proof Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            Why Users Love Our App
          </h2>
          <div className="flex justify-center space-x-8">
            <div>
              <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                4.8
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Average Rating
              </p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                1K+
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Downloads
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  );
};

export default App;