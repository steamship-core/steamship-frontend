/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { DocsThemeConfig, useConfig } from 'nextra-theme-docs';
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
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { frontMatter } = useConfig();
    const url =
      'https://docs.steamship.com' + (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    return (
      <>
        <meta property="og:url" content={url} />
        {frontMatter.description && (
          <meta property="og:description" content={frontMatter.description} />
        )}
      </>
    );
  },
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
    return {
      title: 'Steamship'
    };
  }
};

export default config;
