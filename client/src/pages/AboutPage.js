import React from "react";
import { Helmet } from "react-helmet-async";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>About Us | BlogApp</title>
        <meta
          name="description"
          content="Learn more about our blog platform and team"
        />
      </Helmet>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">About BlogApp</h1>

        <div className="prose max-w-none">
          <p>
            Welcome to BlogApp, a modern blogging platform built with React,
            Redux, and Node.js. Our mission is to provide bloggers with a
            powerful, easy-to-use platform to share their stories with the
            world.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">
            Our Story
          </h2>
          <p>
            BlogApp was founded in 2023 with a simple goal: to create a blogging
            platform that puts content first. We believe that great content
            deserves a great platform, and we've built BlogApp to make the
            writing and publishing process as seamless as possible.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">
            Our Features
          </h2>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>Clean, modern design focused on readability</li>
            <li>Powerful content editor with rich formatting options</li>
            <li>
              Category and tag organization to keep your content structured
            </li>
            <li>Responsive design for perfect viewing on any device</li>
            <li>SEO optimization to help your content reach more readers</li>
            <li>User authentication and profile management</li>
            <li>Admin dashboard for content management</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">
            Our Technology
          </h2>
          <p>
            BlogApp is built with modern web technologies that ensure a fast,
            reliable, and secure experience:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>React for a dynamic, interactive frontend</li>
            <li>Redux for state management</li>
            <li>Node.js and Express for the backend API</li>
            <li>MongoDB for data storage</li>
            <li>Tailwind CSS for beautiful, responsive design</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">
            Contact Us
          </h2>
          <p>
            Have questions, feedback, or suggestions? We'd love to hear from
            you! Visit our
            <a
              href="/contact"
              className="text-primary-600 hover:text-primary-700"
            >
              {" "}
              contact page{" "}
            </a>
            or email us at{" "}
            <a
              href="mailto:support@blogapp.com"
              className="text-primary-600 hover:text-primary-700"
            >
              support@blogapp.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
