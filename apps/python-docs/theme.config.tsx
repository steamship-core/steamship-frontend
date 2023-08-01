import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import { useRouter } from 'next/router';
import Image from 'next/image';

const config: DocsThemeConfig = {
  logo: () => (
    <div className="relative h-12 w-52">
      <Image
        src="/steamship-logo-light.png"
        alt="Steamship"
        fill
        className="dark:flex hidden object-contain"
      />
      <Image
        src="/logo-dark@3x.png"
        alt="Steamship"
        fill
        className="flex dark:hidden object-contain"
      />
    </div>
  ),
  project: {
    link: 'https://github.com/steamship-core/python-client'
  },
  chat: {
    link: 'https://discord.gg/dR5fHvxSNg'
  },
  footer: {
    text: '© 2023 Steamship, Inc. All rights reserved.'
  },
  editLink: {
    component: () => null
  },
  feedback: {
    content: null
  },
  sidebar: {
    defaultMenuCollapseLevel: 1
  },
  nextThemes: {
    defaultTheme: 'dark'
  },
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== '/') {
      return {
        titleTemplate: '%s – Steamship'
      };
    }
  }
};

export default config;
