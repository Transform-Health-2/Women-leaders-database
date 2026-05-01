export default function SiteHeader() {
  return (
    <header className="bg-brand-cream px-[2.5rem] py-[1.5rem] w-full sticky top-0 z-[999] font-sans">
      <div className="flex justify-between items-center max-w-[1400px] mx-auto">
        <div className="logo">
          <img
            src="https://transformhealthcoalition.org/wp-content/themes/th/assets/images/main_logo.svg"
            alt="Transform Health"
            className="h-[4rem] block"
          />
        </div>
        <nav>
          <ul className="flex list-none m-0 p-0">
            {[
              "Home",
              "About",
              "Our Work",
              "Partners",
              "Insights",
              "National Coalitions",
            ].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-[1.6rem] uppercase px-[1.5rem] text-[#333] no-underline font-medium tracking-[0.03em]"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
