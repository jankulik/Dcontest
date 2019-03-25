var token;
var expiresIn;
var username;

var steemitTitle = document.getElementById("steemit_title");

var api = sc2.Initialize({
    app: 'dcontest',
    callbackURL: 'https://jankulik.github.io',
    accessToken: 'access_token',
    scope: ['vote', 'comment']
});
var authorizationLink = 'https://steemconnect.com/oauth2/authorize?client_id=dcontest&redirect_uri=https%3A%2F%2Fjankulik.github.io&scope=vote,comment';

if(localStorage.query != null)
{
	decodeQuery();
	document.getElementById("menu1").innerHTML = '<a href="https://steemit.com/@' + username + '">' + username + '</a>';
	document.getElementById("menu2").innerHTML = '<a href="https://jankulik.github.io" onclick="logOut()"> Log out </a>';

    if(username == 'dcontest')
        document.getElementById("editor").innerHTML = '<a href="https://jankulik.github.io/editor.html"> Editor </a>';
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
        
        switch(pair[0])
        {
            case 'access_token':
                token = pair[1]; break;
            case 'expires_in':
                expiresIn = pair[1]; break;
            case 'username':
                username = pair[1]; break;
        }
    }

    api.setAccessToken(token);
}

function logOut()
{
    api.revokeToken(function (err, result)
    {
        console.log(err, result);
    });

	localStorage.removeItem("query");
}

function submit()
{
    if(localStorage.query != null)
    {
        var title = document.getElementById("steemit_title").value;
        var body = document.getElementById("steemit_content").value;

        var metaTitle = document.getElementById("dcontest_title").value;
        var metaBody = document.getElementById("dcontest_content").value;

        var childPermlink = toPermlink(title);
        var tags = (document.getElementById("tags").value).split(' ');

        api.comment('', tags[0], username, childPermlink, title, body, {"tags": tags, "meta_title": metaTitle, "meta_body": metaBody}, function (err, result)
        {
            console.log(err, result);

            if(!err)
                alert('Success!');
        });
    }

    else
        alert('You are not logged in!');
}

steemitTitle.oninput = function()
{
    document.getElementById("url").innerHTML = 'https://jankulik.github.io/post.html?' + username + '/' + toPermlink(document.getElementById("steemit_title").value);
}

function toPermlink(string)
{
    return string.replace(/[^a-z0-9]+/gi, '-').replace(/^-*|-*$/g, '').toLowerCase();
}