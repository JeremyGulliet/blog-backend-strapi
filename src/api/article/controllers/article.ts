/**
 *  article controller
 */

import { factories } from "@strapi/strapi";
import author from "../../author/controllers/author";
import category from "../../category/controllers/category";
import comment from "../../comment/controllers/comment";

export default factories.createCoreController(
  "api::article.article",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { slug } = ctx.params;

      const entity = await strapi.db.query("api::article.article").findOne({
        where: { slug },
        populate: {
          cover: {
            fields: ["url", "alternativeText", "width", "height"],
          },
          author: { fields: ["name", "email"] },
          category: { fields: ["name"] },
          comments: { fields: ["content", "author"] },
          content: {
            populate: {
              children: {
                fields: ["type", "text"],
              },
              image: {
                fields: [
                  "name",
                  "alternativeText",
                  "url",
                  "caption",
                  "width",
                  "height",
                  "formats",
                ],
              },
            },
          },
        },
      });

      if (!entity || entity.length === 0) {
        return ctx.notFound("Article not found");
      }
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

      return this.transformResponse(sanitizedEntity);
    },
  })
);
