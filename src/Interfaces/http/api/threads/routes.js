const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: { auth: 'forumapi_jwt' },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: (request, h) => handler.getThreadHandler(request, h),
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: (request, h) => handler.postThreadCommentHandler(request, h),
    options: { auth: 'forumapi_jwt' },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: (request, h) => handler.deleteThreadCommentHandler(request, h),
    options: { auth: 'forumapi_jwt' },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: (request, h) => handler.postReplyHandler(request, h),
    options: { auth: 'forumapi_jwt' },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: (request, h) => handler.deleteReplyHandler(request, h),
    options: { auth: 'forumapi_jwt' },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: (request, h) => handler.likeOrDislikeCommentHandler(request, h),
    options: { auth: 'forumapi_jwt' },
  },
]);

module.exports = routes;
