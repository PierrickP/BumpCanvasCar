module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        test: {
            files: ['server/test/**/*.js']
        },
        lint: {
            files: ['server.js', 'client/main.js']
        },
        watch: {
            files: '<config:lint.files>',
            tasks: 'default'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                browser: true
            },
            globals: {
                WCP: true,
                io: true,
                exports: true,
                KEY_UP: true,
                KEY_DOWN: true,
                KEY_RIGHT: true,
                KEY_LEFT: true
            }
        }
    });

    // Default task.
    grunt.registerTask('norme', 'lint');
};