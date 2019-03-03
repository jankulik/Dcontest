//logowanie steemconnect
//wyswietlanie komentarzy
//mozliwosc upvote
//mozliwosc napisania komentarza
//slider do przewidywania glosu
//adsense
//tabelka z delegacjami

var numberOfPosts = 0;

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
				document.getElementById("pager").innerHTML = ' ';
			}
		});
	});
}

if(location.search != '')
{
	localStorage.setItem("querystring", location.search);
}

console.log(localStorage.getItem("querystring"));