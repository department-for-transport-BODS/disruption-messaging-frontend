// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-coverage-istanbul-reporter'),
			require('karma-spec-reporter'),
			require('@angular-devkit/build-angular/plugins/karma'),
			require('karma-fail-fast-reporter'),
		],
		client: {
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		coverageIstanbulReporter: {
			dir: require('path').join(__dirname, '../coverage/disruption-messaging'),
			reports: ['html', 'lcovonly', 'text-summary'],
			fixWebpackSourcePaths: true
		},
		reporters: config.angularCli && config.angularCli.codeCoverage
			? ['progress', 'spec', 'coverage-istanbul']
			: ['progress', 'kjhtml', 'spec'],
		specReporter: {
		  maxLogLines: 5,         // limit number of lines logged per test
		  suppressErrorSummary: true,  // do not print error summary
		  suppressFailed: false,  // do not print information about failed tests
		  suppressPassed: false,  // do not print information about passed tests
		  suppressSkipped: true,  // do not print information about skipped tests
		  showSpecTiming: false // print the time elapsed for each spec
		},
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		singleRun: false,
		restartOnFileChange: true,
		proxies: { '/assets': 'http://localhost:4210/assets' }
	});
};
