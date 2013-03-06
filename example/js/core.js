$(function() {

	var navPanels = $.navPanels({
		trigger: '.nav-trigger',
		rootNav: '#root-nav',
		animateDuration: 100
	});

	navPanels.init();

	// var aboutNavPanels = $.navPanels({
	// 	trigger: '.about-subnav-trigger',
	// 	nav: '#about-subnav'
	// });

	// aboutNavPanels.init();

	// var jPM = $.jPanelMenu({
	// 	direction: 'right'
	// });

	// jPM.on();

	// var jPMabout = $.jPanelMenu({
	// 	direction: 'right',
	// 	menu: '#about-submenu',
	// 	trigger: '.about-menu-trigger'
	// });

	// jPMabout.on();

});
