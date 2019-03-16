var querystring = location.search;
var author = querystring.split('/')[0];
author = author.slice(1, author.length);
var permlink = querystring.split('/')[1];

var token;
var expiresIn;
var username;

var api = sc2.Initialize({
	app: 'pieniazek',
	callbackURL: 'https://jankulik.github.io',
	accessToken: 'access_token',
	scope: ['vote', 'comment']
});
var authorizationLink = 'https://steemconnect.com/oauth2/authorize?client_id=pieniazek&redirect_uri=https%3A%2F%2Fjankulik.github.io&scope=vote,comment';

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

function loadPost(voting, voted)
{
	steem.api.getContent(author, permlink, function(err, content)
	{
		var title = content.title;
		var converter = new showdown.Converter(),
		html = converter.makeHtml(content.body);

		var image = '<img src="img/upvote.png" alt="upvote image" width="20" height="20">';
		for(var i = 0; i < content.active_votes.length; i++)
		{
			if(content.active_votes[i].voter == username)
			{
				image = '<img src="img/upvoted.png" alt="upvoted image" width="20" height="20">';
			}
		}
		if (voting == true) image = '<img src="img/loading.gif" alt="upvoted image" width="20" height="20">';
		if(voted == true) image = '<img src="img/upvoted.png" alt="upvoted image" width="20" height="20">';

		var payout = (parseFloat(content.total_payout_value.split(' ')[0]) + parseFloat(content.curator_payout_value.split(' ')[0])).toFixed(2);
		var comments = content.children;
		var votes = content.active_votes.length;
		var payoutPayload = '<a href="#" onclick={loadPost(true,false);vote();return(false);} style="text-decoration:none">' + image + '</a>' + '&nbsp;' + votes + '&emsp;' + '$' + payout + '&emsp;' + '<img src="img/chat.png" alt="chat image" align="middle" width="17" height="19">' + ' ' + comments;


		var date = new Date(content.created);
		var day = date.getDate();
		var month;
		var year = date.getFullYear();

		switch(date.getMonth())
		{
			case 0:
				month = "January"; break;
			case 1:
				month = "February"; break;
			case 2:
				month = "March"; break;
			case 3:
				month = "April"; break;
			case 4:
				month = "May"; break;
			case 5:
				month = "June"; break;
			case 6:
				month = "July"; break;
			case 7:
				month = "August"; break;
			case 8:
				month = "September"; break;
			case 9:
				month = "October"; break;
			case 10:
				month = "November"; break;
			case 11:
				month = "December"; break;
		}

		var url = 'https://steemit.com/@' + author;
		var meta = 'Posted by <a href=' + url + '> @' + author + '</a> on ' + month + ' ' + day + ',' + ' ' + year;

		document.getElementById("title").innerHTML = title;
		document.getElementById("meta").innerHTML = meta;
		document.getElementById("body").innerHTML = html;
		document.getElementById("payout").innerHTML = payoutPayload;
	});
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
	localStorage.removeItem("query");
}

function vote()
{
	if(localStorage.query != null)
	{
		api.vote(username, author, permlink, 10000, function (err, result)
		{
	    	console.log(err, result);

	    	if(result.result.expired == false)
	    	{
	    		loadPost(false, true);
	    	}
		});
	}

	else
	{
		console.log('You are not logged!');
	}
}

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = '$ ' + slider.value/10;

slider.oninput = function()
{
  output.innerHTML = '$ ' + this.value/10;
}

function makeGuess()
{
	var childPermlink = steem.formatter.commentPermlink(author, permlink);
	api.comment(author, permlink, username, childPermlink, '', 'test', {"app":"dcontest"}, function (err, res)
	{
		console.log(err, res)
	});
}


steem.api.getContentReplies(author, permlink, function(err, replies)
{
	var payload = '';

	for(var i = 0; i < replies.length; i++)
	{
		payload += replies[i].author + '|' + replies[i].body;
		payload += '\n';
	}

	document.getElementById("comments").innerHTML = payload;
});

/*
var names = ['neavvy']
steem.api.getAccounts(names, function(err, result) 
{
	var object = JSON.parse(result[0].json_metadata);
	console.log(object.profile.profile_image);
});
*/

//linki do nazw userow
//poprawne wyświetlanie linkow do stron
//czemu nie wspiera calego markdown (tabelki etc)