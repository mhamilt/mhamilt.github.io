// JavaScript Dynamic Typing Function

$("[data-typer]").attr ("data-typer", function(i, txt)
{
  var $typer = $(this),
  tot = txt.length,
  pauseMax = 300,
  pauseMin = 100,
  ch = 0,
  max = 0,
  chDel = tot,
  tempVarHere = i;

  (
    function typeIt()
    {

      if (ch > tot)
      {
        return
      }
      $typer.text(txt.substring(0, ++ch));
      setTimeout(typeIt, ~~(Math.random() * (pauseMax - pauseMin + 1) + pauseMin));
    }
    ()
  );
}
);

// (function typeIt(){…})();
// (function x(y, z)
// {
//   console.log(y + z);
// })(1, “!”);

// $("[namedAttribute]").attr ("namedAttribute",
//                             function(i, txt) // declare callback function with 2 args, why the 'i' ?
//                             {                // start defintion of lambda
//                               var variables;
//                               ( // why the start round braces before someFunc
//                                 function someFunc(/*arguements*/)
//                                  {
//                                    // somefunction definition
//                                  }
//                                  ()// why the round braces?
//                               );
//                             } // end defintion of callbackokay
//                           );  // end .attr call
