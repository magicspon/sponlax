import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import uglify from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'
import serve from 'rollup-plugin-serve'
import html from 'rollup-plugin-html'

export default [
	{
		entry: 'src/main.js',
		dest: pkg.main,
		format: 'umd',
		moduleName: 'sponlax',
		plugins: [
			serve({
				// Launch in browser (default: false)
				open: true,

				// Show server address in console (default: true)
				verbose: false,

				// Folder to serve files from
				contentBase: '',

				// Multiple folders to serve from
				contentBase: ['dist'],

				// Set to true to return index.html instead of 404
				historyApiFallback: false,

				// Options used in setting up server
				host: 'localhost',
				port: 3000
			}),

			html({
				include: '**/*.html'
			}),
			filesize(),
			babel({
				exclude: ['node_modules/**']
			}),
			uglify()
		]
	}
]
