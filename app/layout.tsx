import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TORANG PE TABUNGAN - Sitou Timou Tumo Tou",
  description: "Sistem arisan digital modern - Sitou Timou Tumo Tou. Aplikasi manajemen tabungan arisan yang transparan dan mudah digunakan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('tabungan-kawanua-storage');
                  let shouldBeDark = true; // Default to dark
                  
                  if (stored) {
                    const parsed = JSON.parse(stored);
                    if (parsed.state && parsed.state.darkMode !== undefined) {
                      shouldBeDark = parsed.state.darkMode;
                    }
                  }
                  
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Default to dark on error
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} ${montserrat.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}

