import * as esbuild from 'esbuild-wasm';

let initialized = false;
let initializationPromise: Promise<void> | null = null;

export async function initializeEsbuild() {
  if (initialized) {
    return;
  }
  
  // If already initializing, wait for that to complete
  if (initializationPromise) {
    await initializationPromise;
    return;
  }
  
  // Start initialization
  initializationPromise = esbuild.initialize({
    worker: true,
    wasmURL: '/esbuild.wasm',
  }).then(() => {
    initialized = true;
  });
  
  await initializationPromise;
}

// Plugin to resolve React and @react-email/components imports
function createReactEmailPlugin(): esbuild.Plugin {
  return {
    name: 'react-email-resolver',
    setup(build) {
      // Resolve React imports
      build.onResolve({ filter: /^react$/ }, () => ({
        path: 'react',
        namespace: 'react-shim',
      }));

      build.onResolve({ filter: /^react\/jsx-runtime$/ }, () => ({
        path: 'react-jsx-runtime',
        namespace: 'react-shim',
      }));

      build.onLoad({ filter: /^react$/, namespace: 'react-shim' }, () => ({
        contents: 'module.exports = window.React;',
        loader: 'js',
      }));

      build.onLoad({ filter: /^react-jsx-runtime$/, namespace: 'react-shim' }, () => ({
        contents: `
          export const jsx = window.React.createElement;
          export const jsxs = window.React.createElement;
          export const Fragment = window.React.Fragment;
        `,
        loader: 'js',
      }));

      // Resolve @react-email/components
      build.onResolve({ filter: /@react-email\/components/ }, () => ({
        path: 'react-email-components',
        namespace: 'react-email',
      }));

      build.onLoad({ filter: /.*/, namespace: 'react-email' }, () => ({
        contents: `
          const c = window.REACT_EMAIL_COMPONENTS;
          export const Html = c.Html;
          export const Head = c.Head;
          export const Body = c.Body;
          export const Container = c.Container;
          export const Section = c.Section;
          export const Row = c.Row;
          export const Column = c.Column;
          export const Heading = c.Heading;
          export const Text = c.Text;
          export const Button = c.Button;
          export const Link = c.Link;
          export const Img = c.Img;
          export const Hr = c.Hr;
        `,
        loader: 'js',
      }));
    },
  };
}

// Must use build() API (not transform()) for plugin support
export async function compileComponent(tsxCode: string): Promise<string> {
  await initializeEsbuild();
  
  const result = await esbuild.build({
    stdin: {
      contents: tsxCode,
      loader: 'tsx',
    },
    bundle: true,
    format: 'iife',
    globalName: 'EmailComponent',
    write: false,
    plugins: [createReactEmailPlugin()],
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  });
  
  return result.outputFiles[0].text;
}

