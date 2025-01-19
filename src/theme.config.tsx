// imports have to start with "./src" instead of "src"
import { Navbar } from "@/components/navbar";
import { SidebarTitle } from "@/components/sidebar-title";
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  head: () => {
    return (
      <>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="lomi. | Developers docs" />
        <meta property="og:description" content="The open-source payment orchestration platform powering West-African businesses" />
        <title>lomi. | Developer docs</title>
        <link rel="canonical" href="https://developers.lomi.africa" />
        <link rel="icon" href="/lomi.png" />
        <link rel="apple-touch-icon" href="/lomi.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "lomi. | Developers docs",
              "description": "The open-source payment orchestration platform powering West-African businesses",
              "url": "https://developers.lomi.africa",
              "publisher": {
                "@type": "Organization",
                "name": "lomi.",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://developers.lomi.africa/lomi.png"
                }
              }
            })
          }}
        />
      </>
    )
  },
  project: {
    link: "https://github.com/lomiafrica/developers.lomi.africa",
  },
  chat: {
    link: "https://github.com/lomiafrica/developers.lomi.africa",
  },
  docsRepositoryBase: "https://github.com/lomiafrica/developers.lomi.africa/tree/main",
  navbar: {
    component: <Navbar />,
  },
  sidebar: {
    toggleButton: false,
    autoCollapse: true,
    defaultMenuCollapseLevel: 1,
  },
  footer: {
    component: null
  },
  themeSwitch: {
    component: () => null
  },
  darkMode: false,
};

export default config;
