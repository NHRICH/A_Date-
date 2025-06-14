import "./globals.css";

export const metadata = {
  title: "A Special Invitation",
  description: "A special invitation for a magical evening",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=Lato:wght@300;400;700&display=swap" 
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-playfair: 'Playfair Display', serif;
            --font-cormorant: 'Cormorant Garamond', serif;
            --font-inter: 'Inter', sans-serif;
            --font-lato: 'Lato', sans-serif;
          }
          body {
            font-family: var(--font-inter);
          }
          h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-playfair), var(--font-cormorant);
          }
        `}</style>
      </head>
      <body>
        {children}
        {/* Bottom-left logo/link */}
        <a
          href="https://bento.me/nhrich"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 left-15 z-50 bg-black/70 text-white hover:bg-black/90 rounded-full px-4 py-2 text-sm font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          NH Rich
        </a>
      </body>
    </html>
  )
}
