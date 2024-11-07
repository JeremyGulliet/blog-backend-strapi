export default {
  routes: [
    {
      method: "GET",
      path: "/articles/:slug",
      handler: "api::article.article.findOne",
    },
  ],
};