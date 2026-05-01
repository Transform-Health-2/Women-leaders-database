export default function SiteFooter() {
  return (
    <footer className="font-sans relative bg-[#FEE5F6]">
      <div className="relative">
        <img
          src="https://transformhealthcoalition.org/wp-content/themes/th/assets/images/footer_icon_bg.svg"
          alt=""
          className="block w-full px-[5vw] py-[2.5rem]"
        />
        <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 max-w-[70%] w-full">
          <div className="flex flex-col gap-2">
            {[
              "Policies",
              "Media Enquiries",
              "Get Involved",
              "Opportunities",
              "Equity & Inclusion Dashboard",
              "Privacy Policy",
            ].map((link) => (
              <a
                key={link}
                href="#"
                className="text-white no-underline text-[1.4rem]"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#002D48] text-white text-[1.4rem] font-light py-[1rem] text-center">
        Copyright © {new Date().getFullYear()} Transform Health. All Rights Reserved.
      </div>
    </footer>
  );
}
