//logowanie steemconnect
//mozliwosc upvote

//upvote liczy sie tylko z naszej stronki
//mozliwosc napisania komentarza
//wyswietlanie komentarzy
//slider do przewidywania glosu
//adsense
//tabelka z delegacjami
//developed by freecrypto neavvy

var numberOfPosts = 0;
var token;
var expiresIn;
var username;

var api = sc2.Initialize({
	app: 'pieniazek',
	callbackURL: 'https://jankulik.github.io',
	accessToken: 'access_token',
	scope: ['vote', 'comment']
});
var authorizationLink = api.getLoginURL();

if(location.search.indexOf('?') != -1)
{
	localStorage.query = location.search.substring(1);
}

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

function loadPosts(loadNew, votingIndex)
{
	if(loadNew) numberOfPosts += 7;
	
	steem.api.getDiscussionsByBlog({tag: 'dcontest', limit: numberOfPosts}, function(err, posts) 
	{
		//total_payout_value + curator_payout_value > 7
		//pending_payout_value < 7

		var payload = '';

		for(var i = 0; i < posts.length; i++)
		{
			var title = posts[i].title;
			var payout = (parseFloat(posts[i].total_payout_value.split(' ')[0]) + parseFloat(posts[i].curator_payout_value.split(' ')[0])).toFixed(2);
			var comments = posts[i].children;
			var votes = posts[i].active_votes.length;

			var date = new Date(posts[i].created);
			var day = date.getDate();
			var month;
			var year = date.getFullYear();

			var author = posts[i].author;
			var permlink = posts[i].permlink;
			var body = posts[i].body;

			var image = '<img src="img/upvote.png" alt="upvote image" width="20" height="20">';
			for(var j = 0; j < posts[i].active_votes.length; j++)
			{
				if(posts[i].active_votes[j].voter == username)
				{
					image = '<img src="img/upvoted.png" alt="upvoted image" width="20" height="20">';
				}
			}

			if(i == votingIndex) image = '<span class="lds-dual-ring"> </span>';

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
		    var datePayload = 'Posted by ' + '<a style="text-decoration:none" href=' + url + '>' + '@' + author + '</a>' + ' on ' + month + ' ' + day + ',' + ' ' + year;
		    var payoutPayload = '<a href="#" onclick={loadPosts(0,' + i + ');vote("' + author + '","' + permlink + '");return(false);} style="text-decoration:none">' + image + '</a>' + '&nbsp;' + votes + '&emsp;' + '$' + payout + '&emsp;' + '<img src="img/chat.png" alt="chat image" align="middle" width="17" height="19">' + ' ' + comments;
		    
		    payload += '<div class="post-preview"> </div>';
		    payload += '<a href="post.html?' + author + '/' + permlink + '"> <h2 class="post-title">' + title + '</h2> </a> <p class="post-meta"> <span style="text-align:left;">' + datePayload + '</span> <span style="float:right;">' + payoutPayload + '</span> </p>';
		    payload += '<hr>';
		}

		document.getElementById("feed").innerHTML = payload;

		steem.api.getDiscussionsByBlog({tag: 'dcontest', limit: numberOfPosts + 1}, function(err, postsBuffor) 
		{
			if(postsBuffor.length > posts.length)
			{
				document.getElementById("pager").innerHTML = '<li class="next"> <a href="#" onclick={loadPosts(1,-1);return(false);}> Older Posts &darr; </a> </li>';
			}
			else
			{
				document.getElementById("pager").innerHTML = null;
			}
		});
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

function vote(author, permlink)
{
	if(localStorage.query != null)
	{
		api.vote(username, author, permlink, 10000, function (err, result)
		{
	    	console.log(err, result);

	    	if(result)
	    	{
	    		setTimeout(function(){ loadPosts(0, -1); }, 1000);
	    	}
		});
	}

	else
	{
		console.log('You are not logged!');
	}
}