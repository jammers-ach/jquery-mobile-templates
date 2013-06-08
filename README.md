jquery-mobile-templates
=======================

create jquery mobile pages automatically from {{ mustache }} templates and json data through anchor hrefs

Motivation
----------

Django programmer, writing app with jQuery Mobile. Frustrated with lack of templating options.

Design
------

There is an object store and a template store

templates are loaded into the template store when the first page is loaded. They are held in external files and use {{ mustache }} markup (http://mustache.github.io/)

```
<div id="template-files">
	<a id="employee_template"  type="text/template" href="templates/employee.html"></a>
</div>
```

Objects are put into the object store as and when needed (either by ajax calls, or programatically)

Object store is a 2 level hiararchy: objectStore[objectType][key]

e.g. you put all your employees under  object type 'employee' and index them with the key of their names.
and you put all your books under 'books' and index them with some sort of key

you're links on your page look like this:

```
#tmpl-template_name?obj=object_type&key=key
```

jquery-mobile-templates then automatically generates pages for these objects when the link is clicked.

Usage
------

I'll write some better documentation when I've finished my current project, or someonelse is welcome to do it.

For now, just look at the demo.

Notes
-----

Only tested on Chrome!

Released under MIT licence: http://www.tldrlegal.com/license/mit-license

