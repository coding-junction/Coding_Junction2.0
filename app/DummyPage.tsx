import Image from "next/image";

export default function DummyPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-black text-center px-6 py-12">
      {/* Memorial Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl rounded-2xl p-8 max-w-2xl w-full border border-gray-700">
        <div className="flex flex-col items-center">
          {/* Image */}
          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gray-600 shadow-lg">
            <Image
              src="/Assets/Images/donadi1.jpg"
              alt="Dona Murmu"
              fill
              className="object-cover"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-semibold text-white mt-6">In Loving Memory of Our Beloved Dona Di</h1>
          <p className="text-gray-300 mt-2">16.08.2000 – 2025</p>
        </div>

        {/* Message */}
        <div className="mt-6 text-gray-300 space-y-4 leading-relaxed">
          <p>
            With deepest sorrow, we share that our beloved <span className="font-semibold text-white">Dona Di</span> has left us today.
            Her kindness, warmth, and ever-smiling presence touched countless hearts and will forever remain in our memories.
          </p>
          <p>
            Though she is no longer with us, her love, blessings, and cherished moments will continue to guide us.
          </p>
          <p>
            May her soul rest in eternal peace. She will always be remembered with love and respect.
          </p>
          <p className="italic text-gray-400">Om Shanti 🤍</p>
        </div>

        {/* Condolence Note */}
        <div className="mt-8 border-t border-gray-700 pt-6">
          <p className="text-gray-400">
            It’s very unfortunate to share that,{" "}
            <span className="font-semibold text-white">Dona Murmu</span>, our
            extremely adored member of{" "}
            <span className="font-semibold text-white">Coding Junction</span>,
            has passed away.
          </p>
          <p className="mt-3 text-gray-400">
            Her sudden departure is deeply painful beyond explanation, leaving
            a void in us. The loss is tragic, and her absence will be felt by
            everyone who knew her.
          </p>
          <p className="mt-3 text-gray-300 font-medium">You will be deeply missed, Didi.</p>
        </div>
      </div>
    </div>
  );
}
