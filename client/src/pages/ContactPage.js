import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { name, email, subject, message } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Your message has been sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);

    // In a real app, you would handle the API call here
    // try {
    //   await contactService.sendMessage(formData);
    //   toast.success('Your message has been sent successfully!');
    //   setFormData({ name: '', email: '', subject: '', message: '' });
    // } catch (error) {
    //   toast.error('Failed to send message. Please try again later.');
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>Contact Us | BlogApp</title>
        <meta name="description" content="Get in touch with the BlogApp team" />
      </Helmet>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Contact Us</h1>

        <div className="mb-8">
          <p className="text-gray-700">
            Have a question, suggestion, or just want to say hello? Fill out the
            form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="form-label">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="form-label">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={subject}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="message" className="form-label">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={handleChange}
              rows="6"
              className="form-input"
              required
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Other Ways to Reach Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-primary-600 text-2xl mb-2">
                <i className="fas fa-envelope"></i>
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p>
                <a
                  href="mailto:support@blogapp.com"
                  className="text-primary-600 hover:text-primary-700"
                >
                  support@blogapp.com
                </a>
              </p>
            </div>

            <div className="text-center p-4">
              <div className="text-primary-600 text-2xl mb-2">
                <i className="fas fa-phone"></i>
              </div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p>(123) 456-7890</p>
            </div>

            <div className="text-center p-4">
              <div className="text-primary-600 text-2xl mb-2">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3 className="font-semibold mb-2">Address</h3>
              <p>
                123 Blog Street
                <br />
                San Francisco, CA 94103
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
