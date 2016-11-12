osx-quicklook
=============
Programmatic control of quicklook in OSX. There are a few other libraries that allow you to use quicklook to generate previews... while that's cool, sometimes you want to preview a set of images from the command line and while I could build something more complex, quicklook works pretty well when I'm on OS X.

Usage
-----

require the library
    
    var quicklook = require('osx-quicklook');

preview some files

    quicklook([
    	'~/Images/myProject/thumbnail.png',
    	'~/Images/myProject/preview.png',
    	'~/Images/myProject/raw.png'
    ], function(){
    	//done
    });
    
And if you give it directories of many depth, it will break them into groups:

    quicklook([
    	'~/Images/myProject/thumbnail.png',
    	'~/Images/myProject/preview.png',
    	'~/Images/myProject/raw.png',
    	'~/Images/otherProject/sprites.gif',
    	'~/Images/otherProject/basemap.tiff',
    ], function(){
    	//done
    })
    
Options
-----------
You can optionally pass an options argument as the second argument. Options are:

- **emitter** emits `quicklook-group` events on display of each group and `quicklook-file` on each display
- **fullscreen** show it fullscreen?
- **directory** base path common to all files
- **interval** number of milliseconds between files in the gallery



Testing
-------
Manual



Enjoy,

-Abbey Hawk Sparrow