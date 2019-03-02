var querystring = location.search;
var author = querystring.split('/')[0];
author = author.slice(1, author.length);
var permlink = querystring.split('/')[1];

console.log(author);
console.log(permlink);

steem.api.getContent(author, permlink, function(err, content)
{
	var title = content.title;
	var converter = new showdown.Converter(),
	html = converter.makeHtml(content.body);

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
});

//linki do nazw userow
//poprawne wyświetlanie linkow do stron
//czemu nie wspiera calego markdown (tabelki etc)