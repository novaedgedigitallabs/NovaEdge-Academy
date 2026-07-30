const Blog = require("../models/Blog");
const Course = require("../models/Course");
const { broadcastPushToSegment } = require("../utils/webPush");

/**
 * Generate RSS 2.0 XML Feed for NovaEdge Academy Content
 */
exports.getRssFeed = async (req, res) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "https://novaedge.in";

    // Fetch latest published blogs and courses
    const blogs = await Blog.find({ status: "published" })
      .sort({ createdAt: -1 })
      .limit(20);

    const courses = await Course.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .limit(10);

    let itemsXml = "";

    // Add blogs to RSS
    blogs.forEach((blog) => {
      const pubDate = new Date(blog.createdAt).toUTCString();
      const link = `${frontendUrl}/blogs/${blog.slug || blog._id}`;
      const description = blog.excerpt || (blog.content ? blog.content.substring(0, 250) : "") + "...";

      itemsXml += `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      <category><![CDATA[${blog.category || "Article"}]]></category>
    </item>`;
    });

    // Add courses to RSS
    courses.forEach((course) => {
      const pubDate = new Date(course.createdAt).toUTCString();
      const link = `${frontendUrl}/courses/${course._id}`;
      const description = course.description || "Explore this new course at NovaEdge Academy!";

      itemsXml += `
    <item>
      <title><![CDATA[Course: ${course.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      <category><![CDATA[Course]]></category>
    </item>`;
    });

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NovaEdge Academy Updates &amp; Articles</title>
    <link>${frontendUrl}</link>
    <description>Empowering learners with cutting-edge tech courses, live classes, and insights.</description>
    <language>en-us</language>
    <atom:link href="${frontendUrl}/api/v1/rss/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`;

    res.set("Content-Type", "text/xml");
    res.status(200).send(rssXml);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Trigger Auto-Push for Latest RSS / Content Updates
 */
exports.triggerRssAutoPush = async (req, res) => {
  try {
    const { contentType, contentId } = req.body;

    let title = "";
    let body = "";
    let url = "/";
    let image = "";

    if (contentType === "blog" && contentId) {
      const blog = await Blog.findById(contentId);
      if (blog) {
        title = `📰 New Blog Post: ${blog.title}`;
        body = blog.excerpt || (blog.content ? blog.content.substring(0, 120) : "Read our latest article!");
        url = `/blogs/${blog.slug || blog._id}`;
        image = blog.coverImage || "";
      }
    } else if (contentType === "course" && contentId) {
      const course = await Course.findById(contentId);
      if (course) {
        title = `🎓 New Course Alert: ${course.title}`;
        body = course.shortDescription || course.description || "A new course is now available. Start learning!";
        url = `/courses/${course._id}`;
        image = course.thumbnail || "";
      }
    } else {
      // Default latest content RSS push
      const latestBlog = await Blog.findOne({ status: "published" }).sort({ createdAt: -1 });
      if (latestBlog) {
        title = `🔥 Latest Content: ${latestBlog.title}`;
        body = latestBlog.excerpt || "Check out our newest post on NovaEdge Academy!";
        url = `/blogs/${latestBlog.slug || latestBlog._id}`;
      }
    }

    if (!title) {
      return res.status(404).json({ success: false, message: "No content found to broadcast auto-push." });
    }

    const broadcastResult = await broadcastPushToSegment({
      target: "all",
      title,
      body,
      url,
      image,
      type: "rss",
      senderId: req.user ? req.user.id : null,
    });

    res.status(200).json({
      success: true,
      message: "Automatic RSS Web Push triggered successfully!",
      result: broadcastResult,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
