(function (root, factory) {
    if (typeof define === 'function' && define.amd){
        define(['fs', 'extended-emitter', 'async-arrays', 'exec', 'common-path-prefix'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('fs'), require('async-arrays'), require('child_process').exec, require('common-path-prefix'));
    } else {
        
    }
}(this, function (fs, arrays, exec, commonPathPrefix) {
    function handler(pages, opts, cb){
        if(typeof opts == 'function'){
            cb = opts;
            opts = {};
        }
        var options = opts || {};
        var dir = options.directory || '';
        var groups = {};
        var matches = [];
        var readTime = options.interval || 2000;
        pages.forEach(function(page, index){
            var longest = '';
            pages.forEach(function(otherPage){
                if(page === otherPage) return; //self
                var can = commonPathPrefix([page, otherPage], '');
                if (can.length > longest.length) longest = can;
            });
            matches[index] = longest;
        });
        matches.forEach(function(match, index){
            if(!groups[match]) groups[match] = [];
            groups[match].push(pages[index]);
        });
        console.log(groups);
        arrays.forEachEmission(Object.keys(groups), function(groupName, pos, done){
            var groupPages = groups[groupName];
            if(options.emitter) options.emitter.emit('quicklook-group', groupPages);
            exec("osascript -e '"+'tell application "Finder" to open ("'+dir+'" as POSIX file)'+"'", function(){
                exec("osascript -e '"+'tell application "Finder" to activate'+"'", function(){
                    var fileList = '{'+groupPages.map(function(page){
                        return '("'+dir+page+'" as POSIX file)';
                    }).join(',')+'}';
                    exec("osascript -e '"+'tell application "Finder" to select '+fileList+''+"'", function(){
                        var modifiers = options.fullscreen?'{command down, option down}':'command down';
                        exec("osascript -e '"+'tell application "System Events" to keystroke "y" using '+modifiers+"'", function(){
                             function showAll(){
                                 var fuse = pages.length-1;
                                 function next(){
                                     setTimeout(function(){
                                         if(options.emitter) options.emitter.emit('quicklook-file', pages[pages.length-fuse-1]);
                                         if(!fuse){
                                             setTimeout(function(){
                                                 // press ESC to exit fullscreen
                                                 exec("osascript -e '"+'tell application "System Events" to keystroke (key code 53) '+"'", function(){
                                                     done();
                                                 });
                                             }, readTime);
                                         } else {
                                             // press -> to advance the gallery
                                             exec("osascript -e '"+'tell application "System Events" to keystroke (key code 124) '+"'", function(){
                                                 fuse--;
                                                 next();
                                             });
                                         }
                                     }, readTime);
                                 }
                                 next();
                             }
                             if(options.fullscreen){
                                 //disable auto-play :P
                                 setTimeout(function(){
                                     // press SPACE to stop suto-show, so we can self-time(and know when to terminate!)
                                     exec("osascript -e '"+'tell application "System Events" to keystroke (key code 49) '+"'", function(){
                                         console.log('attempted to press space')
                                         showAll();
                                     });
                                 }, 500);
                             }else showAll(); //safe to page through todo: handle image paging differently here
                        });
                    });
                });
            });
        }, function(){
            if(cb) cb();
        });
    }
    return handler;
}));