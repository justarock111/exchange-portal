    var disqus_config = function () {
        var url = $('.page-url').attr('data-test-value');
        this.page.url = url;  // Replace PAGE_URL with your page's canonical URL variable
        this.page.identifier = url; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };

   (function() { // DON'T EDIT BELOW THIS LINE
    var d = $(document)[0], s = d.createElement('script');
    console.log('ELEMENT D IS: ');
    console.log(d);
    s.src = 'https://nusexchange.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();