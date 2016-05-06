// external modules
var mysql = require('mysql');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var bcrypt = require('bcrypt');
var HASH_ROUNDS = 10;
var cookieParser = require('cookie-parser');
var React = require('react');
var ReactDOM = require('react-dom');

app.use(express.static('public'));

//our module
var reddit = require('./reddit-week4.js');

//Bordy-cookie parser
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(checkIfLoginToken);

// create a connection
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'adelporte',
  password: '',
  database: 'reddit'
});

var redditAPI = reddit(connection);

//The homepage
app.get('/', function(request, result) {
  redditAPI.getPostsHomepage(function(err, res) {
    if (err) {
      res.status(500).send('oops try again later!');
    }
    else {
      var newArray = res.map(function(obj) {
        return `
      <li class="content-item">
            <h2 class="content-item__title">
              <a href=${obj.url}>${obj.title}</a>
            </h2>
            <p>Votescore: ${obj.votescore}</p>
            <p>Created by ${obj.user.username}</p>
      </li>
      <form action="/vote" method="post">
        <input type="hidden" name="vote" value="1">
        <input type="hidden" name="postId" value=${obj.id}>
        <button type="submit">Upvote this</button>
      </form>
      <form action="/vote" method="post">
        <input type="hidden" name="vote" value="-1">
        <input type="hidden" name="postId" value=${obj.id}>
        <button type="submit">Downvote this</button>
      </form>
      <form action="/comment" method="post">
        <input type="text" name="comment" placeholder="Your comment">
        <input type="hidden" name="postId" value=${obj.id}>
        <button type="submit">React to that post</button>
      </form>`;
      });
      result.send(`
      <html>
        <header>
          <title='Reddit | The World's Biggest Forum'</title>
          <img src="https://www.redditstatic.com/about/assets/reddit-logo.png" height="50px">
          <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/sign-up">Sign-Up</a></li>
              <li><a href="create-post">Create a post</a></li>
          </ul>
        </header>
          <div id="contents">
            <h1>The Lastest Posts</h1>
              <ul>
              <li><a href="/sort/hot">Hotest posts</a></li>
              <li><a href="/sort/createdAt">Latest posts</a></li>
              <li><a href="/sort/top">Top posts</a></li>
              </ul>
              <ul class="contents-list">
                ${newArray.join('')}
              </ul>
          </div>
      </html>
    `);
    }
  });
});

//The sorted homepage
app.get('/sort/:sort', function(request, result) {
  var resObj;
    redditAPI.getSortedPostsHomepage(request.params.sort, function(err, res) {
      if (err) {
        res.status(500).send('oops try again later!');
      }
      else {
        resObj = res;
        var newArray = resObj.map(function(obj) {
          return `
      <li class="content-item">
            <h2 class="content-item__title">
              <a href=${obj.url}>${obj.title}</a>
            </h2>
            <p>Votescore: ${obj.vote}</p>
            <p>Created by ${obj.username}</p>
      </li>
      <form action="/vote" method="post">
        <input type="hidden" name="vote" value="1">
        <input type="hidden" name="postId" value=${obj.id}>
        <button type="submit">Upvote this</button>
      </form>
      <form action="/vote" method="post">
        <input type="hidden" name="vote" value="-1">
        <input type="hidden" name="postId" value=${obj.id}>
        <button type="submit">Downvote this</button>
      </form>
      <form action="/comment" method="post">
        <input type="text" name="comment" placeholder="Your comment">
        <input type="hidden" name="postId" value=${obj.id}>
        <button type="submit">React to that post</button>
      </form>`;
      });
      result.send(`
      <html>
        <header>
          <img src="https://www.redditstatic.com/about/assets/reddit-logo.png" height="50px">
          <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/sign-up">Sign-Up</a></li>
              <li><a href="create-post">Create a post</a></li>
          </ul>
        </header>
          <div id="contents">
            <h1>Sorted by: ${request.params.sort}</h1>
              <ul>
              <li><a href="/sort/hotness">Hotest posts</a></li>
              <li><a href="/sort/createdAt">Latest posts</a></li>
              <li><a href="/sort/top">Top posts</a></li>
              </ul>
              <ul class="contents-list">
                ${newArray.join('')}
              </ul>
          </div>
      </html>
          `);
      }
    });
});

//The signup page
app.get('/sign-up', function(request, response) {
  response.sendFile(path.join(__dirname + '/sign-up.html'));
});

app.post('/sign-up', function(request, response) {
  var user = {
    username: request.body.username,
    password: request.body.password
  };
  redditAPI.createUser(user, function(err, res) {
    if (err) {
      response.status(500).send('oops try again later!');
    }
    else {
      response.redirect('/login');
    }
  });
});

//The login page
app.get('/login', function(request, response) {
  response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/login', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;
  redditAPI.checkLogin(username, function(err, result) {
  bcrypt.compare(password, result.password, function(err, res) {
      if (res) {
        redditAPI.createASession(result.userId, function(err, token) {
          response.cookie('session', token);
          response.redirect('/');
        });
      } else {
        //HANDLE ERROR
      }
    });
  });
});

//The create post page
app.get('/create-post', function(request, response) {
  response.sendFile(path.join(__dirname + '/create-post.html'));
});

app.post('/create-post', function(request, response) {
  //Checking if the user is logged in
  if (!request.loggedInUser) {
    response.status(401).send('You must be logged in to publish a post');
  } else {
  var post = {
    title: request.body.title,
    url: request.body.url,
    userId: request.loggedInUser
  };
  redditAPI.createPost(1, post, function(err, res) {
    if (err) {
      response.status(500).send('oops try again later!');
    }
    else {
      response.redirect('/');
    }
  });
  }
});

//Check logins
function checkIfLoginToken(request, response, next) {
  if(request.cookies.session) {
    redditAPI.getUserFromSession(request.cookies.session, function(err, user) {
      if(err) {
        //Add
      } else {
        if(user) {
          request.loggedInUser = user;
        }
        next();
      }});
  } else {
    next();
  }
}

//Votes
app.post('/vote', function(request, response) {
  if (!request.loggedInUser) {
    response.status(401).send('You must be logged in to publish a post');
  } else {
    var newObj = {
      vote: request.body.vote,
      postId: request.body.postId,
      userId: request.loggedInUser
    };
    redditAPI.createOrUpdateVote(newObj, function(err, result) {
      if(err) {
        response.status(500).send('oops try again later!');
      } else {
        response.redirect('/');
      }
    });
  }
});

//Create a comment
app.post('/comment', function(request, response) {
  //Checking if the user is logged in
  if (!request.loggedInUser) {
    response.status(401).send('You must be logged in to publish a post');
  } else {
  var comment = {
    text: request.body.comment,
    postId: request.body.postId,
    userId: request.loggedInUser
  };
  redditAPI.createComment(comment, function(err, res) {
    if (err) {
      response.status(500).send('oops try again later!');
    }
    else {
      response.redirect('/');
    }
  });
  }
});

function createHead(content) {
  
}

/* YOU DON'T HAVE TO CHANGE ANYTHING BELOW THIS LINE :) */

// Boilerplate code to start up the web server
var server = app.listen(process.env.PORT, process.env.IP, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// app.get('/test', function(request, response) {
//   redditAPI.createOrUpdateVote({postId:1, userId:1, vote:0}, function(err, result) {
//   console.log(err);
//   console.log(result);
// })
// });