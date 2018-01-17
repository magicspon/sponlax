import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import uglify from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'

export default [
	{
		entry: 'src/main.js',
		dest: pkg.main,
		format: 'umd',
		moduleName: 'sponlax',
		plugins: [
			filesize(),
			babel({
				exclude: ['node_modules/**']
			}),
			uglify()
		]
	}
]
