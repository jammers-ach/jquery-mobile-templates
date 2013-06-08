/*!
 * jQuery Mobile templating system
 * version: alpha
 *
 * Tested on jquery v1.8.3
 * An plugin to jQuery Mobile to allow Moustache templates
 * to be dynamicly loaded with data
 * 
 * @author jammers
 * 
 */


(function ( $ ) {
	 	
	$.templates= new Object;
	
	$.templates.version = "alpha";
	$.templates.templateStore= {};
	$.templates.objectStore = {};
	
	var templatesToLoad = 0;
	
	//Give ourselvs an init to load the templates
	$(document).bind("ready", function(){
		initLoad();
	});

	
	//When the templates are loaded
	$(document).bind('templatesLoaded',function(){
		//Whooo
		console.log($.templates.templateStore);
		console.log($.templates.objectStore);
	});
	
	/**
	 * Loads a template into the template store
	 * @param templateName name of the template (for keystore)
	 * @param template the html contents of the template
	 */
	$.templates.loadTemplate = function (templateName, template){
		console.log('loading template ' + templateName + "from Pure HTML");
		
		$.templates.templateStore[templateName] = template;
	}
	
	
	/**
	 * Loads a template into the template store
	 * @param templateName name of the template (for keystore)
	 * @param template the id of the <src> element to load
	 */
	$.templates.loadTemplateFromSrc = function (templateName, idOfSrcElement){
		console.log('loading template ' + templateName + "from SRC "  + idOfSrcElement);
	}
	
	/**
	 * Loads a template into the template store
	 * @param templateName name of the template (for keystore)
	 * @param template the id of the <src> element to load
	 */
	$.templates.loadTemplateFromUrl = function (templateName, url){
		//make ajax call to url with template, put data into template store
		$.ajax({
		  url: url,
		  success: function(data){
			  $.templates.templateStore[templateName] = data;
			  
			  //If we're counting how many templates we need to load, decrement fire the trigger
			  if(templatesToLoad > 0){
				  templatesToLoad = templatesToLoad -1;
				  
				  if(templatesToLoad == 0){
					  $(document).trigger('templatesLoaded');
				  }
			  }
		  },
		});
	}
	
	
	
	/**
	 * Loads all the templates when we init
	 */
	function initLoad(){
		console.log('loading all templates');
		
		/*
		 So I wanted to have the external templates specified in <script> tags
		 <script id="flashcard_template"  type="text/template" src="templates/flashcards.html"></script>
		 but there was no way of accessing them through the DOM.
		 
		 So for now all scripts are placed in a <a> tags in <div id='template-files'> 
		 a kind of fake header. Is deleted when the various loading scripts have been called 
		 */
		
		$('#template-files').hide();

		//Count in and out the templates that we need to load;
		templatesToLoad = $('#template-files a').length;
		
		//Find all the script elements in the head with text/template that have an id and load them into the template store
		$('#template-files a').each(function(){
			if($(this).attr('id') && $(this).attr('href')){
				$.templates.loadTemplateFromUrl($(this).attr('id'),$(this).attr('href'));
				
			}
		});
		
		$('#template-files a').remove();
	}
	
	
	
	/**
	 * Stick an object in the object store
	 * i.e. store[objtype][key] = obj
	 */
	$.templates.addObjectToStore = function(objtype,key,obj){
		if(!(objtype in $.templates.objectStore)){
			$.templates.objectStore[objtype] = {};
		}
		$.templates.objectStore[objtype][key] = obj;
	}
	
	/**
	 * Stick an lots of objects in the object store
	 * i.e. store[objtype] = objs
	 */
	$.templates.addObjectsToStore = function(objtype,objs){
		
		$.templates.objectStore[objtype] = objs;
	}
	
	
	
	/**
	 * Before a page is changed, hijack the calls to anything starting with #tmpl-
	 * pull up the relevant templates, stick in the data and render it as a page
	 * Based on: http://jquerymobile.com/demos/1.1.1/docs/pages/page-dynamic.html
	 */
	$(document).bind( "pagebeforechange", function( e, data ) {

		if ( typeof data.toPage === "string" ) {

			// We are being asked to load a page by URL, but we only
			// want to handle URLs that request the data for a specific
			// category.
			var u = $.mobile.path.parseUrl( data.toPage ),
				re = /^#tmpl-/;

			if ( u.hash.search(re) !== -1 ) {

				
				loadPage( u, data.options );

				// Make sure to tell changePage() we've handled this call so it doesn't
				// have to do anything.
				e.preventDefault();
			}
		}
	});
	
	
	/**
	 * Loads a page
	 * @param urlObj
	 * @param options
	 */
	function loadPage(urlObj, options){

		
		//Get the parameters (anything after ?, but put into a nice dictionary)
		params = {};
		pageParams = urlObj.hash.split('?')[1].split('&');
		for(i in pageParams){
			params[pageParams[i].split('=')[0]] = pageParams[i].split('=')[1];
		}
		
		//Get the template name and object name and key
		var templateName = urlObj.hash.split('?')[0].replace('#','').replace('tmpl-','');
		var objName = params['obj'];
		var objKey  = params['key'];

		if ( objName && objKey && templateName ) {
			
			//Get template, generate page, add it to the pageContainter, and then make it a page
			template = $.templates.templateStore[templateName];
			var html = Mustache.to_html(template, $.templates.objectStore[objName][objKey]); 
			
			//Check if we've already got a page with that data url. If so remove it as we can't assume it's fresh
			var data_url = templateName + '-' +objName+ '-'+objKey;
			var oldPage = $('div[data-url="'+data_url+'"]')
			if(oldPage.length > 0){
				oldPage.remove();
			}
			
			//Generate the new page, stick in in the document, call create on it
			var newPage = $(html);
		    newPage.attr('data-url',data_url).appendTo( $.mobile.pageContainer ).trigger("create");
		    //Set the page has to something sensible
			options.dataUrl = "#" + data_url;
			//Change page
			$.mobile.changePage( newPage, options );
		}
	}
	
 
}( jQuery ));

