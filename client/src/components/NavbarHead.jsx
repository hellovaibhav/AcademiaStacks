import React, {useContext, useState} from 'react';
import {NavLink, Link, useNavigate} from 'react-router-dom';
import {
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineHome,
  AiOutlineFileText,
  AiOutlineUpload,
  AiOutlineMessage
} from 'react-icons/ai';
import {AuthContext} from '../context/AuthContext';
import Logo from '../assets/logo_website.png';
import {motion} from 'framer-motion';

const NavbarHead = () => {
  const navigate = useNavigate();
  const {user, isAuthenticated, logout} = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setOpen(false);
    setShowUserMenu(false);
  };

  const basicLinks = [
    {name: 'Home', icon: AiOutlineHome, link: '/'},
    {name: 'Materials', icon: AiOutlineFileText, link: '/material'},
    {name: 'Upload', icon: AiOutlineUpload, link: '/upload'},
    {name: 'Feedback', icon: AiOutlineMessage, link: '/feedback'}
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            className="flex-shrink-0"
          >
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center space-x-3"
            >
              <img src={Logo} className="h-10 w-10" alt="Academia Stacks" />
              <span className="text-xl font-bold text-gray-900">
                Academia <span className="text-[#22A39F]">Stacks</span>
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {basicLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <NavLink
                    key={link.name}
                    to={link.link}
                    className={({isActive}) =>
                      `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-[#22A39F] bg-[#22A39F]/10'
                          : 'text-gray-700 hover:text-[#22A39F] hover:bg-gray-100'
                      }`
                    }
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-[#22A39F] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a8a87] transition-colors duration-200"
              >
                Login
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-[#22A39F] transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-[#22A39F] rounded-full flex items-center justify-center">
                    <AiOutlineUser className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">
                    {user?.fname || 'User'}
                  </span>
                </button>

                {showUserMenu && (
                  <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50"
                  >
                    <Link
                      to="/user"
                      onClick={() => {
                        setShowUserMenu(false);
                        setOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <AiOutlineUser className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => {
                          setShowUserMenu(false);
                          setOpen(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <AiOutlineUser className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <AiOutlineLogout className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-700 hover:text-[#22A39F] transition-colors duration-200"
            >
              {open ? (
                <AiOutlineClose className="w-6 h-6" />
              ) : (
                <AiOutlineMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            exit={{opacity: 0, height: 0}}
            className="md:hidden border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {basicLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <NavLink
                    key={link.name}
                    to={link.link}
                    onClick={() => setOpen(false)}
                    className={({isActive}) =>
                      `flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                        isActive
                          ? 'text-[#22A39F] bg-[#22A39F]/10'
                          : 'text-gray-700 hover:text-[#22A39F] hover:bg-gray-100'
                      }`
                    }
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}

              {!isAuthenticated ? (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white bg-[#22A39F] hover:bg-[#1a8a87] transition-colors duration-200"
                >
                  <AiOutlineUser className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              ) : (
                <div className="border-t border-gray-200 pt-2">
                  <Link
                    to="/user"
                    onClick={() => setOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#22A39F] hover:bg-gray-100 transition-colors duration-200"
                  >
                    <AiOutlineUser className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  {user?.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#22A39F] hover:bg-gray-100 transition-colors duration-200"
                    >
                      <AiOutlineUser className="w-5 h-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <AiOutlineLogout className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default NavbarHead;
