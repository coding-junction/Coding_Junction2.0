import Image from "next/image";

export default function DummyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-center px-6 py-12">
      {/* Memorial Card */}
      <div className="bg-black shadow-2xl rounded-2xl p-8 max-w-2xl w-full border border-gray-700">
        <div className="flex flex-col items-center">
          {/* Image */}
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-500 shadow-lg">
            <Image
              src="/Assets/Images/donadi5.jpg"
              alt="Dona Murmu"
              fill
              className="object-cover"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-semibold text-white mt-6">
            In Loving Memory of Our Beloved Dona Di
          </h1>
          <p className="text-gray-400 mt-2">16.08.2000 – 2025</p>
        </div>

        {/* Message */}
        <div className="mt-6 text-gray-300 space-y-4 leading-relaxed">
          <p>
            With deepest sorrow, we share that our beloved{" "}
            <span className="font-semibold text-white">Dona Di</span> has left
            us. Her kindness, warmth, and ever-smiling presence touched
            countless hearts and will forever remain in our memories.
          </p>
          <p>
            Though she is no longer with us, her love, blessings, and cherished
            moments will continue to guide us.
          </p>
          <p>
            May her soul rest in eternal peace. She will always be remembered
            with love and respect.
          </p>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6">
          <p className="mt-3 text-gray-300 font-medium">
            You will be deeply missed, Didi.
          </p>
         <p className="italic text-gray-500 mt-3">Om Shanti 🤍</p>
        </div>
      </div>
    </div>
  );
}
