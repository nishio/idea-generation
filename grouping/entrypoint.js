/**
 * (c) 2013, Cybozu.
 */
goog.require('nhiro.repos');
goog.require('main.main');
$(function(){
    nhiro.repos.set("jQuery", jQuery);
    nhiro.repos.set("Raphael", Raphael);
    main.main();
});
