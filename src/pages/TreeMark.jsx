import React from 'react';
import { Link } from 'react-router-dom';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { usePageTitle } from '../hooks/usePageTitle';

const NPM_URL = 'https://www.npmjs.com/package/@nickhansonsr/treemark';
const GITHUB_URL = 'https://github.com/ArchILLtect/treemark';
const RELEASE_URL = `${GITHUB_URL}/releases/tag/v1.0.0`;
const ISSUES_URL = `${GITHUB_URL}/issues`;
const BANNER_IMAGE = '/images/treemark/treemark-banner.jpg';
const SOCIAL_IMAGE = 'https://nickhanson.me/images/treemark/treemark-social.jpg';

const pageMetadata = {
  description: 'TreeMark is a cross-platform Node.js CLI for deterministic directory trees, safe Markdown synchronization, and CI freshness checks.',
  canonicalUrl: 'https://nickhanson.me/projects/treemark',
  openGraphTitle: 'TreeMark | Nick Hanson Showcase',
  openGraphDescription: 'Generate deterministic Markdown or ASCII directory trees, synchronize documentation safely, and verify freshness in CI.',
  openGraphUrl: 'https://nickhanson.me/projects/treemark',
  openGraphImage: SOCIAL_IMAGE,
  twitterTitle: 'TreeMark | Nick Hanson Showcase',
  twitterDescription: 'Generate deterministic directory trees, synchronize Markdown safely, and verify documentation freshness in CI.',
  twitterUrl: 'https://nickhanson.me/projects/treemark',
  twitterImage: SOCIAL_IMAGE,
};

const externalLinkClass = 'inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 font-semibold no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900';
const textLinkClass = 'inline-flex min-h-11 items-center rounded px-1 text-blue-700 underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300';
const sectionClass = 'border-t border-gray-300 px-5 py-10 dark:border-gray-700 sm:px-8';
const codeClass = 'overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100';

const TreeMark = () => {
  usePageTitle('TreeMark');
  usePageMetadata(pageMetadata);

  return (
    <article className="mx-auto mb-32 max-w-sm overflow-hidden rounded-lg bg-gray-100 text-gray-700 shadow-lg dark:bg-gray-800 dark:text-gray-200 md:max-w-2xl lg:max-w-5xl">
      <header className="px-5 py-12 text-center sm:px-8 sm:py-16">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">
          Released developer tool
        </p>
        <h1 className="mb-5 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
          TreeMark
        </h1>
        <p className="mx-auto mb-8 max-w-3xl text-lg leading-8 text-gray-600 dark:text-gray-300">
          Generate deterministic Markdown or ASCII directory trees, synchronize project documentation safely, and verify freshness in CI.
        </p>
        <img
          src={BANNER_IMAGE}
          width="1200"
          height="320"
          alt="TreeMark banner showing its terminal and directory-tree branding with generate, synchronize, and check capabilities"
          className="mx-auto mb-8 h-auto w-full max-w-full rounded-md border border-gray-700 shadow-lg"
        />
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={NPM_URL}
            className={`${externalLinkClass} bg-blue-600 text-white hover:bg-blue-700`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Install TreeMark
          </a>
          <a
            href={GITHUB_URL}
            className={`${externalLinkClass} border border-gray-500 text-gray-800 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </header>

      <section className={sectionClass} aria-labelledby="treemark-quick-start">
        <h2 id="treemark-quick-start" className="mb-5 text-2xl font-bold text-gray-900 dark:text-white">Quick Start</h2>
        <div className="space-y-4">
          <pre className={codeClass}><code>npm install --global @nickhansonsr/treemark</code></pre>
          <pre className={codeClass}><code>treemark --help</code></pre>
          <pre className={codeClass}><code>treemark .</code></pre>
          <pre className={codeClass}><code>{`treemark . --update README.md
treemark . --update README.md --check`}</code></pre>
        </div>
      </section>

      <section className={sectionClass} aria-labelledby="treemark-problem">
        <h2 id="treemark-problem" className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">What TreeMark Solves</h2>
        <p className="max-w-3xl leading-7">
          TreeMark keeps directory documentation deterministic and reviewable, replacing manually maintained structure maps with repeatable generated output.
        </p>
      </section>

      <section className={sectionClass} aria-labelledby="treemark-capabilities">
        <h2 id="treemark-capabilities" className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Core Capabilities</h2>
        <ul className="grid list-disc gap-3 pl-5 sm:grid-cols-2">
          <li>Markdown and ASCII directory trees</li>
          <li>Complete generated files with <code>--output</code></li>
          <li>Safe marked-region synchronization with <code>--update</code></li>
          <li>No-write freshness verification with <code>--check</code></li>
          <li>Repeatable ignore patterns and maximum depth</li>
          <li>Exit codes designed for automation and CI</li>
        </ul>
      </section>

      <section className={sectionClass} aria-labelledby="treemark-dogfooding">
        <h2 id="treemark-dogfooding" className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Real Output / Showcase-Site Dogfooding</h2>
        <p className="mb-5 max-w-3xl leading-7">
          TreeMark generated and now owns the project-structure region in the README for the Showcase Site that hosts this page.
        </p>
        <pre className={codeClass}><code>{`- **src/**
  - **components/**
  - **hooks/**
  - **pages/**
  - [App.jsx](src/App.jsx)`}</code></pre>
        <p className="mb-3 mt-6 font-semibold text-gray-900 dark:text-white">TreeMark-owned README region</p>
        <pre className={codeClass}><code>{`<!-- treemark:start -->
<!-- Generated by TreeMark. Do not edit manually. -->

- **src/**
  - [App.jsx](src/App.jsx)

<!-- treemark:end -->`}</code></pre>
      </section>

      <section className={sectionClass} aria-labelledby="treemark-workflow">
        <h2 id="treemark-workflow" className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Representative Workflow</h2>
        <ol className="list-decimal space-y-3 pl-5 leading-7">
          <li>Generate or update the documented structure.</li>
          <li>Review the resulting Git diff.</li>
          <li>Use check mode in CI to detect stale generated content without writing files.</li>
        </ol>
        <h3 className="mb-3 mt-7 text-lg font-bold text-gray-900 dark:text-white">Automation-friendly exit codes</h3>
        <dl className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-gray-300 p-4 dark:border-gray-600">
            <dt className="font-bold text-green-700 dark:text-green-300">0 — Current / success</dt>
            <dd className="mt-1 text-sm">The target is current or the command completed successfully.</dd>
          </div>
          <div className="rounded-md border border-gray-300 p-4 dark:border-gray-600">
            <dt className="font-bold text-red-700 dark:text-red-300">1 — Failure</dt>
            <dd className="mt-1 text-sm">An operational or validation error prevented completion.</dd>
          </div>
          <div className="rounded-md border border-gray-300 p-4 dark:border-gray-600">
            <dt className="font-bold text-amber-700 dark:text-amber-300">2 — Valid but stale</dt>
            <dd className="mt-1 text-sm">The comparison succeeded, but regeneration would change the target.</dd>
          </div>
        </dl>
      </section>

      <section className={sectionClass} aria-labelledby="treemark-support">
        <h2 id="treemark-support" className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Release / Platform Support</h2>
        <ul className="flex flex-wrap gap-3" aria-label="TreeMark release details">
          {['v1.0.0', 'MIT licensed', 'Node.js 22+', 'Windows', 'macOS', 'Linux'].map((item) => (
            <li key={item} className="rounded-full border border-gray-400 px-4 py-2 text-sm font-semibold dark:border-gray-600">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
          CI-tested on Node.js 22 and 24 across Windows, macOS, and Linux.
        </p>
      </section>

      <section className={sectionClass} aria-labelledby="treemark-links">
        <h2 id="treemark-links" className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Project Links</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          <li><a href={NPM_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>npm package</a></li>
          <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>GitHub repository</a></li>
          <li><a href={RELEASE_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>v1.0.0 release</a></li>
          <li><a href={ISSUES_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>Issues</a></li>
        </ul>
      </section>

      <section className={`${sectionClass} text-center`} aria-labelledby="treemark-final-cta">
        <h2 id="treemark-final-cta" className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Keep Project Structure Documentation Current</h2>
        <p className="mx-auto mb-6 max-w-2xl leading-7">
          Install TreeMark from npm, or inspect the source and detailed CLI documentation on GitHub.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <a href={NPM_URL} target="_blank" rel="noopener noreferrer" className={`${externalLinkClass} bg-blue-600 text-white hover:bg-blue-700`}>Install TreeMark</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={`${externalLinkClass} border border-gray-500 text-gray-800 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700`}>View on GitHub</a>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <a href={RELEASE_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>View v1.0.0 release</a>
          <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>View issues</a>
          <Link to="/projects" className={textLinkClass}>Back to Projects</Link>
        </div>
      </section>
    </article>
  );
};

export default TreeMark;
