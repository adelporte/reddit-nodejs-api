var bcrypt = require('bcrypt');
var HASH_ROUNDS = 10;

module.exports = function RedditAPI(conn) {
  return {
    createUser: function(user, callback) {

      // first we have to hash the password...
      bcrypt.hash(user.password, HASH_ROUNDS, function(err, hashedPassword) {
        if (err) {
          callback(err);
        }
        else {
          conn.query(
            'INSERT INTO `users` (`username`,`password`, `createdAt`) VALUES (?, ?, ?)', [user.username, hashedPassword, null],
            function(err, result) {
              if (err) {
                /*
                There can be many reasons why a MySQL query could fail. While many of
                them are unknown, there's a particular error about unique usernames
                which we can be more explicit about!
                */
                if (err.code === 'ER_DUP_ENTRY') {
                  callback(new Error('A user with this username already exists'));
                }
                else {
                  callback(err);
                }
              }
              else {
                /*
                Here we are INSERTing data, so the only useful thing we get back
                is the ID of the newly inserted row. Let's use it to find the user
                and return it
                */
                conn.query(
                  'SELECT `id`, `username`, `createdAt`, `updatedAt` FROM `users` WHERE `id` = ?', [result.insertId],
                  function(err, result) {
                    if (err) {
                      callback(err);
                    }
                    else {
                      /*
                      Finally! Here's what we did so far:
                      1. Hash the user's password
                      2. Insert the user in the DB
                      3a. If the insert fails, report the error to the caller
                      3b. If the insert succeeds, re-fetch the user from the DB
                      4. If the re-fetch succeeds, return the object to the caller
                      */
                      callback(null, result[0]);
                    }
                  });
              }
            });
        }
      });
    },
    createPost: function(subredditId, post, callback) {
      conn.query(`
        INSERT INTO posts 
        (userId, title, url, createdAt, subredditId) 
        VALUES (?, ?, ?, ?, ?)`, 
        [post.userId, post.title, post.url, null, subredditId],
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            /*
            Post inserted successfully. Let's use the result.insertId to retrieve
            the post and send it to the caller!
            */
            conn.query(`
              SELECT id,
              title,
              url,
              userId, 
              createdAt, 
              updatedAt,
              subredditId
              FROM posts 
              WHERE id = ?`, 
              [result.insertId],
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              });
          }
        });
    },
    getAllPosts: function(options, callback) {
      // In case we are called without an options parameter, shift all the parameters manually
      if (!callback) {
        callback = options;
        options = {};
      }
      var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;

      conn.query(`
        SELECT posts.id AS postId,
              posts.title AS postTitle,
              posts.url AS postUrl,
              posts.userId AS postUserId,
              users.id AS usersId,
              posts.createdAt AS postCreatedAt, 
              posts.updatedAt AS postUpdatedAt,
              users.username AS usersUsername,
              users.createdAt AS usersCreatedAt,
              users.updatedAt AS usersUpdatedAt,
              subreddits.id AS subredditsId,
              subreddits.name AS subredditsName,
              subreddits.description AS subredditsDescr,
              subreddits.createdAt AS subredditsCreat,
              subreddits.updatedAt AS subredditsUpdat
        FROM posts
        JOIN users
        ON users.id=posts.userId
        JOIN subreddits
        ON posts.subredditId=subreddits.id
        ORDER BY postCreatedAt DESC
        LIMIT ? OFFSET ?
        `, [limit, offset],
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            var result;
            processObjects(results, function(res) {
              result = res;
            });
            callback(null, result);
          }
        }
      );
    },
    getAllPostsForUser: function(userId, options, callback) {
      if (!callback) {
        callback = options;
        options = {};
      }
      var limit = options.numPerPage || 25; // if options.numPerPage is "falsy" then use 25
      var offset = (options.page || 0) * limit;

      conn.query(`
        SELECT title AS postTitle,
               url AS postUrl,
               createdAt AS postCreatedAt,
               updatedAt AS postUpdatedAt
        FROM posts 
        WHERE userId= ?
        ORDER BY postCreatedAt DESC
        LIMIT ? OFFSET ?`, [userId, limit, offset],
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            callback(null, results);
          }
        });
    },
    //Get a signel post
    getSinglePost: function(postId, callback) {
      conn.query(`
        SELECT title AS postTitle,
               url AS postUrl,
               createdAt AS postCreatedAt,
               updatedAt AS postUpdatedAt
               FROM posts 
               WHERE id= ?
               ORDER BY postCreatedAt DESC
               LIMIT 1`, 
               [postId],
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            callback(null, results);
          }
        });
    },
    //Add a subreddit
    createSubreddit: function(sub, callback) {
      conn.query(
        `INSERT INTO subreddits
                (name, description, createdAt)
                VALUES(?, ?)`, 
                [sub.name, sub.description, null],
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            callback(null, sub);
          }
        });
    },
    //Get all the subreddits
    getAllSubreddits: function(callback) {
      conn.query(
      `SELECT name, 
              description,
              createdAt,
              updatedAt
              FROM subreddits 
              ORDER BY createdAt DESC`,
        function(err, results) {
          if (err) {
            callback(err);
          }
          else {
            callback(null, results);
          }
        });
    },
    //Add comments
    createComment: function(comment, callback) {
      conn.query(`
        INSERT INTO comments 
        (text, userId, postId, parentId, createdAt) 
        VALUES (?, ?, ?, ?)`, 
        [comment.text, comment.userId, comment.postId, comment.parentId, null],
        function(err, result) {
          if (err) {
            callback(err);
          }
          else {
            /*
            Post inserted successfully. Let's use the result.insertId to retrieve
            the post and send it to the caller!
            */
            conn.query(`
              SELECT text,
              userId,
              postId,
              parentId, 
              createdAt, 
              updatedAt
              FROM comments`, 
              [result.insertId],
              function(err, result) {
                if (err) {
                  callback(err);
                }
                else {
                  callback(null, result[0]);
                }
              });
          }
        });
    }
    
    // getCommentsForPost: function(postId, callback) {
      
    // }

    //Closing everything      
  };

};

//Get the posts with a user object
function processObjects(results, callback) {
  var newObj = {};
  var result = [];
  results.forEach(function(ele) {
    result.push(newObj = {
      "id": ele.postId,
      "title": ele.postTitle,
      "url": ele.postUrl,
      "createdAt": ele.postCreatedAt,
      "updatedAt": ele.postUpdatedAt,
      "userId": ele.postUserId,
      "user": {
        "id": ele.usersId,
        "username": ele.usersUsername,
        "createdAt": ele.usersCreatedAt,
        "updatedAt": ele.usersUpdatedAt
      },
      "Subreddit": {
        "id": ele.subredditsId,
        "name": ele.subredditsName,
        "description": ele.subredditsDescr,
        "createdAt": ele.subredditsCreat,
        "updatedAt": ele.subredditsUpdat
      
      }
    });
  });
  callback(result);
}