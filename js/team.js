var username;
var authorizationLink = 'https://steemconnect.com/oauth2/authorize?client_id=dcontest&redirect_uri=https%3A%2F%2Fjankulik.github.io&scope=vote,comment';

if(localStorage.query != null)
{
	decodeQuery();
	document.getElementById("menu1").innerHTML = '<a href="https://steemit.com/@' + username + '">' + username + '</a>';
	document.getElementById("menu2").innerHTML = '<a href="https://jankulik.github.io" onclick="logOut()"> Log out </a>';
}

if(localStorage.query == null)
{
	document.getElementById("menu1").innerHTML = '<a href=' + authorizationLink + '> Log In </a>';
	document.getElementById("menu2").innerHTML = '<a href="https://signup.steemit.com"> Register </a>';
}

function decodeQuery()
{
    var parameters = localStorage.query.split('&');
    for (var i = 0; i < parameters.length; i++)
    {
        var pair = parameters[i].split('=');
        
        if(pair[0] == 'username')
        	username = pair[1];
    }
}

function logOut()
{
	localStorage.removeItem("query");
}