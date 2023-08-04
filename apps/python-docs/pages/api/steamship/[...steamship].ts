import { createNextPagesApiHandler } from '@steamship/react/next/server';

export const config = {
  runtime: 'edge'
};

export default createNextPagesApiHandler();
