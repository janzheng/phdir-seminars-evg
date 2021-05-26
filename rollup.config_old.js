import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';

// import autoPreprocess from 'svelte-preprocess';
import sveltePreprocess from 'svelte-preprocess';
import sass from 'rollup-plugin-sass';
import json from 'rollup-plugin-json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const preprocess = sveltePreprocess({
  scss: {
    includePaths: ['src'],
  },
  postcss: {
    plugins: [require('autoprefixer')],
    includePaths: ["./src/styles", "node_modules"],
    output: "static/core.css"
  },
});

const onwarn = (warning, onwarn) => (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
	    sass({
	     // update includePaths to what suits.
	    // node_modules is probably only necessary if you need to import from a css library
	      includePaths: ["./src/styles", "node_modules"],
	      output: "static/global.css"
	    }),
    	json(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				dev,
				hydratable: true,
				emitCss: true,
				preprocess,
				// css: css => {
				// 	css.write('public/bundle.css');
				// }
			}),
			resolve({
				browser: true,
				preferBuiltins: true,
				dedupe: ['svelte']
			}),
			commonjs(),

			// babel({
			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
      	babelrc: false,
				runtimeHelpers: true,
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						// targets: '> 0.25%, not dead'
		        targets: {
		          "browsers": ["> 1%", "ie >= 11", "not ie <= 10"]
		          // "browsers": ["> 1%", "last 2 versions", "ie >= 11", "not ie <= 8"]
		        }
					}]
				],
				plugins: [
					'@babel/plugin-transform-classes',
	      	'@babel/plugin-transform-arrow-functions', 
	      	'@babel/plugin-transform-typeof-symbol', 
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),

			!dev && terser({
				module: true
			})
		],

		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
    	json(),
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
	    sass({
	     // update includePaths to what suits.
	    // node_modules is probably only necessary if you need to import from a css library
	      includePaths: ["./src/styles", "node_modules"],
	      output: "static/global.css"
	    }),
	    
			svelte({
				generate: 'ssr',
				dev,
				preprocess,
			}),
			resolve({
				dedupe: ['svelte']
			}),
			commonjs()
		],
		external: Object.keys(pkg.dependencies).concat(
			require('module').builtinModules || Object.keys(process.binding('natives'))
		),

		onwarn,
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [

			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			commonjs(),
			!dev && terser()
		],

		onwarn,
	}
};
