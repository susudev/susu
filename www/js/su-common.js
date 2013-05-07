        
            /*
             * URL #! NAVIGATION
             */
            function resetHashUrl() {
                $.address.value('/ ');
            }
            function contentHandler_Event(eventObj) {
                $('.sulb-inner.event .buy button').unbind('click');
                $('.sulb-inner.event .buy button').click(function () {
                    $('.sulb-inner.event .buy-info').slideDown();
                });
                $('img.poster').attr('src', 'http://www.swansea-union.co.uk' + eventObj.Image);
                $('.sulb-inner.event div.title').text(eventObj.Title);
				if (eventObj.FullText.length > 0) {
					$('.sulb-inner.event div.desc').html('<p class="info"></p>' + eventObj.FullText);
				}
                $('.sulb-inner.event p.info').text(eventObj.Location + ' - ' + eventObj.Date.format('dS mmmm yyyy @ HH:MM'));
                $.ajax({
                    url: 'https://graph.facebook.com/sinsavers?fields=albums.limit(1).fields(photos.limit(15))',
                    dataType: 'jsonp',
                    success: function(data) {
                        var fb_images = data.albums.data[0].photos.data;
                        if (fb_images.length > 0) {
                            $.each(fb_images, function(i, o) {
                                var img_obj = o.images[o.images.length - 3];
                                //var img = $('<img>', {
                                //    class: 'img-rounded',
                                //    src: img_obj.source
                                //});
								$('.sliderPhotoGallery .slider').append('<div class="slide"><div class="slide-inner"><img class="img-rounded" src="' + img_obj.source + '" /></div></div>');
                            });
							$('.sliderPhotoGallery').iosSlider({
								snapToChildren: true,
								scrollbar: false,
								desktopClickDrag: true,
								infiniteSlider: false
							});
                        }
                    }
                });
                suLightBox('#events-lightbox', eventObj);
            }
            function contentHandler_Blog(blogObj) {
                
            }
            function contentHandler_News(newsObj) {
				$('#news-lightbox div.title').html(newsObj.Title);
				$('#news-lightbox img.lead').attr('src', 'http://www.swansea-union.co.uk' + newsObj.Image);
				$('#news-lightbox div.desc').html(newsObj.Story);
				$('#news-lightbox div.sulb-author').html(newsObj.Organisation);
                suLightBox('#news-lightbox', newsObj);
            }
            function suLightBox(selector, data) {
                $(selector).lightbox_me({
                    centered: true,
                    overlayCSS: { background: 'black', opacity: 0.9 },
                    onLoad: function() {
                        $("body").css("overflow", "hidden");
                    },
                    onClose: function() {
                        $("body").css("overflow", "auto");
                        resetHashUrl();
                        $('.sulb-inner.event .buy-info').hide();
                    }
                });
            }
			$(document).ready(function() {
				$.address.strict(true);
				$.address.crawlable(true);
				$.address.change(function(event) {
					if (event.value == "/") return;
					console.log("Change: " + event.value);
					if (/^\/ents\/event\//i.test(event.value) ||
						/^\/events\//.test(event.value)) {
						console.log('CONTENT TRIGGER: Event');
						// Find the event in the SU_Data object, if it exists.
						if (typeof SU_Data != "undefined") {
							if (SU_Data.hasEvents) {
								for (var eventList in SU_Data.eventData) {
									for (var obj in SU_Data.eventData[eventList]) {
										if (SU_Data.eventData[eventList][obj].Link.indexOf(event.value) !== -1) {
											contentHandler_Event(SU_Data.eventData[eventList][obj]);
											return;
										}
									}
								}
							}
						}
						// If not, redirect to the standalone Event page
						//window.location = event.value;
						//contentHandler_Event();
					}
					else if (/^\/blogs\/blog\//i.test(event.value) ||
							 /^\/union\/officer\//i.test(event.value) ||
							 /^\/union\/fto\//i.test(event.value)) {
						console.log('CONTENT TRIGGER: Blog');
					}
					else if (/^\/news\/article\//i.test(event.value)) {
						console.log('CONTENT TRIGGER: News');
						// Find the news article in the SU_Data object, if it exists.
						if (typeof SU_Data != "undefined") {
							if (SU_Data.hasNews) {
								for (var newsList in SU_Data.newsData) {
									for (var obj in SU_Data.newsData[newsList]) {
										if (SU_Data.newsData[newsList][obj].Link.indexOf(event.value) !== -1) {
											console.log(event.value);
											contentHandler_News(SU_Data.newsData[newsList][obj]);
											return;
										}
									}
								}
							}
						}
						// If not, redirect to the standalone News page
						//window.location = event.value;
						contentHandler_News();
					}
				});
				$('a[rel="deep"]').unbind('click');
				$('a[rel="deep"]').click(function(e) {
					e.preventDefault();
					var url = $(this).attr('href');
					if ($.address.value() != url) {
						$.address.value(url == '/' ? '/ ' : url);
					}
				});
			});
			
			/*
             * MENU JAVASCRIPT
             */
            $(document).ready(function(){
                $('#menu li:not(#menu-logo)').on('click',function(e){
					var linkRel = $(this).children('a').attr('rel');
						if(linkRel != 'page'){
							e.preventDefault();
							$('#menu li').removeClass('menu-link-hover'); 
							var menuLink = $(this).text().toLowerCase();
							if($('.'+menuLink).is(":visible")){
								$('.'+menuLink).hide();
								$.mask.close();
							}else{
								$('#menu li').removeClass('menu-link-hover');
								$(this).addClass('menu-link-hover');
								$('.menu-content').hide();
								$('.'+menuLink).show(); 
								$('#menu').expose();
							}
						}
                });
                $('html').click(function() {
                    $('#menu li').removeClass('menu-link-hover');
                    if($('.menu-content').is(":visible")){
                        $('.menu-content').hide();
                        $.mask.close();
                    }
                });
                $('#menu li, #menu-content-container').click(function(event){
                    event.stopPropagation();
                });
                
                // Create the dropdown base
                $("<select />").appendTo("#mobile-nav");

                // Create default option  
                $("<option />", {
                   "selected": "selected",
                   "value"   : "",
                   "text"    : "Click to Browse.."
                }).appendTo("#mobile-nav select");

                // Populate dropdown with menu items
                $("#menu-pages li a").each(function() {
                 var el = $(this);
                 $("<option />", {
                     "value"   : el.attr("href"),
                     "text"    : el.text()
                 }).appendTo("#mobile-nav select");
                });
            });
			
			/*
			 * HEADLINE WRAP TEXT
			 */
			jQuery.fn.wrapLines = function( openTag, closeTag )
            {
				// Get words & tidy up
				var original = $(this).text();
				var words = $(this).text().match(/\S+/g);
				for (var i = 0; i < words.length; i++) {
					if (words[i] == "&") {
						words[i] == "and";
					}
				}
				console.log('Text Array: ' + words);
				
				// Remove all bar the first word
				$(this).text(words[0]);
				
				// Record height of the element
				var height = $(this).height();
				// Add words until height increases (ie. wraps)
				for (var i = 1; i < words.length; i++) {
					var currentLine = $(this).text();
					$(this).text(currentLine + ' ' + words[i]);
					if (this.height() == height) { // fits
					}
					else { // doesnt fit
						$(this).before(openTag + currentLine + ' ' + closeTag);
						$(this).text(words[i]);
					}
				}
				$(this).before(openTag + $(this).text() + ' ' + closeTag);
				
				// Remove original
				$(this).remove();
            };
			
			jQuery.fn.wrapLines2 = function( openTag, closeTag )
            {
                var dummy = this.clone();
				dummy.css({
                    top: -9999,
                    left: -9999,
                    position: 'absolute',
                    width: this.width()
                });
				dummy.appendTo(this.parent());
                var text = dummy.text().match(/\S+\s+/g);
                var words = text.length,
					lastTopOffset = 0,
					lines = [],
					lineText = '';
                for (var i = 0; i < words; i++)
                {
                    dummy.html(
						text.slice(0,i).join('') + text[i].trim().replace(/(\S)/, '$1<span/>') + text.slice(i+1).join('')
					);
					var topOffset = jQuery('span', dummy).offset().top;
					if (topOffset !== lastTopOffset && i != 0)
					{
						console.log('New Line: ' + lineText);
						lines.push(lineText);
						lineText = text[i];
					}
					else {
						lineText += text[i];
					}
					lastTopOffset = topOffset;
                }
				console.log('New Line: ' + lineText);
                lines.push(lineText);
                this.html(openTag + lines.join( closeTag + openTag ) + closeTag);
				$(dummy).remove();
            };
			
			function encode_utf8(s) {
				return unescape(encodeURIComponent(s));
			}
			
			function decode_utf8(s) {
				return decodeURIComponent(escape(s));
			}
			function escapeHtml(unsafe) {
				return unsafe
					.replace(/�/g, "-")
					.replace(/&/g, "&amp;")
					.replace(/"/g, "&quot;")
					.replace(/'/g, "&#039;");
			}
			
			/*
			* Date Format 1.2.3
			* (c) 2007-2009 Steven Levithan <stevenlevithan.com>
			* MIT license
			*
			* Includes enhancements by Scott Trenda <scott.trenda.net>
			* and Kris Kowal <cixar.com/~kris.kowal/>
			*
			* Accepts a date, a mask, or a date and a mask.
			* Returns a formatted version of the given date.
			* The date defaults to the current date/time.
			* The mask defaults to dateFormat.masks.default.
			*/
			
			var dateFormat = function () {
			   var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
				   timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
				   timezoneClip = /[^-+\dA-Z]/g,
				   pad = function (val, len) {
					   val = String(val);
					   len = len || 2;
					   while (val.length < len) val = "0" + val;
					   return val;
				   };
			
			   // Regexes and supporting functions are cached through closure
			   return function (date, mask, utc) {
				   var dF = dateFormat;
			
				   // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
				   if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
					   mask = date;
					   date = undefined;
				   }
			
				   // Passing date through Date applies Date.parse, if necessary
				   date = date ? new Date(date) : new Date;
				   if (isNaN(date)) throw SyntaxError("invalid date");
			
				   mask = String(dF.masks[mask] || mask || dF.masks["default"]);
			
				   // Allow setting the utc argument via the mask
				   if (mask.slice(0, 4) == "UTC:") {
					   mask = mask.slice(4);
					   utc = true;
				   }
			
				   var	_ = utc ? "getUTC" : "get",
					   d = date[_ + "Date"](),
					   D = date[_ + "Day"](),
					   m = date[_ + "Month"](),
					   y = date[_ + "FullYear"](),
					   H = date[_ + "Hours"](),
					   M = date[_ + "Minutes"](),
					   s = date[_ + "Seconds"](),
					   L = date[_ + "Milliseconds"](),
					   o = utc ? 0 : date.getTimezoneOffset(),
					   flags = {
						   d:    d,
						   dd:   pad(d),
						   ddd:  dF.i18n.dayNames[D],
						   dddd: dF.i18n.dayNames[D + 7],
						   m:    m + 1,
						   mm:   pad(m + 1),
						   mmm:  dF.i18n.monthNames[m],
						   mmmm: dF.i18n.monthNames[m + 12],
						   yy:   String(y).slice(2),
						   yyyy: y,
						   h:    H % 12 || 12,
						   hh:   pad(H % 12 || 12),
						   H:    H,
						   HH:   pad(H),
						   M:    M,
						   MM:   pad(M),
						   s:    s,
						   ss:   pad(s),
						   l:    pad(L, 3),
						   L:    pad(L > 99 ? Math.round(L / 10) : L),
						   t:    H < 12 ? "a"  : "p",
						   tt:   H < 12 ? "am" : "pm",
						   T:    H < 12 ? "A"  : "P",
						   TT:   H < 12 ? "AM" : "PM",
						   Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
						   o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
						   S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
					   };
			
				   return mask.replace(token, function ($0) {
					   return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
				   });
			   };
			}();
			
			// Some common format strings
			dateFormat.masks = {
			   "default":      "ddd mmm dd yyyy HH:MM:ss",
			   shortDate:      "m/d/yy",
			   mediumDate:     "mmm d, yyyy",
			   longDate:       "mmmm d, yyyy",
			   fullDate:       "dddd, mmmm d, yyyy",
			   shortTime:      "h:MM TT",
			   mediumTime:     "h:MM:ss TT",
			   longTime:       "h:MM:ss TT Z",
			   isoDate:        "yyyy-mm-dd",
			   isoTime:        "HH:MM:ss",
			   isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
			   isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
			};
			
			// Internationalization strings
			dateFormat.i18n = {
			   dayNames: [
				   "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
				   "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
			   ],
			   monthNames: [
				   "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
				   "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
			   ]
			};
			
			// For convenience...
			Date.prototype.format = function (mask, utc) {
			   return dateFormat(this, mask, utc);
			};
			
			
			$(document).ready(function() {
				 
				$('.iosSlider').iosSlider();
					
			});