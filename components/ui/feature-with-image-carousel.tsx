import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Placeholder images with different dimensions
const placeholderImages = [
  "https://res.cloudinary.com/dneogaofx/image/upload/v1717593096/IMG_20240604_204622_941_nu1lhz.webp",
  "https://res.cloudinary.com/dneogaofx/image/upload/v1717593136/IMG_20240604_204622_981_sptf3n.webp",
  "https://res.cloudinary.com/dneogaofx/image/upload/v1717593238/IMG_20240604_204623_101_lvxkdv.webp",
  "https://res.cloudinary.com/dneogaofx/image/upload/v1729775095/Yellow_Black_Modern_Course_YouTube_Thumbnail_vxyvne.jpg",
];

function Feature() {
  return (
    <div className="w-full py-16 lg:py-28 px-4 sm:px-6 md:px-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Section - Text Content */}
          <div className="text-center lg:text-left space-y-6">
            <Badge className="text-sm px-3 py-1 mx-auto lg:mx-0">Coding Junction</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              Our Vision
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Coding Junction is a college coding club for enthusiasts passionate about learning and building with code. We foster a supportive, inclusive community where students of all skill levels collaborate and grow. Whether you&apos;re a beginner or experienced coder, join us to solve real-world problems and innovate with technology.
            </p>
          </div>

          {/* Right Section - Carousel */}
          <div className="w-full max-w-md sm:max-w-lg mx-auto lg:mx-0">
            <Carousel className="relative">
              <CarouselContent className="flex">
                {placeholderImages.map((image, index) => (
                  <CarouselItem key={index} className="flex-shrink-0 w-full">
                    <div className="flex rounded-lg aspect-video bg-gray-200 dark:bg-gray-800 items-center justify-center p-2 shadow-md">
                      <img
                        src={image}
                        alt={`CJ image ${index + 1}`}
                        width={800}
                        height={450}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute inset-0 hidden md:flex items-center justify-between px-4">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Feature };