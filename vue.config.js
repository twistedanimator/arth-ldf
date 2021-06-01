const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const RemovePlugin = require('remove-files-webpack-plugin')
const path = require('path')

module.exports = {

	transpileDependencies: [
		'vuetify'
	],

	productionSourceMap: false,
	filenameHashing: false,

	// css: {
	// 	extract: false,
	// },

	configureWebpack: {

		// optimization: {
		// 	splitChunks: false
		// },

		// plugins: [
		// 	new RemovePlugin({
		// 		after: {
		// 			root: './dist',
		// 			include: [
		// 				'js',
		// 				'css'
		// 			],
		// 		}
		// 	})
		// ],

		performance: 
		{
			hints: false
		},

		stats: 'none',
	},

	chainWebpack: (config) =>
	{
		if (process.env.NODE_ENV === 'production')
		{
			config.plugins.delete('preload').delete('prefetch').delete('html')
		
			config.entryPoints.clear()

			const titles = [
				'Объемная компрессионная осциллометрия',
				'Электроэнцефалография',
				'Вариабельность сердечного ритма',
				'Биохимический анализ крови'
			]

			titles.map((title, i) =>
			{
				const index = String(i + 1)
				config.entry(index).add(`./src/${index}.js`)		
				config.plugin(`html-${index}`).use(HtmlWebpackPlugin, [{filename: `${index}.html`, chunks: [index, 'chunk-vendors'], title,
					template: path.resolve('public/index.html'), inlineSource: '.(css|js)$'}])
				config.plugin(`inline-${index}`).use(HtmlWebpackInlineSourcePlugin)
			})			
		}
		else
		{
			config.entryPoints.clear()
			config.entry('1').add('./src/1.js')	
		}
		

	}
}
