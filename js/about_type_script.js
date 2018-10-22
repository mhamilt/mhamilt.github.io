// JavaScript Dynamic Typing Function
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
