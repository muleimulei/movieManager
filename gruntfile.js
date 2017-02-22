
module.exports = function(grunt){
	grunt.initConfig({
		watch:{
			pug:{
				files:['views/**'],
				options:{
					livereload:true
				}
			},
			jsAndCss:{
				files:['public/**/*.js','public/**/*.css'],
				options:{
					livereload: true
				}
			}
		},

		nodemon:{
			dev:{
				options:{
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md','node_modules/**','.DS_Store'],
					watchedExtensions:['js'],
					watchedFolder:['app','config'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},

		concurrent:{
			tasks: ['nodemon','watch'],
			options:{
				logConcurrentOutput:true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('nodemon');
	grunt.loadNpmTasks('grunt-contrib-concurrent');


	grunt.registerTask('default',['watch','nodemon']);
}