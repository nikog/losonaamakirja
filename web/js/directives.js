'use strict';

/* Directives */

angular.module('losofacebook.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
  }]);


angular.module('losofacebook.directives', []).directive('onEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.onEnter);
                });

                event.preventDefault();
            }
        });
    };
});

angular.module('losofacebook.directives', [])
    .directive('lbFriends', function factory() {

        var directiveDefinitionObject = {

            restrict: 'E',
            templateUrl: '/views/directives/friends.html',
            replace: true,

            scope: {
                'friends': '=friends'
            },

            link: function postLink(scope, element, attrs) {



            }
        };

        return directiveDefinitionObject;
    })
    .directive('lbWall', function factory(Post, Comment, currentUser) {

        var directiveDefinitionObject = {

            restrict: 'E',
            templateUrl: '/views/directives/posts.html',
            replace: true,

            scope: {
                'person': '=person'
            },

            link: function (scope, element, attrs) {

                scope.doPost = function(person, post) {

                    var post = new Post({
                        'personId': person.id,
                        'content': post,
                        'poster': currentUser,
                        'comments': []
                    });
                    post.$save();

                    scope.posts.unshift(post);
                    this.post = '';

                };

                scope.postComment = function(post, comment) {
                    var comment = new Comment({
                        'postId': post.id,
                        'content': comment,
                        'poster': currentUser
                    });

                    post.comments.push(comment);
                    comment.$save();
                    this.comment = '';
                }

                scope.$watch('person', function(person) {
                    if (person && person.id) {
                        Post.query({ 'person': person.id }, function(posts) {
                            scope.posts = posts;
                        });
                    }
                }, true);
                
                scope.fetchPosts = function() {
                    Post.query(
                    {
                        'person': scope.person.id,
                        'page' : ++scope.page,
                        'limit' : scope.limit
                    }, function(posts) {
                        console.log(posts);

                        scope.posts = scope.posts.concat(posts);
                    });
                }
                
                scope.limit = 1;
                scope.page = 0;
                
                $(window).on('scroll', function() {
                    if($(window).scrollTop() + $(window).height() >= $(document).height()) {
                        scope.fetchPosts();
                    } 
                });

            }
        };

        return directiveDefinitionObject;
    })


;

