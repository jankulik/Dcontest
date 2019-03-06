//logowanie steemconnect
//wyswietlanie komentarzy
//mozliwosc upvote
//mozliwosc napisania komentarza
//slider do przewidywania glosu
//adsense
//tabelka z delegacjami

import sc2 from 'steemconnect';

var numberOfPosts = 0;
var token;
var expiresIn;
var username;

console.log("naj");

var api = sc2.Initialize({
  app: 'pieniazek',
  callbackURL: 'https://jankulik.github.io',
  accessToken: 'access_token',
  scope: ['login', 'offline', 'delete_comment', 'custom_json', 'comment_options', 'vote', 'comment', 'claim_reward_balance']
});
var link = api.getLoginURL();

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
	document.getElementById("menu1").innerHTML = '<a href=' + link + '> Log In </a>';
	document.getElementById("menu2").innerHTML = '<a href="https://signup.steemit.com"> Register </a>';
}

function loadPosts()
{
	numberOfPosts += 7;
	
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

			var date = new Date(posts[i].created);
			var day = date.getDate();
			var month;
			var year = date.getFullYear();

			var author = posts[i].author;
			var permlink = posts[i].permlink;
			var body = posts[i].body;

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
		    var payoutPayload = '$' + payout + '&emsp;' + '<img src="img/chat.png" alt="chat image" align="middle" width="15" height="17">' + ' ' + comments;
		    
		    payload += '<div class="post-preview"> </div>';
		    payload += '<a href="post.html?' + author + '/' + permlink + '"> <h2 class="post-title">' + title + '</h2> </a> <p class="post-meta"> <span style="text-align:left;">' + datePayload + '</span> <span style="float:right;">' + payoutPayload + '</span> </p>';
		    payload += '<hr>';
		}

		document.getElementById("feed").innerHTML = payload;

		steem.api.getDiscussionsByBlog({tag: 'dcontest', limit: numberOfPosts + 1}, function(err, postsBuffor) 
		{
			if(postsBuffor.length > posts.length)
			{
				document.getElementById("pager").innerHTML = '<li class="next"> <a href="javascript:;" onclick="loadPosts()"> Older Posts &darr; </a> </li>';
			}
			else
			{
				document.getElementById("pager").innerHTML = '';
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
}

function logOut()
{
	localStorage.removeItem("query");
}

console.log(token);
console.log(username);

api.setAccessToken(token);

api.me(function (err, result) {
        console.log('/me', err, result);
});

api.vote(username, 'neavvy', 'our-fear-of-artificial-intelligence-is-it-reasoned', 5000, function (err, result) {
    console.log(err, result);
});