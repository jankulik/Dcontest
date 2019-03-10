var querystring = location.search;
var author = querystring.split('/')[0];
author = author.slice(1, author.length);
var permlink = querystring.split('/')[1];

steem.api.getContent(author, permlink, function(err, content)
{
	var title = content.title;
	var converter = new showdown.Converter(),
	html = converter.makeHtml(content.body);

	var payout = (parseFloat(content.total_payout_value.split(' ')[0]) + parseFloat(content.curator_payout_value.split(' ')[0])).toFixed(2);
	var comments = content.children;
	var votes = content.active_votes.length;
	var payoutPayload = '<a href="https://jankulik.github.io" style="text-decoration:none"> <img src="img/upvote.png" alt="upvote image" width="20" height="20"> </a>' + votes + '&emsp;' + '$' + payout + '&emsp;' + '<img src="img/chat.png" alt="chat image" align="middle" width="17" height="19">' + ' ' + comments;


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

steem.api.getContentReplies(author, permlink, function(err, replies)
{
	console.log(replies);

	var payload = '';

	for(var i = 0; i < replies.length; i++)
	{
		payload += replies[i].author;
		payload += '\n';
	}

	document.getElementById("comments").innerHTML = payload;
});

var names = ['neavvy']
steem.api.getAccounts(names, function(err, result) 
{
	var object = JSON.parse(result[0].json_metadata);
	console.log(object.profile.profile_image);
});

//linki do nazw userow
//poprawne wyświetlanie linkow do stron
//czemu nie wspiera calego markdown (tabelki etc)