import React from 'react';
import { DocsThemeConfig } from 'nextra-theme-docs';
import { useRouter } from 'next/router';

const config: DocsThemeConfig = {
  logo: <span>Steamship</span>,
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
