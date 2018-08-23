---
layout: page
title: About
permalink: /about/
---
<h1 class="type-text"></h1>

<script>
var cursors = ["$", "£", "&", '%', '@', '€', '±', '§', '~', '*'];
$( function() {
  $( '.type-text' ).teletype( {
    text: [ 'josh lyell loves bubbles' ],
    typeDelay: 0,
    backDelay: 20,

    callbackType: function( letter, current, teletype )
    {
      teletype.setCursor( cursors[~~(Math.random() * 10)] );
    }

  } );
} );
</script>
