var converter = new showdown.Converter();
converter.setOption('simplifiedAutoLink', true);
converter.setOption('tables', true);
converter.setOption('ghMentions', true);
converter.setOption('ghMentionsLink', 'https://steemit.com/@{u}');

var querystring = location.search;
var author = querystring.split('/')[0];
author = author.slice(1, author.length);
var permlink = querystring.split('/')[1];

var token;
var expiresIn;
var username;

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
		var html = converter.makeHtml(content.body);

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

var sliderValue = 0;

slider.oninput = function()
{
  output.innerHTML = '$ ' + this.value/10;
  sliderValue = '$ ' + this.value/10;
}

function makeGuess()
{
	var childPermlink = steem.formatter.commentPermlink(author, permlink);
	api.comment(author, permlink, username, childPermlink, '', sliderValue, {"app":"dcontest"}, function (err, res)
	{
		console.log(err, res)
	});
}

document.getElementById("comments").innerHTML = '<div id="' + permlink + '"> </div>';
getReplies(author, permlink);

function renderComment(comment, profileImage)
{
	var id = comment.id;
	var author = comment.author;
	var reputation = Math.round(((Math.log10(comment.author_reputation) - 9) * 9) + 25);
	var permlink = comment.permlink;
	var body = converter.makeHtml(comment.body);

	var metadata = '';
	if(comment.json_metadata !== '')
		metadata = JSON.parse(comment.json_metadata);

	var dapp = '';
	if(metadata.app == 'dcontest')
		dapp = '<img src="img/dapp.png" alt="image" style="width:108px;height:20px;">';

	var commentHtml = `
			<li style="max-width:600px;">
				<img src="${profileImage}" class="profile-image" alt="image" style="width:50px;height:50px;">

			 	<div class="comment-header">
					<a style="font-weight: bold;" href="https://steemit.com/@${author}"> ${author} </a>
					<span> (${reputation}) &emsp; </span>
					${dapp}
				</div> 

				<div class="comment-content">
					${body}
				</div>
				<hr>
				<ul id=${permlink}> </ul>
			</li>`;

	return commentHtml;
}

function getReplies(author, permlink)
{
	steem.api.getContentReplies(author, permlink, function(err, result)
	{
		console.log(result);
		var authors = [];
		for(var i = 0; i < result.length; i++)
			authors.push(result[i].author);
	
		steem.api.getAccounts(authors, function(err, accounts)
		{
			var comments = '';
			for(var i = 0; i < result.length; i++)
			{
				var image;
				if(JSON.parse(accounts[i].json_metadata).profile !== undefined)
				{
					if(JSON.parse(accounts[i].json_metadata).profile.profile_image !== undefined)
						image = JSON.parse(accounts[i].json_metadata).profile.profile_image;
				}
				else
					image = 'img/profile_image.png';

				comments += renderComment(result[i], image);
			}

			document.getElementById(permlink).innerHTML = comments;

			for(var i = 0; i < result.length; i++)
			{
				if(result[i].children > 0)
				{
					getReplies(result[i].author, result[i].permlink);
				}
			}
		});
	});
}