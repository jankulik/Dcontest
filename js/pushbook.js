var date = new Date;

var numberOfPosts = 0;
var username;
var authorizationLink = 'https://steemconnect.com/oauth2/authorize?client_id=dcontest&redirect_uri=https%3A%2F%2Fdcontest.org&scope=vote,comment';

if(localStorage.query != null)
{
    if((date.getTime() - localStorage.time) / 1000 < 604000)
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
    
    steem.api.getDiscussionsByFeed({tag: 'nathanmars', limit: numberOfPosts}, function(err, posts) 
    {
        var payload = '';

        for(var i = 0; i < posts.length; i++)
        {
            var title = posts[i].title;
            var mainImage = '';
            if(posts[i].json_metadata !== '')
            {
                if(JSON.parse(posts[i].json_metadata).meta_title !== undefined)
                    title = JSON.parse(posts[i].json_metadata).meta_title;

                if(JSON.parse(posts[i].json_metadata).image !== undefined)
                    mainImage = JSON.parse(posts[i].json_metadata).image[0];
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

            var imagePayload = '';
            if(mainImage !== '')
                imagePayload = '<img src="' + mainImage + '" alt="main_image" align="center">';

            var url = 'https://steemit.com/@' + author;
            var datePayload = 'Posted by ' + '<a style="text-decoration:none" href=' + url + '>' + '@' + author + '</a>' + ' on ' + month + ' ' + day + ',' + ' ' + year;
            var payoutPayload = '<a href="#" onclick={loadPosts(false,' + i + ',-1);vote("' + author + '","' + permlink + '",' + i + ');return(false);} style="text-decoration:none">' + image + '</a>' + '&nbsp;' + votes + '&emsp;' + '$' + payout + '&emsp;' + '<img src="img/chat.png" alt="chat image" align="middle" width="17" height="19">' + ' ' + comments;
            
            payload += '<div class="post-preview"> </div>';
            payload += '<a href="post.html?' + author + '/' + permlink + '"> <h2 class="post-title">' + title + '</h2> </a>' + imagePayload + '<p class="post-meta"> <span style="text-align:left;">' + datePayload + '</span> <span style="float:right;">' + payoutPayload + '</span> </p>';
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
        
        if(pair[0] == 'username')
        	username = pair[1];
    }
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