
for (var x in menu) {
  var mi = document.createElement('div');
  mi.className = 'rc_menuitem';
  mi.id = x;
  //mi.onclick = function() { eval(menu[x]) };
  //mi.addEventListener( 'click', function() { eval(menu[x]) });
  mi.innerHTML = x;
  document.getElementById('rc_menu').appendChild(mi);
  $('#' + x).attr('onclick',menu[x])
//  $('.rc_menu').append('<div class="rc_menuitem" id="' + x + '" onclick="' + menu[x] + '">' + x + '</div>');
}

