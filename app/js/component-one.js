'use strict';

module.exports = function() {
	console.log('component one!!!!ha');
	require.ensure([], function() {
		require('./component-two.js')();
	});
};
