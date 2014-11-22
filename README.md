# jQuery.niceCodeLines

Add lines before pre HTML element. It only works on pre element. Plugin can generate the URL hash for sharing specific line / lines. Works the same as on GitHub. Group or individual line selection.

- [Author](http://mesour.com)
- [Contact](http://mesour.com/contact)

# Basic look
![basic](http://mesour.com/images/01.png)

# Individual line selection
![basic](http://mesour.com/images/02.png)

# Group line selection
![basic](http://mesour.com/images/03.png)

# Initialization
```javascript
$(function(){
    $('pre').niceCodeLines();
});
```

# Options
```javascript
// default values
var options = {

    wrapperClass: 'nice-code-lines', // default wrapper class

    applyHashAfterReady: true, // disable auto hash using

    urlHashMatch: function() {} // called if hash in URL match

};

// apply
$('pre').niceCodeLines(options);
```

# Method - findByHash
Apply hash after 1500ms
```javascript
$('pre').niceCodeLines({
    applyHashAfterReady: false
});

setTimeout(function(){
    $('pre').niceCodeLines('findByHash');
}, 1500)
```

# Using urlHashMatch callback
Apply hash after 1500ms and change something on wrapper
```javascript
$('pre').niceCodeLines({
    applyHashAfterReady: false,
    urlHashMatch: function(instance) {
        var wrapper = $(this); // here is wrapper
        // change something on wrapper
        setTimeout(function(){
            instance.findByHash();
        }, 1500)
    }
});
```