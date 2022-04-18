var forms = document.getElementsByTagName('form');
for (var i = 0; i < forms.length; i++) {
    var form = forms[i];
    var inputs = form.querySelectorAll("input[type=password]");
    for (var j = 0; j < inputs.length; j++) {
        var input = inputs[j];
        var button = document.createElement('a');
        button.innerText = 'My Button';
        button.id = "ext-button" ;
        input.parentNode.insertBefore(button, input.nextSibling);
    }
}

// 
// document.getElementsByClassName('btn-primary')[0].addEventListener('click', function() {
//   alert("pressed");
// })
// // if(document.getElementById('ext-button')) {
//   alert("found");
//   document.getElementById('ext-button').addEventListener('click', function() {
//     alert("Clicked");
//   });
//
// }
