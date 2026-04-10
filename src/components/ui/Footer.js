import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-400">Powered by</span>
          <span className="font-bold text-lg tracking-wide">AKIJ RESOURCE</span>
        </div>
        <div className="flex flex-col gap-2 text-sm text-gray-300">
          <span className="font-semibold text-white">Helpline</span>
          <div className="flex items-center gap-2">
            <span>📞</span>
            <span>+88 011020202505</span>
          </div>
          <div className="flex items-center gap-2">
            <span>✉️</span>
            <span>support@akij.work</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
