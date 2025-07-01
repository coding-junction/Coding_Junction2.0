"use client";
import Image from "next/image";

export default function FacultyAdvisor() {
  return (
    <section className="w-full px-2 md:px-12 lg:px-32 xl:px-48 py-24 bg-black transition-colors duration-500">
      <div className="relative max-w-6xl mx-auto rounded-3xl border border-border bg-white/90 dark:bg-[#181f2a]/90 backdrop-blur-xl shadow-2xl p-10 md:p-20 flex flex-col md:flex-row items-center gap-10 md:gap-20 overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-gradient-to-tr from-secondary/30 via-primary/30 to-accent/30 rounded-full blur-3xl opacity-50 pointer-events-none" />

        {/* Profile Image with Glow */}
        <div className="flex-shrink-0 relative">
          <span className="absolute -inset-4 bg-gradient-to-tr from-primary/40 to-secondary/40 rounded-2xl blur-2xl opacity-80" />
          <Image
            src=""
            alt="Faculty Advisor"
            width={280}
            height={370}
            className="rounded-2xl border-4 border-primary shadow-xl object-cover"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl md:text-3xl font-black text-primary dark:text-white mb-2 tracking-tight drop-shadow">
            Meet Our Faculty Advisor
          </h2>
          <h3 className="text-base md:text-lg font-extrabold text-black dark:text-white mb-3 tracking-wide drop-shadow-lg">
            Mrs. Kasturi Dikpati (Ghosh)
          </h3>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-200 mb-5 leading-relaxed font-medium">
            Mrs. Kasturi Dikpati (Ghosh) is a distinguished professor in Computer Science with over 20 years of experience in research and mentoring. She inspires our team with her expertise, vision, and passion for innovation.
          </p>
          <div className="mt-3 bg-black border-l-4 border-primary rounded-xl p-4 shadow-inner">
            <h4 className="text-base font-bold text-primary mb-1">Our Vision</h4>
            <p className="italic text-gray-100 text-sm md:text-base font-medium">
              “Our vision is to foster a collaborative and innovative environment where students are empowered to explore, create, and lead. Together, we strive to make a positive impact through research, technology, and community engagement.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}