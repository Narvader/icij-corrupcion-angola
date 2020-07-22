// jQuery's way to avoid conflict
var jq = jQuery.noConflict()

// VARS
var scroll25 = false;
var scroll50 = false;
var scroll75 = false;
var scroll100 = false;

var scrollWindow

var viewportHeight = window.innerHeight
var map = document.getElementById("map")
var numbers = document.getElementsByClassName("data__value")
var empresasString
var maxValue = 142

var options = {
  	duration: 1,
	useEasing: false,
  	useGrouping: false,
}

jq(document).ready(function(){

	init();

	jq(window).scroll(function(){

		scrollWindow = jq(window).scrollTop();
		scrollSocialNetworks();
		scrollActiv();

		if(isVisible(jq('.coordination'), scrollWindow)) {
			jq('.share-container').removeClass('is-visible');
		}

	});

	jq.ajax({
        type: "GET",
        //url: "data/empresas.csv",
        url: "https://www.ecestaticos.com/file/264c3dcdd4ad764b77fb742874721343/1579262694-empresas.csv",
        dataType: "text",
        success: function(data) {
        	empresasString = data
        	parseEmpresas()
        }
    });

    jq("#map").on("mouseenter", ".circle", function(){
		var country = jq(this).data("country")
		var number = jq(this).data("number")

		jq("#tooltip").html('<h4 class="tooltip__country">'+country+'</h4><span class="tooltip__detail"><span class="tooltip__number color">'+number+'</span> '+getTooltipLabel(number)+'</span>')

		jq("#tooltip").show().css({
	    	top: jq(this).position().top,
	    	left: jq(this).position().left + 15
	    })		
	}).on("mouseleave", "div", function(){
	    jq("#tooltip").hide()
	})

});

window.addEventListener("scroll", function(){
	//scrollTop = jq(window).scrollTop()
	if ( isResponsive() ) {
		jq(".graph__row").each(function(){
			if ( isVisible(jq(this),scrollWindow) ) {
				var graphItem = jq(this)
				if ( !graphItem.hasClass("animated") ) {
					setGraphBarValue(graphItem)	
					graphItem.addClass("animated")
				}
			}
		})
	} else {
		if ( isVisible(jq("#map"),scrollWindow) ) {
			if ( !jq("#map").hasClass("visible") ) {
				jq("#map").addClass("visible")
			}
		}
	}

	//Lazy load
	jq(".photo").each(function(){
		if ( isVisible(jq(this),scrollWindow) ) {
			var photo = jq(this)
			if ( !photo.hasClass("visible") ) {
				if ( isMobile() ) {
					photo.prev().attr("srcset",photo.data("src-mobile"))
				} else {
					photo.attr("src",photo.data("src"))
				}
				
				photo.addClass("visible")
			}
		}
	})

	for (var i = 0; i < numbers.length; i++) {
		if ( (isElementVisible(numbers.item(i))) && !numbers.item(i).classList.contains("played") ) {
			var currentNumber = numbers.item(i)
			currentNumber.classList.add("played")
			//var counter = new CountUp(currentNumber, currentNumber.dataset.value, options);
			var counter = new CountUp(currentNumber, currentNumber.getAttribute("data-value"), options);
			if (!counter.error) {
			  counter.start();
			} else {
			  console.error(counter.error);
			}
		}
	}
})

function init(){
	socialNetworksSharing();
	initCarousel();
	extrainfoButtons();
}


function scrollActiv(){  
	scrollPercent = getScrollPercent();	
	if ( scrollPercent >= 25 ) {
		if ( !scroll25 ) {
          	universalGa('t1.send', 'event', 'Especial redacción - saqueo de Angola', 'scroll', 'Scroll Depth 25%');
		    scroll25 = true;
		    }
		}
		if ( scrollPercent >= 50 ) {
		    if ( !scroll50 ) {
          	universalGa('t1.send', 'event', 'Especial redacción - saqueo de Angola', 'scroll', 'Scroll Depth 50%');
    		scroll50 = true;
		    }
		}
		if ( scrollPercent >= 75 ) {
		  	if ( !scroll75 ) {
          	universalGa('t1.send', 'event', 'Especial redacción - saqueo de Angola', 'scroll', 'Scroll Depth 75%');
			scroll75 = true;
		  	}
		}
		if ( scrollPercent >= 100 ) {
		  	if ( !scroll100 ) {
          	universalGa('t1.send', 'event', 'Especial redacción - saqueo de Angola', 'scroll', 'Scroll Depth 100%')
			scroll100 = true;
		}
	}
}



function isVisible(el,scroll) {
    var elementTop = el.offset().top;
	var elementBottom = elementTop + el.outerHeight();
	var viewportTop = scroll;
	var viewportBottom = viewportTop + jq(window).height();
	//return (elementTop > viewportTop) && (elementBottom < viewportBottom);
	return (elementTop < viewportBottom)
}


function getScrollPercent() {
	var bottom = jq(window).height() + jq(window).scrollTop();
	var height = jq(document).height();
	return Math.round(100*bottom/height);
}


function scrollSocialNetworks() {
	var mobileSocialNetworks = jq(".share-container")
	var desktopSocialNetworks = jq(".aside")
	if (window.scrollY > 63){
		mobileSocialNetworks.addClass('is-visible');
		desktopSocialNetworks.addClass('is-visible');	
	} else {
		mobileSocialNetworks.removeClass('is-visible');
		desktopSocialNetworks.removeClass('is-visible');
	}
}


function socialNetworksSharing() {
	var urlPage = window.location.href;
	jq('.share-fb').each(function(){
	var fbHref = "https://www.facebook.com/sharer/sharer.php?u="+urlPage;
        jq(this).attr('href',fbHref);
    });
    jq('.share-tw').each(function(){
        var tuitText = encodeURI(jq(this).data('text'));
        var tuitHref = "https://twitter.com/intent/tweet?url="+urlPage+"&text="+tuitText+"&original_referer="+urlPage;
        jq(this).attr('href',tuitHref);
    });
    jq('.share-lk').each(function(){
        var lkText = encodeURI(jq(this).data('text'));
        var lkHref = "https://www.linkedin.com/shareArticle?mini=true&url="+urlPage+"&title="+lkText+"&summary=&source=";
        jq(this).attr('href',lkHref);
    });
    jq('.share-wa').each(function(){
        var waText = encodeURI(jq(this).data('text'));
        var waHref = "https://api.whatsapp.com/send?text="+waText+" "+urlPage;
        jq(this).attr('href',waHref);
    });
}

function initCarousel() {

	jq('.carousel').slick({
		lazyLoad: 'ondemand',
		slidesToShow: 1,
		slidesToScroll: 1,
		infinite: false,
	});

	jq('.carousel').on('init', function(event, slick){
	  slideCount = slick.slideCount;
	  setSlideCount();
	  setCurrentSlideNumber(slick.currentSlide);
	});

	jq('.carousel').on('beforeChange', function(event, slick, currentSlide, nextSlide){
	  setCurrentSlideNumber(nextSlide);
	});

	function setSlideCount() {
	  var el = jq('.carousel__number').find('.total');
	  el.text(slideCount);
	}

	function setCurrentSlideNumber(currentSlide) {
	  var el = jq('.carousel__number').find('.current');
	  el.text(currentSlide + 1);
	}

}

function extrainfoButtons() {
	jq('#openOne').click(function(){
		jq('#extrainfoOne').addClass('fixed');
		jq('body').addClass('no-overflow')
		jq("#closeOne").next().attr("src",jq(this).data("doc"))
	});
	jq('#closeOne').click(function(){jq('#extrainfoOne').removeClass('fixed'); jq('body').removeClass('no-overflow')});
	jq('#openTwo').click(function(){
		jq('#extrainfoTwo').addClass('fixed');
		jq('body').addClass('no-overflow')
		jq("#closeTwo").next().attr("src",jq(this).data("doc"))
	});
	jq('#closeTwo').click(function(){jq('#extrainfoTwo').removeClass('fixed'); jq('body').removeClass('no-overflow')});
	jq('#openThree').click(function(){
		jq('#extrainfoThree').addClass('fixed');
		jq('body').addClass('no-overflow')
		jq("#closeThree").next().attr("src",jq(this).data("doc"))
	});
	jq('#closeThree').click(function(){jq('#extrainfoThree').removeClass('fixed'); jq('body').removeClass('no-overflow')});
}



function setGraphBarValue(item) {
	var itemValue = item.find(".graph__value")
	var itemNumber = item.find(".graph__number").html()
	var barValue =  ( itemNumber / maxValue ) * 100
	console.log(barValue)
	itemValue.css({
		width: barValue+"%"
	})
}

function getTooltipLabel(number) {
	var label = number > 1 ? "empresas" : "empresa"
	return label
}

function parseEmpresas() {
    Papa.parse(empresasString, {
        //download: true,
        header: true,
        step: function(results) {
        	addCountry(results.data)
        },
        complete: function() {
        	setCirclesDelay()	
        }
    });
}

function addCountry(country) {
	var countryName = country.pais
	var countryClass = getClassName(countryName)
	/*var htmlCountry = '<div class="circle circle--'+countryClass+'">'+
						'<div class="circle__content text-uppercase">'+
							'<h4 class="circle__country">'+countryName+'</h4>'+
							'<span class="circle__detail"><span class="circle__number color">'+country.empresas+'</span> empresa</span>'+
						'</div>'+
					'</div>'*/
	var htmlCountry = '<div class="circle circle--'+countryClass+'" data-country="'+countryName+'" data-number="'+country.empresas+'"></div>'
	map.innerHTML += htmlCountry
}

function setCirclesDelay() {
	jq(".circle").each(function(){
		jq(this).css({
			transitionDelay: (Math.random()*3)+'s', 
		})
	})
}

function getClassName(string) {
	var result = string.replace(/\s+/g, '-').toLowerCase()
	result = replaceSpecialChars(result)

	return result
}

function replaceSpecialChars(string) {
	var chars = {
		"á":"a", "é":"e", "í":"i", "ó":"o", "ú":"u",
		"à":"a", "è":"e", "ì":"i", "ò":"o", "ù":"u", "ñ":"n",
		"Á":"A", "É":"E", "Í":"I", "Ó":"O", "Ú":"U",
		"À":"A", "È":"E", "Ì":"I", "Ò":"O", "Ù":"U", "Ñ":"N"}
	var expr = /[áàéèíìóòúùñ]/ig;
	var result = string.replace(expr,function(e){return chars[e]});
	return result;
}

function isMobile() {
	return jq(window).width() < 768
}

function isResponsive() {
	return jq(window).width() < 993
}

function isElementVisible(el) {
    var scroll = window.scrollY || window.pageYOffset
    var boundsTop = el.getBoundingClientRect().top + scroll
    
    var viewport = {
        top: scroll,
        bottom: scroll + window.innerHeight,
    }
    
    var bounds = {
        top: Math.floor(boundsTop),
        bottom: boundsTop + el.clientHeight,
    }

    return bounds.top <= ( viewport.top + ( viewportHeight / 1.5 ) )
}

var __assign=this&&this.__assign||function(){return(__assign=Object.assign||function(t){for(var i,a=1,s=arguments.length;a<s;a++)for(var n in i=arguments[a])Object.prototype.hasOwnProperty.call(i,n)&&(t[n]=i[n]);return t}).apply(this,arguments)},CountUp=function(){function t(t,i,a){var s=this;this.target=t,this.endVal=i,this.options=a,this.version="2.0.4",this.defaults={startVal:0,decimalPlaces:0,duration:2,useEasing:!0,useGrouping:!0,smartEasingThreshold:999,smartEasingAmount:333,separator:",",decimal:".",prefix:"",suffix:""},this.finalEndVal=null,this.useEasing=!0,this.countDown=!1,this.error="",this.startVal=0,this.paused=!0,this.count=function(t){s.startTime||(s.startTime=t);var i=t-s.startTime;s.remaining=s.duration-i,s.useEasing?s.countDown?s.frameVal=s.startVal-s.easingFn(i,0,s.startVal-s.endVal,s.duration):s.frameVal=s.easingFn(i,s.startVal,s.endVal-s.startVal,s.duration):s.countDown?s.frameVal=s.startVal-(s.startVal-s.endVal)*(i/s.duration):s.frameVal=s.startVal+(s.endVal-s.startVal)*(i/s.duration),s.countDown?s.frameVal=s.frameVal<s.endVal?s.endVal:s.frameVal:s.frameVal=s.frameVal>s.endVal?s.endVal:s.frameVal,s.frameVal=Math.round(s.frameVal*s.decimalMult)/s.decimalMult,s.printValue(s.frameVal),i<s.duration?s.rAF=requestAnimationFrame(s.count):null!==s.finalEndVal?s.update(s.finalEndVal):s.callback&&s.callback()},this.formatNumber=function(t){var i,a,n,e,r,o=t<0?"-":"";if(i=Math.abs(t).toFixed(s.options.decimalPlaces),n=(a=(i+="").split("."))[0],e=a.length>1?s.options.decimal+a[1]:"",s.options.useGrouping){r="";for(var l=0,h=n.length;l<h;++l)0!==l&&l%3==0&&(r=s.options.separator+r),r=n[h-l-1]+r;n=r}return s.options.numerals&&s.options.numerals.length&&(n=n.replace(/[0-9]/g,function(t){return s.options.numerals[+t]}),e=e.replace(/[0-9]/g,function(t){return s.options.numerals[+t]})),o+s.options.prefix+n+e+s.options.suffix},this.easeOutExpo=function(t,i,a,s){return a*(1-Math.pow(2,-10*t/s))*1024/1023+i},this.options=__assign({},this.defaults,a),this.formattingFn=this.options.formattingFn?this.options.formattingFn:this.formatNumber,this.easingFn=this.options.easingFn?this.options.easingFn:this.easeOutExpo,this.startVal=this.validateValue(this.options.startVal),this.frameVal=this.startVal,this.endVal=this.validateValue(i),this.options.decimalPlaces=Math.max(this.options.decimalPlaces),this.decimalMult=Math.pow(10,this.options.decimalPlaces),this.resetDuration(),this.options.separator=String(this.options.separator),this.useEasing=this.options.useEasing,""===this.options.separator&&(this.options.useGrouping=!1),this.el="string"==typeof t?document.getElementById(t):t,this.el?this.printValue(this.startVal):this.error="[CountUp] target is null or undefined"}return t.prototype.determineDirectionAndSmartEasing=function(){var t=this.finalEndVal?this.finalEndVal:this.endVal;this.countDown=this.startVal>t;var i=t-this.startVal;if(Math.abs(i)>this.options.smartEasingThreshold){this.finalEndVal=t;var a=this.countDown?1:-1;this.endVal=t+a*this.options.smartEasingAmount,this.duration=this.duration/2}else this.endVal=t,this.finalEndVal=null;this.finalEndVal?this.useEasing=!1:this.useEasing=this.options.useEasing},t.prototype.start=function(t){this.error||(this.callback=t,this.duration>0?(this.determineDirectionAndSmartEasing(),this.paused=!1,this.rAF=requestAnimationFrame(this.count)):this.printValue(this.endVal))},t.prototype.pauseResume=function(){this.paused?(this.startTime=null,this.duration=this.remaining,this.startVal=this.frameVal,this.determineDirectionAndSmartEasing(),this.rAF=requestAnimationFrame(this.count)):cancelAnimationFrame(this.rAF),this.paused=!this.paused},t.prototype.reset=function(){cancelAnimationFrame(this.rAF),this.paused=!0,this.resetDuration(),this.startVal=this.validateValue(this.options.startVal),this.frameVal=this.startVal,this.printValue(this.startVal)},t.prototype.update=function(t){cancelAnimationFrame(this.rAF),this.startTime=null,this.endVal=this.validateValue(t),this.endVal!==this.frameVal&&(this.startVal=this.frameVal,this.finalEndVal||this.resetDuration(),this.determineDirectionAndSmartEasing(),this.rAF=requestAnimationFrame(this.count))},t.prototype.printValue=function(t){var i=this.formattingFn(t);"INPUT"===this.el.tagName?this.el.value=i:"text"===this.el.tagName||"tspan"===this.el.tagName?this.el.textContent=i:this.el.innerHTML=i},t.prototype.ensureNumber=function(t){return"number"==typeof t&&!isNaN(t)},t.prototype.validateValue=function(t){var i=Number(t);return this.ensureNumber(i)?i:(this.error="[CountUp] invalid start or end value: "+t,null)},t.prototype.resetDuration=function(){this.startTime=null,this.duration=1e3*Number(this.options.duration),this.remaining=this.duration},t}();