import Image from "next/image";

export default function Footer() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <footer className="bg-[#1a1a2e] text-white mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 uppercase tracking-widest">
              Powered by
            </span>
            <Image
              src="/footer-logo.png"
              alt="Footer Logo"
              width={130}
              height={36}
              loading="eager"
              className="object-contain brightness-0 invert"
            />
          </div>

          {/* Right: Helpline */}
          <div className="flex flex-col gap-2 text-sm text-gray-300">
            <span className="font-semibold text-white tracking-wide">
              Helpline
            </span>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-phone text-[#6B3FE7] text-xs"></i>
              <span>+88 011020202505</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-envelope text-[#6B3FE7] text-xs"></i>
              <span>support@akij.work</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
