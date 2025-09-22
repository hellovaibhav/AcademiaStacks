import React from "react";
import { 
  AiOutlineMail, 
  AiOutlinePhone, 
  AiOutlineEnvironment,
  AiOutlineGithub,
  AiOutlineLinkedin,
  AiOutlineTwitter,
  AiOutlineHeart
} from "react-icons/ai";
import { BiCodeAlt } from "react-icons/bi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <BiCodeAlt className="text-2xl text-[#22A39F]" />
              <span className="text-xl font-bold">
                Academia <span className="text-[#22A39F]">Stacks</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Your comprehensive platform for academic resources, study materials, and collaborative learning.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Hacktivators-IIIT"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-[#22A39F] transition-colors duration-200"
                aria-label="GitHub"
              >
                <AiOutlineGithub className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/hacktivators-iiit"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-[#22A39F] transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <AiOutlineLinkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/hacktivators_iiit"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-[#22A39F] transition-colors duration-200"
                aria-label="Twitter"
              >
                <AiOutlineTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/material" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Materials
                </a>
              </li>
              <li>
                <a href="/upload" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Upload
                </a>
              </li>
              <li>
                <a href="/feedback" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Study Materials */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Study Materials</h3>
            <ul className="space-y-2">
              <li>
                <a href="/notes" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Notes
                </a>
              </li>
              <li>
                <a href="/assignment" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Assignments
                </a>
              </li>
              <li>
                <a href="/handouts" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Handouts
                </a>
              </li>
              <li>
                <a href="/pyq" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
                  Previous Year Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <AiOutlineMail className="w-4 h-4 text-[#22A39F] flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">vaves.tech@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AiOutlineEnvironment className="w-4 h-4 text-[#22A39F] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-gray-400 text-sm">IIIT Ranchi</p>
                  <p className="text-gray-400 text-sm">Ranchi, Jharkhand</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <h3 className="text-lg font-semibold mb-4 text-center">Meet Our Team</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://www.linkedin.com/in/saquib-ali-4a3235219/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-[#22A39F] transition-colors duration-200"
            >
              <AiOutlineLinkedin className="w-4 h-4" />
              <span className="text-sm">Saquib Ali</span>
            </a>
            <a
              href="https://www.linkedin.com/in/vaibhav-verma-iiitr/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 text-gray-400 hover:text-[#22A39F] transition-colors duration-200"
            >
              <AiOutlineLinkedin className="w-4 h-4" />
              <span className="text-sm">Vaibhav Verma</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <AiOutlineHeart className="w-4 h-4 text-red-500" />
              <span>by Hacktivators</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>© {currentYear} Academia Stacks</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Version 1.0.1 (α)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
