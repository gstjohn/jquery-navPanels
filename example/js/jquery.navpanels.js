/**
  *
  * jQuery navPanels 0.1.0
  * By Garrett St. John (http://hellobold.com)
  *
* */

(function($){
	$.navPanels = function(options) {
		if ( typeof(options) == "undefined" || options == null ) { options = {}; };

		var nP = {
			options: $.extend({
				rootNav: '#root-nav',
				trigger: '.nav-trigger',
				openWidth: '250px',
				overlapWidth: '10px',
				animateDuration: 400
			}, options),

			navId: '#navPanels-nav',
			panelId: '#navPanels-panel',
			navLevels: 0,

			activateTriggers: function($el) {
				// handle forward nav clicks
				$('.navPanels-trigger', $el).click(function() {
					var navId = $(this).data('navid'),
						$nav = $(nP.navId),
					    $navItem, lastTitle, $lastLink;

					// check for a defined nav id
					if (navId == '' || navId == undefined) { return false; }

					$navItem = $('#'+navId);

					// make sure nav element exists
					if ($navItem.length <= 0) { return false; }

					// get clicked link's text
					lastTitle = $(this).html();

					// add an element to the list for back button
					$lastLink = $('<li><a /></li>').find('a')
												   .attr('href', '#')
												   .addClass('navPanels-back')
												   .html('&laquo; '+lastTitle)
												   .end();
					$('ul', $navItem).prepend($lastLink);

					// set up nav item
					$navItem.hide().css({
						display: 'block',
						position: 'fixed',
						top: 0,
						right: '-'+nP.options.openWidth
					}).show();

					// add nav item to nav area
					$(nP.navId).append($navItem);
					nP.incrNavLevel();

					// shift all nav elements over
					$nav.children().find('a').removeClass('active').end().animate({
						right: '+='+(nP.options.openWidth)
					}, nP.options.animateDuration);

					// make current nav links active
					$('a', $navItem).addClass('active');

					// deactive all other nav triggers
					nP.deactivateTriggers($nav);

					// activate subnav triggers
					nP.activateTriggers($navItem);
				});

				// handle backwards nav clicks
				$('.navPanels-back.active').click(function() {
					var $this = $(this),
						$panel = $(nP.panelId),
						$allNavs = $('nav', nP.navId),
						$thisNav = $(this).closest('nav');

					// activate subnav triggers
					nP.activateTriggers($thisNav.prev());

					// slide nav back
					$allNavs.animate({
						right: '-='+nP.options.openWidth
					}, nP.options.animateDuration, function() {
						// reset panel and remove from nav wrapper
						$this.unbind('click').parent('li').remove();
						nP.deactivateTriggers($thisNav);
						$thisNav.attr('style', '').prependTo($panel);
					});

					// decrement nav level
					nP.decrNavLevel();
				});
			},

			deactivateTriggers: function($el) {
				$('.navPanels-trigger', $el).off('click');
			},

			initClicks: function() {
				$(document).on('click', nP.options.trigger, function() {
					if (nP.isNavOpen()) {
						nP.closeNav();
					} else {
						nP.openNav();
					}

					return false;
				});
			},

			initStyling: function() {
				// wrap body
				$panel = $('body > *:not(style,script)').wrapAll('<div id="'+nP.panelId.replace('#', '')+'" />')
														.parent('div');

				// nav wrapper
				$nav = $('<div id="'+nP.navId.replace('#', '')+'" />').insertAfter($panel);

				// styling panel
				$panel.css({
					position: 'relative',
					top: 0,
					right: 0,
					zIndex: 2,
					overflowX: 'hidden'
				});

				// style nav
				$nav.css({
					position: 'fixed',
					top: 0,
					right: '-'+nP.options.openWidth,
					bottom: 0,
					'zIndex': 1,
					width: nP.options.openWidth
				});

				// style body
				$('html, body').css({
					width: '100%',
					overflowX: 'hidden'
				});
			},

			resetNavLevel: function() {
				nP.navLevels = 0;
			},

			decrNavLevel: function() {
				// if this is the first subnav, bump over openWidth by overlapWidth to show layers
				if (nP.navLevels == 2) {
					$(nP.panelId).animate({
						right: '-='+nP.options.overlapWidth
					}, nP.options.animateDuration);

					$nav.animate({
						width: '-='+nP.options.overlapWidth
					}, nP.options.animateDuration);
				}

				nP.navLevels = Math.max(0, --nP.navLevels);
			},

			incrNavLevel: function() {
				// if this is the first subnav, bump over openWidth by overlapWidth to show layers
				if (++nP.navLevels == 2) {
					$(nP.panelId).animate({
						right: '+='+nP.options.overlapWidth
					}, nP.options.animateDuration);

					$nav.animate({
						width: '+='+nP.options.overlapWidth
					}, nP.options.animateDuration);
				}
			},

			isNavOpen: function(val) {
				return (nP.navLevels > 0);
			},

			openNav: function() {
				var $nav = $(nP.navId),
					$panel = $(nP.panelId);

				// add root nav to nav wrapper
				$nav.append($(nP.options.rootNav).show());

				// animate nav and panel over
				$nav.animate({ right: 0 }, nP.options.animateDuration);

				// make links active
				$('a', $nav).addClass('active');

				$(nP.options.rootNav).css({
					position: 'fixed',
					top: 0,
					right: 0
				});

				// shift body
				$panel.animate({ right: nP.options.openWidth }, nP.options.animateDuration);

				// activate subnav triggers
				nP.activateTriggers($(nP.options.rootNav));

				nP.incrNavLevel();
			},

			closeNav: function() {
				var $nav = $(nP.navId),
					$panel = $(nP.panelId),
					$navItems = $nav.children();

				$nav.animate({ right: '-'+nP.options.openWidth }, nP.options.animateDuration, function() {
					// remove back buttons
					$nav.find('.navPanels-back').off('click').remove();

					// hide nav items and move into panel
					$navItems.attr('style', '').prependTo($panel);

					// deativate triggers
					$navItems.each(function() {
						nP.deactivateTriggers($(this));
					});
				});
				$panel.animate({ right: 0 }, nP.options.animateDuration);

				nP.resetNavLevel();
			},

			init: function() {
				nP.initClicks();
				nP.initStyling();
			}

		};

		return {
			init: nP.init
		};
	};
})(jQuery);
