import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

import alias from "@rollup/plugin-alias";
import path from "path";
// import autoExternal from 'rollup-plugin-auto-external'; // airtable??
// import path from 'path';

// import autoPreprocess from 'svelte-preprocess';
import sveltePreprocess from 'svelte-preprocess';
import sass from 'rollup-plugin-sass';
import json from 'rollup-plugin-json';

import dotenv from 'dotenv';
dotenv.config();



const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const preprocess = sveltePreprocess({
  scss: {
    includePaths: ['src'],
  },
  postcss: {
    plugins: [require('autoprefixer')],
    // includePaths: ["node_modules", "./src/styles", ],
    includePaths: [ "./src/styles", ],
    output: "static/core.css"
  },
});


const useBabel = {
	extensions: ['.js', '.mjs', '.html', '.svelte'],
	// babelrc: false,
	// runtimeHelpers: true,
  babelHelpers: 'runtime',
	exclude: ['node_modules/@babel/**'],
	presets: [
    ['@babel/preset-env', {
      targets: '> 0.25%, not dead'
    }]
		// ['@babel/preset-env', {
		// 	// targets: '> 0.25%, not dead'
    //   targets: {
    //     "browsers": ["> 1%", "ie >= 11", "not ie <= 10"]
    //     // "browsers": ["> 1%", "last 2 versions", "ie >= 11", "not ie <= 8"]
    //   }
		// }]
	],
	plugins: [
    '@babel/plugin-syntax-dynamic-import',
		['@babel/plugin-transform-runtime', {
			useESModules: true
		}],
		'@babel/plugin-transform-classes',
  	'@babel/plugin-transform-arrow-functions', 
  	'@babel/plugin-transform-typeof-symbol', 
		'@babel/plugin-syntax-import-meta'
	]
}


// const onwarn = (warning, onwarn) => (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);

const onwarn = (warning, onwarn) => {
  // console.log('warning code:', warning.code)
	return (warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
	(warning.code === 'CIRCULAR_DEPENDENCY' ) ||
	(warning.code === 'PLUGIN_WARNING' ) ||
	(warning.code === 'THIS_IS_UNDEFINED') ||
	onwarn(warning);
}



export default {
	client: {
		input: config.client.input(),
    context: 'this', // required for supabase realtime
		output: config.client.output(),
		plugins: [
			replace({
				'process.env.npm_package_version': undefined, // so airtable can compile properly
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode),

        // env keys for the public!
        'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
        'process.env.SUPABASE_KEY': JSON.stringify(process.env.SUPABASE_KEY),
        'process.env.SENTRY': JSON.stringify(process.env.SENTRY)
			}),
	    sass({
	     // update includePaths to what suits.
	     // node_modules is probably only necessary if you need to import from a css library
	      // includePaths: ["node_modules", "./src/styles", ],
	      includePaths: [ "./src/styles", ],
	      output: "static/global.css"
	    }),

			commonjs(),
			globals(),
	    builtins(),
    	json(),

	    // autoExternal({
	    //   builtins: true,
	    //   dependencies: true,
	    //   packagePath: path.resolve('./packages/module/package.json'),
	    //   peerDependencies: false,
	    // }),
			svelte({
				compilerOptions: {
					dev,
					hydratable: true
				},
				// dev,
				// hydratable: true,
				emitCss: true,
				preprocess,
				// css: css => {
				// 	css.write('public/bundle.css');
				// }
			}),
			resolve({
				// browser: true,
				browser: true, // for airtable?
				preferBuiltins: false,
				dedupe: ['svelte']
			}),

			alias({
			  entries: [
			    {
			      find: "@",
			      replacement: path.resolve(__dirname, "src/")
			    }
			  ]
			}),


			// babel({
			legacy && babel(useBabel),

      terser(), // support optional chaining
      
			!dev && terser({
				module: true
			})
		],

		// external: ['airtable'],
	 //  globals: {
	 //    'airtable': 'Airtable',
	 //  },

		preserveEntrySignatures: false,
		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
    	json(),
			replace({
				'process.env.npm_package_version': undefined,
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode),

        'process.env.SUPABASE_URL': JSON.stringify(process.env.SUPABASE_URL),
        'process.env.SUPABASE_KEY': JSON.stringify(process.env.SUPABASE_KEY)
			}),
	    // sass({
	    //  // update includePaths to what suits.
	    // // node_modules is probably only necessary if you need to import from a css library
	    //   // includePaths: ["node_modules", "./src/styles", ],
	    //   includePaths: ["./src/styles", ],
	    //   output: "static/global.css"
	    // }),
	    
			commonjs(),
			
			// babel({
			legacy && babel(useBabel),
      terser(), // support optional chaining

			svelte({
				compilerOptions: {
          generate: 'ssr',
          dev,
        },
				preprocess,
			}),
			resolve({
				dedupe: ['svelte']
			}),


			alias({
			  entries: [
			    {
			      find: "@",
			      replacement: path.resolve(__dirname, "src/")
			    }
			  ]
			}),

			
		],
		// external: Object.keys(pkg.dependencies).concat(
    //     require('module').builtinModules || Object.keys(process.binding('natives'))
    //   ),

		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),

		onwarn,
	},

	// serviceworker: {
	// 	input: config.serviceworker.input(),
	// 	output: config.serviceworker.output(),
	// 	plugins: [

	// 		legacy && babel(useBabel),
	// 		resolve(),
	// 		replace({
	// 			'process.browser': true,
	// 			'process.env.NODE_ENV': JSON.stringify(mode),
	// 			'process.env.SAPPER_TIMESTAMP': process.env.SAPPER_TIMESTAMP || Date.now()
	// 		}),
	// 		commonjs(),
	// 		!dev && terser()
	// 	],

	// 	onwarn,
	// }
};
