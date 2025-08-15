"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Partner {
  id: number;
  name: string;
  logo: string;
  website: string;
  description?: string;
  status: 'current' | 'past';
}

// Sample community partners data - you can modify this to add actual partners
const currentPartners: Partner[] = [
  {
    id: 1,
    name: "DSU DEVHACK 2.0",
    logo: "/Assets/Logo/logoo 1.png", // Using existing logo as placeholder
    website: "https://www.dsudevhack2.tech",
    description: "DSU DEVHACK 2025 is a national-level hackathon taking place at DSU Harohalli, Bangalore, Karnataka. This event challenges participants to innovate in cutting-edge fields like AI, Machine Learning (ML), Internet of Things (IoT), Blockchain, Cybersecurity, and Cloud computing. The hackathon boasts a substantial prize pool, including a ₹2 lakh cash prize pool and an additional ₹10 lakh-plus worth of prizes.",
    status: 'current'
  },
//   {
//     id: 2,
//     name: "Developer Alliance",
//     logo: "/Assets/Logo/cj_new_logo_2024.png", // Using existing logo as placeholder
//     website: "https://developeralliance.org",
//     description: "Connecting developers worldwide",
//     status: 'current'
//   },
//   {
//     id: 3,
//     name: "Innovation Network",
//     logo: "/Assets/Logo/cj_new_logo_2024.png", // Using existing logo as placeholder
//     website: "https://innovationnetwork.io",
//     description: "Fostering innovation in tech",
//     status: 'current'
//   }
];

// const pastPartners: Partner[] = [
//   {
//     id: 4,
//     name: "Cloud Native Hooghly",
//     logo: "/Assets/Logo/cnh_logo_stacked.png", // Using existing logo as placeholder
//     website: "https://community.cncf.io/cloud-native-hooghly",
//     description: "CNCF Hooghly Chapter, the dynamic and vibrant local community group affiliated with the prestigious Cloud Native Computing Foundation (CNCF). Our mission is to revolutionize the cloud-native landscape in the Hooghly region by fostering a platform that empowers networking, education, and collaboration.",
//     status: 'past'
//   },
//   {
//     id: 5,
//     name: "Startup Accelerator",
//     logo: "/Assets/Logo/cj_new_logo_2024.png", // Using existing logo as placeholder
//     website: "https://startupaccelerator.com",
//     description: "Helped launch numerous tech startups",
//     status: 'past'
//   }
// ];

export default function CommunityPartners() {
  const handlePartnerClick = (website: string) => {
    window.open(website, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-sm font-medium border-white/20 text-white">
            Community Partners
          </Badge>
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Trusted Partners
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            We collaborate with amazing organizations and communities to create 
            meaningful impact in the tech ecosystem.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="space-y-20">
          {/* Current Partner - Featured */}
          <div>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-white mb-3">
                Our Current Partner
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-300 text-lg">
                Happy to be a community partner with DSU DEVHACK 2.0
              </p>
            </div>
            
            {/* Featured Partner Card */}
            <div className="flex justify-center">
              {currentPartners.map((partner) => (
                <div key={partner.id} className="relative max-w-md w-full">
                  {/* Glowing background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-2xl blur-xl opacity-20 animate-pulse"></div>
                  
                  <Card 
                    className="relative group cursor-pointer border-2 border-white/10 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20"
                    onClick={() => handlePartnerClick(partner.website)}
                  >
                    <CardContent className="p-12 text-center">
                      {/* Animated border effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>
                      
                      {/* Partner Logo */}
                      <div className="mb-8 flex justify-center relative z-10">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:opacity-0 transition-opacity duration-500"></div>
                          <Image
                            src={partner.logo}
                            alt={`${partner.name} logo`}
                            fill
                            className="object-contain p-4 relative z-10"
                          />
                        </div>
                      </div>
                      
                      {/* Partner Name with gradient */}
                      <h4 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-500">
                        {partner.name}
                      </h4>
                      
                      {/* Partner Description */}
                      {partner.description && (
                        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                          {partner.description}
                        </p>
                      )}
                      
                      {/* Visit Website Button */}
                      <Button 
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePartnerClick(partner.website);
                        }}
                      >
                        Visit Website
                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Past Partners - Temporarily Disabled */}
          {/* 
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Past Partners
              </h3>
              <p className="text-gray-400">
                Organizations we've collaborated with in the past
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastPartners.map((partner) => (
                <Card 
                  key={partner.id} 
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border border-white/10 bg-gray-900/50 hover:border-gray-500/50 opacity-80 hover:opacity-100"
                  onClick={() => handlePartnerClick(partner.website)}
                >
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white shadow-md group-hover:scale-105 transition-transform duration-300 grayscale group-hover:grayscale-0">
                        <Image
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                    
                    <h4 className="text-md font-medium text-gray-300 mb-2 group-hover:text-white transition-colors">
                      {partner.name}
                    </h4>
                    
                    {partner.description && (
                      <p className="text-xs text-gray-500 mb-3">
                        {partner.description}
                      </p>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePartnerClick(partner.website);
                      }}
                    >
                      View Website
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          */}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-white/10 rounded-lg p-8 shadow-md backdrop-blur-sm">
            <h3 className="text-2xl font-semibold text-white mb-4">
              Interested in Partnering with Us?
            </h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto">
              Join our growing network of community partners and help us build 
              a stronger tech ecosystem together.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white"
              onClick={() => window.open('mailto:email@coding-junction.in', '_blank')}
            >
              Become a Partner
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
