const fs = require("fs");

// 1. make sure data directory exists
// if there is no data, a message will appear while data is created
// we use fs dependency from node
exports.onPreBootstrap = ({ reporter }) => {
  const contentPath = "data"; // data lives here

  if (!fs.existsSync(contentPath)) {
    reporter.info(`creating the ${contentPath} directory. . .`);
    fs.mkdirSync(contentPath); //fs creates the contentPath, so this will be loaded when site is fired up
  }
};
// 2. define event type
// do this through the sourceNodes api hook
// creating the stricture of the data to be displayed on screen
exports.sourceNodes = ({ actions }) => {
  actions.createTypes(`
    type Event implements Node @dontInfer {
      id: ID!
      name: String!
      location: String!
      startDate: Date! @dateformat @proxy(from: "start_date")
      endDate: Date! @dateformat @proxy(from: "end_date")
      url: String! 
      slug: String!
    }
  `);
};

// 3. define resolvers for any custom feeds (slug)
exports.createResolvers = ({ createResolvers }) => {
  const basePath = "/";

  const slugify = str => {
    const slug = str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    return `/${basePath}/${slug}`.replace(/\/\/+/g, "/");
  };

  createResolvers({
    Event: {
      slug: {
        resolve: source => slugify(source.name)
      }
    }
  });
};

// 4. query for events and create pages
