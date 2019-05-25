//logowanie steemconnect
//mozliwosc upvote
//prediction liczy sie tylko z naszej stronki
//slider do przewidywania glosu
//tabelka z delegacjami
//developed by freecrypto neavvy
//wyswietlanie komentarzy
//zarobki postow mlodszych niz tydzien
//mozliwosc upvote komentarza
//mozliwosc napisania komentarza
//powiadomienie o success
//znaczek ladowania przy guess i komentarzu
//osobny blog do hostowania tresci LUB psotowanie konkursow normalnie, ale przez strone dcontest (prawdziwy post w metadata)
//opcja edytor pojawia sie na wszystkich kartach dopiero kiedy zalogujesz sie przez dcontest
//domena

//adsense

//dobre aktualizowanie ilosci glosow i wartosci w podstronie home po upvote
//przyciski z linkami do delegacji

var numberOfPosts = 0;
var token;
var expiresIn;
var username;
var date = new Date;

var api = sc2.Initialize({
	app: 'dcontest',
	callbackURL: 'https://dcontest.org',
	accessToken: 'access_token',
	scope: ['vote', 'comment']
});
var authorizationLink = api.getLoginURL();

if(location.search.indexOf('?') != -1)
{
	localStorage.query = location.search.substring(1);
	localStorage.time = date.getTime();
}


if(localStorage.query != null)
{
	if((date.getTime() - localStorage.time) / 1000 < 120)
	{
		decodeQuery();
		document.getElementById("menu1").innerHTML = '<a href="https://steemit.com/@' + username + '">' + username + '</a>';
		document.getElementById("menu2").innerHTML = '<a href="https://dcontest.org" onclick="logOut()"> Log out </a>';

		if(username == 'dcontest')
			document.getElementById("editor").innerHTML = '<a href="https://dcontest.org/editor.html"> Editor </a>';
	}

	else
		logOut();
}

if(localStorage.query == null)
{
	document.getElementById("menu1").innerHTML = '<a href=' + authorizationLink + '> Log In </a>';
	document.getElementById("menu2").innerHTML = '<a href="https://signup.steemit.com"> Register </a>';
}

function loadPosts(loadNew, votingIndex, votedIndex)
{
	if(loadNew) numberOfPosts += 7;
	
	steem.api.getDiscussionsByBlog({tag: 'dcontest', limit: numberOfPosts}, function(err, posts) 
	{
		var payload = '';

		for(var i = 0; i < posts.length; i++)
		{
			var title = posts[i].title;
			if(posts[i].json_metadata !== '')
			{
				if(JSON.parse(posts[i].json_metadata).meta_title !== undefined)
					title = JSON.parse(posts[i].json_metadata).meta_title;
			}

			var comments = posts[i].children;
			var votes = posts[i].active_votes.length;

			var date = new Date(posts[i].created);
			var day = date.getDate();
			var month;
			var year = date.getFullYear();

			var author = posts[i].author;
			var permlink = posts[i].permlink;

			var body = posts[i].body;
			if(posts[i].json_metadata !== '')
			{
				if(JSON.parse(posts[i].json_metadata).meta_body !== undefined)
					body = JSON.parse(posts[i].json_metadata).meta_body;
			}

			var payout;
			if(posts[i].last_payout[0] == '1')
				payout = (parseFloat(posts[i].pending_payout_value.split(' ')[0])).toFixed(2);
			else
				payout = (parseFloat(posts[i].total_payout_value.split(' ')[0]) + parseFloat(posts[i].curator_payout_value.split(' ')[0])).toFixed(2);

			var image = '<img src="img/upvote.png" alt="upvote image" width="20" height="20">';
			for(var j = 0; j < posts[i].active_votes.length; j++)
			{
				if(posts[i].active_votes[j].voter == username)
				{
					image = '<img src="img/upvoted.png" alt="upvoted image" width="20" height="20">';
				}
			}

			if(i == votingIndex) image = '<img src="img/loading.gif" alt="loading image" width="20" height="20">';
			if(i == votedIndex) image = '<img src="img/upvoted.png" alt="upvoted image" width="20" height="20">';

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
		    var payoutPayload = '<a href="#" onclick={loadPosts(false,' + i + ',-1);vote("' + author + '","' + permlink + '",' + i + ');return(false);} style="text-decoration:none">' + image + '</a>' + '&nbsp;' + votes + '&emsp;' + '$' + payout + '&emsp;' + '<img src="img/chat.png" alt="chat image" align="middle" width="17" height="19">' + ' ' + comments;
		    
			payload += '<div class="post-preview"> </div>';
			payload += '<a href="post.html?' + author + '/' + permlink + '"> <h2 class="post-title">' + title + '</h2> </a> <p class="post-meta"> <span style="text-align:left;">' + datePayload + '</span> <span style="float:right;">' + payoutPayload + '</span> </p>';
			payload += '<hr>';
		}

		document.getElementById("feed").innerHTML = payload;

		steem.api.getDiscussionsByBlog({tag: 'dcontest', limit: numberOfPosts + 1}, function(err, postsBuffor) 
		{
			if(postsBuffor.length > posts.length)
			{
				document.getElementById("pager").innerHTML = '<li class="next"> <a href="#" onclick={loadPosts(true,-1,-1);return(false);}> Older Posts &darr; </a> </li>';
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
	api.revokeToken(function (err, result)
	{
  		console.log(err, result);
	});

	localStorage.removeItem("query");
	localStorage.removeItem("time");
}

function vote(author, permlink, index)
{
	if(localStorage.query != null)
	{
		api.vote(username, author, permlink, 10000, function (err, result)
		{
	    	if(err)
	    		alert('Something went wrong.');

	    	else
	    		loadPosts(false, -1, index);
		});
	}

	else
		alert('You are not logged in!');
}