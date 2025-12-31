import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
  FaGithub,
  FaEdit,
  FaCog,
  FaEnvelope,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import DefaultImage from "../../../public/images/default-avatar.png";
import useProfile from "@/hooks/useProfile";

function Profile() {
  const navigate = useNavigate();
  const { profile, UserRole } = useProfile();
  // console.log(profile.data);
  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (profile.data) {
      const tabContent = profile.data[`${UserRole}TabContent`];
      setActiveTab(Object.keys(tabContent || {})[0] || "");
    }
  }, [profile.data, UserRole]);

  if (profile.isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-text-secondary">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
          <div className="h-4 bg-gray-300 rounded w-48"></div>
          <div className="h-3 bg-gray-300 rounded w-32"></div>
        </div>
      </div>
    );  
  }

  if (profile.isError || !profile.data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">Error loading profile</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const data = profile.data;
  if (!data.user.avatar) data.user.avatar = DefaultImage;
  const avatarUrl = data.user.avatar
    ? `${import.meta.env.VITE_BASE_URL}${data.user.avatar}` // Vite
    : DefaultImage;
    // console.log(avatarUrl);
  const tabs = Object.keys(data[`${UserRole}TabContent`] || {});
  const tabContent = data[`${UserRole}TabContent`];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      {/* Profile Header */}
      <div className="card card-hover flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative mx-auto sm:mx-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = DefaultImage;
                }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
              <FaEdit className="text-sm" />
            </div>
          </div>

          <div className="text-center sm:text-left space-y-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                {data.user.name}
              </h2>
              <p className="text-text-secondary text-lg">
                {data.user.roleTitle}
              </p>
              <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-bold capitalize mt-2">
                {UserRole}
              </span>
            </div>

            {/* {data.socialLinks && (
              <div className="flex space-x-2 justify-center sm:justify-start">
                {Object.entries(data.socialLinks).map(([platform, link]) => {
                  if (!link) return null;

                  const icons = {
                    facebook: <FaFacebookF />,
                    twitter: <FaTwitter />,
                    // linkedin: <FaLinkedinIn />,
                    youtube: <FaYoutube />,
                    instagram: <FaInstagram />,
                    github: <FaGithub />,
                  };

                  const colors = {
                    facebook: "bg-blue-600 hover:bg-blue-700",
                    twitter: "bg-sky-500 hover:bg-sky-600",
                    // linkedin: "bg-blue-700 hover:bg-blue-800",
                    youtube: "bg-red-600 hover:bg-red-700",
                    instagram: "bg-pink-500 hover:bg-pink-600",
                    github:
                      "bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600",
                  };

                  return (
                    <a
                      key={platform}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-white transition-all duration-300 btn-hover ${
                        colors[platform] || "bg-gray-500 hover:bg-gray-600"
                      }`}
                      title={
                        platform.charAt(0).toUpperCase() + platform.slice(1)
                      }
                    >
                      {icons[platform] || platform}
                    </a>
                  );
                })}
              </div>
            )} */}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end">
          {data.actions?.map((action) => (
            <button
              key={action.id}
              className="btn btn-primary btn-hover flex items-center justify-center gap-2"
              onClick={() => navigate(action.url)}
            >
              {action.label === "Edit Profile" && <FaEdit />}
              {action.label === "Settings" && <FaCog />}
              {action.label === "Contact" && <FaEnvelope />}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {data.stats.map((stat, index) => (
          <div
            key={stat.label}
            className="card card-hover text-center p-6 relative overflow-hidden group"
          >
            <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
              {stat.value}
            </div>
            <div className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
              {stat.label}
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-300"></div>
          </div>
        ))}
      </div>

      {/* About Section */}
      {data.about && (
        <div className="card card-hover mb-8 p-6 lg:p-8">
          <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-secondary rounded-full"></div>
            About Me
          </h3>
          <p className="text-text-secondary leading-relaxed text-lg">
            {data.about}
          </p>
        </div>
      )}

      {/* Tabs Section */}
      {/* <div className="card mb-8">
        <div className="border-b border-border">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`flex-1 min-w-max px-6 py-4 font-semibold text-sm lg:text-base transition-all duration-300 border-b-2 ${
                  activeTab === item
                    ? "text-secondary border-secondary bg-secondary/5"
                    : "text-text-secondary border-transparent hover:text-secondary hover:bg-surface"
                }`}
              >
                {item
                  .split(/(?=[A-Z])/)
                  .join(" ")
                  .toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <TabContent data={tabContent[activeTab]} />
        </div>
      </div> */}
    </div>
  );
}

export default Profile;

function TabContent({ data }) {
  if (!data)
    return (
      <div className="text-center py-8">
        <p className="italic text-text-secondary text-lg">No data available.</p>
      </div>
    );

  if (typeof data === "string")
    return (
      <p className="text-text-secondary leading-relaxed text-lg p-4">{data}</p>
    );

  if (Array.isArray(data)) {
    if (!data.length)
      return (
        <div className="text-center py-8">
          <p className="text-text-secondary">No items found</p>
        </div>
      );

    return (
      <div className="space-y-4">
        {data.map((item, i) => (
          <div
            key={i}
            className="card card-hover p-4 sm:p-6 border-l-4 border-primary"
          >
            {Object.entries(item).map(([key, value]) => (
              <div key={key} className="mb-3 last:mb-0">
                <span className="font-semibold text-text-primary capitalize block text-sm mb-1">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span className="text-text-secondary block pl-4">
                  {Array.isArray(value) ? value.join(", ") : value}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card card-hover p-6 border-l-4 border-secondary">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="mb-4 last:mb-0">
          <span className="font-semibold text-text-primary capitalize block text-lg mb-2">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </span>
          <div className="text-text-secondary text-base pl-4">
            {Array.isArray(value) ? (
              <ul className="list-disc list-inside space-y-1">
                {value.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{value}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
