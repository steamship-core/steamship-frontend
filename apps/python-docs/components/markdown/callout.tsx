import { Icon } from '@/components/markdown/icons/Icon';
import { cn } from '@steamship/react';
import {ReactNode} from "react";

const styles = {
  note: {
    container: 'bg-sky-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
    title: 'text-sky-900 dark:text-sky-400',
    body: 'text-sky-800 [--tw-prose-background:theme(colors.sky.50)] prose-a:text-sky-900 prose-code:text-sky-900 dark:text-slate-300 dark:prose-code:text-slate-300'
  },
  warning: {
    container: 'bg-amber-50 dark:bg-slate-800/60 dark:ring-1 dark:ring-slate-300/10',
    title: 'text-amber-900 dark:text-amber-500',
    body: 'text-amber-800 [--tw-prose-underline:theme(colors.amber.400)] [--tw-prose-background:theme(colors.amber.50)] prose-a:text-amber-900 prose-code:text-amber-900 dark:text-slate-300 dark:[--tw-prose-underline:theme(colors.sky.700)] dark:prose-code:text-slate-300'
  }
};

const icons = {
  note: (props) => <Icon icon="lightbulb" {...props} />,
  warning: (props) => <Icon icon="warning" color="amber" {...props} />
};

export type CalloutProps = {
    kind?: keyof typeof icons;
    title: string;
    children: ReactNode;
}

export function Callout({ kind = 'note', title, children }: CalloutProps) {
  let IconComponent = icons[kind];

  return (
    <div className={cn(`my-8 flex rounded-3xl p-6`,styles[kind].container)}>
      <IconComponent className="h-8 w-8 flex-none" />
      <div className="ml-4 flex-auto">
        <p className={cn(`m-0 font-display text-xl`, styles[kind].title)}>{title}</p>
        <div className={cn(`prose dark:prose-invert mt-2.5`, styles[kind].body)}>{children}</div>
      </div>
    </div>
  );
}

export type DefinitionProps = {
    term: string;
}

export function Definition({ term = '' }: DefinitionProps) {
  if (term == 'vector-database') {
    return (
      <Callout title={'Vector Databases'}>
        <p>
          A Vector Database (aka Embedding Index) is just a way to store and search through natural
          language content.
        </p>
        <p>
          Steamship contains a built-in vector database that&apos;s configured to &quot;just
          work&quot; with Agents and Tool. By default it auto-applies OpenAI&apos;s embeddings to
          text ans queries.
        </p>
      </Callout>
    );
  } else if (term == 'mixin') {
    return (
      <Callout title={'Mixins'}>
        <p>
          A <b>Mixin</b> is just a way to add a bundle of functionality to your{' '}
          <code>AgentService</code>. Mixins can include new API endpoints, async processing
          pipelines, and webhooks.
        </p>
      </Callout>
    );
  } else {
    return (
      <Callout kind="warning" title={'Unknown Definition'}>
        <p>The definition for {term} was requested, but is not registered.</p>
      </Callout>
    );
  }
}

export type VersionRequirementProps = {
    version: string;
}

export function VersionRequirement({ version = '' }: VersionRequirementProps) {
  if (version) {
    return (
      <Callout title={'Python SDK Version'}>
        <p>Version {version} or later of the Steamship SDK is required for this feature.</p>
        <p>
          To use this version, update your `requirements.txt` file and then run `pip install -r
          requirements.txt`
        </p>
      </Callout>
    );
  } else {
    return (
      <Callout kind="warning" title={'Unknown Version'}>
        <p>A version requirement was requested, but it was left blank.</p>
      </Callout>
    );
  }
}
