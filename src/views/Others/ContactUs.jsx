import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import { useNavigate } from "react-router";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { useState } from "react";
import DefaultImage from "../../../public/images/default-avatar.png";
import useTokenStore from "@/store/user";

// const Image = localStorage.getItem("userimage") ;

function ContactUs() {
  const Image = useTokenStore((state) => state.user?.image) || DefaultImage;
  // console.log("image", image);
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState(null);

  const teamMembers = [
    {
      name: "Nada Ashraf",
      role: "Full Stack Developer",
      bio: "Nada is passionate about building modern, responsive web applications and mentoring new developers. She specializes in React, .NET, and JavaScript.",
      image: Image,
      socials: {
        facebook: "https://www.facebook.com/nadaasraf.asraf.3",
        linkedin: "https://www.linkedin.com/in/nada-ashraf-386223287/",
        github: "https://github.com/nadaashraf25003",
      },
    },
    {
      name: "George Geham  ",
      role: "Full Stack Developer",
      bio: "George focuses on helping students explore artificial intelligence and deep learning concepts using Python, TensorFlow, and PyTorch.",
      image: Image,
      socials: {
        facebook: "https://facebook.com/ahmedhassan",
        linkedin: "https://linkedin.com/in/ahmedhassan",
        github: "https://github.com/ahmedhassan",
      },
    },
    {
      name: "Rana Waleed",
      role:  "Full Stack Developer",
      bio: "A passionate Full Stack Developer with expertise in .NET, Python, and modern web technologies.I specialize in building smart, reliable, and scalable applications that solve real-world problems and support business growth.",
      image:Image,
      socials: {
        facebook: "https://www.facebook.com/rana.sakr.792",
        linkedin: "https://www.linkedin.com/in/rana-sakr-a81a6634b/",
        github: "https://github.com/ranaa-20",
      },
    },
    {
      name: "Mariam Mohammed",
      role: "Full Stack Developer",
      bio: "Mariam Helal is a Full Stack .NET Developer skilled in building scalable web applications using ASP.NET Core, SQL Server, React, and TypeScript. She focuses on clean architecture, robust APIs, and modern, high-quality software solutions.",
      image:Image,
      socials: {
        facebook: "https://www.facebook.com/mariam.mohammed.140378/",
        linkedin: "https://www.linkedin.com/in/mariammohamed23/",
        github: "https://github.com/layla3052004",
      },
    },
    {
      name: "Mohamed Saleh",
      role: "Full Stack Developer",
      bio: "Mohamed ensures every Learnify initiative runs smoothly, managing timelines, collaboration, and project goals effectively.",
      image:Image,
      socials: {
        facebook: "https://facebook.com/mariamali",
        linkedin: "https://linkedin.com/in/mariamali",
        github: "https://github.com/mariamali",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background py-8 mt-5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="mb-8">
          {/* <div className="flex items-center text-sm text-text-secondary mb-4">
            <a
              href="#"
              className="hover:text-blue-600"
              onClick={() => navigate("/UserLayout")}
            >
              Home
            </a>
            <span className="mx-2">/</span>
            <span className="text-text-secondary">Contact Us</span>
          </div> */}
          <LandingHeading header="Contact Us" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side - Meet Our Team */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-semibold text-text-primary mb-4 text-center">
                Meet Our Team 
              </h2>
              <p className="text-text-secondary text-center leading-relaxed mb-6">
                Passionate minds behind{" "}
                <span className="text-blue-600 font-semibold">Learnify</span>.
                Click any member to know more about them.
              </p>

              <div className="flex flex-col gap-3">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl shadow-sm p-3 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer border border-gray-100"
                    onClick={() => setSelectedMember(member)}
                  >
                    <div className="flex items-center gap-4">
                      {/* <img
                        src={member.image}
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                      /> */}
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary">
                          {member.name}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* Social Links */}
                    {/* <div className="flex justify-center mt-4 space-x-3">
                      {member.socials.facebook && (
                        <a
                          href={member.socials.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaFacebookF />
                        </a>
                      )}
                      {member.socials.linkedin && (
                        <a
                          href={member.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaLinkedinIn />
                        </a>
                      )}
                      {member.socials.github && (
                        <a
                          href={member.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 transition"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaGithub />
                        </a>
                      )}
                    </div> */}
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-card rounded-2xl shadow-md p-4 mt-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-text-primary mb-4 text-center">
                Follow Learnify 
              </h2>
              <div className="flex justify-center flex-wrap gap-3">
                {[
                  {
                    icon: <FaFacebookF />,
                    link: "https://facebook.com/learnify",
                  },
                  { icon: <FaTwitter />, link: "https://twitter.com/learnify" },
                  {
                    icon: <FaLinkedinIn />,
                    link: "https://linkedin.com/company/learnify",
                  },
                  {
                    icon: <FaYoutube />,
                    link: "https://youtube.com/@learnify",
                  },
                  {
                    icon: <FaInstagram />,
                    link: "https://instagram.com/learnify",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Contact Info */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">
                Get in Touch with Learnify
              </h2>

              <p className="text-text-secondary mb-8 leading-relaxed">
                Have questions, feedback, or collaboration ideas? We're here to
                help! Reach out to the Learnify team — whether you’re a student,
                instructor, or partner, we’d love to hear from you.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-medium text-text-primary mb-2">
                    Head Office:
                  </h3>
                  <p className="text-text-secondary">
                    Learnify HQ, Innovation Park, Building 5,
                    <br />
                    Smart Village, 6th of October City,
                    <br />
                    Giza, Egypt
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-text-primary mb-2">
                    Email Us:
                  </h3>
                  <p className="text-text-secondary">support@learnify.com</p>
                  <p className="text-text-secondary">careers@learnify.com</p>
                </div>

                <div>
                  <h3 className="font-medium text-text-primary mb-2">
                    Call Us:
                  </h3>
                  <p className="text-text-secondary">+20 100 123 4567</p>
                  <p className="text-text-secondary">+20 120 765 4321</p>
                </div>

                <div>
                  <h3 className="font-medium text-text-primary mb-2">
                    Office Hours:
                  </h3>
                  <p className="text-text-secondary">Sunday – Thursday</p>
                  <p className="text-text-secondary">9:00 AM – 6:00 PM (EET)</p>
                </div>
              </div>

              {/* Interactive Map */}
              <div>
                <h3 className="font-medium text-text-primary mb-4">
                  Find Us on the Map:
                </h3>
                <div className="rounded-lg overflow-hidden h-96">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.309781416548!2d31.0151372753412!3d30.069575318639372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458411b72222227%3A0x43e2b6ff66f09a9!2sSmart%20Village!5e0!3m2!1sen!2seg!4v1698765432100!5m2!1sen!2seg"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Learnify Office Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-center text-text-secondary text-sm">
          <p className="mb-2">
            <a href="#" className="hover:text-blue-600">
              Privacy Policy
            </a>{" "}
            •{" "}
            <a href="#" className="hover:text-blue-600">
              Terms of Service
            </a>{" "}
            •{" "}
            <a href="#" className="hover:text-blue-600">
              Cookie Policy
            </a>
          </p>
          <p>© 2025 Learnify. Empowering learners everywhere 🌍</p>
        </footer>
      </div>

      {/* Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl p-8 w-96 relative animate-fade-in-up border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-lg"
              onClick={() => setSelectedMember(null)}
            >
              ✕
            </button>

            {/* Image */}
            <img
              src={selectedMember.image}
              alt={selectedMember.name}
              className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-blue-600 object-cover"
            />

            {/* Name + Role */}
            <h2 className="text-2xl font-semibold text-center text-text-primary mb-1">
              {selectedMember.name}
            </h2>
            <p className="text-center text-blue-600 font-medium mb-4">
              {selectedMember.role}
            </p>

            {/* Bio */}
            <p className="text-text-secondary text-center leading-relaxed mb-6">
              {selectedMember.bio}
            </p>

            {/* Social Icons */}
            <div className="flex justify-center gap-4">
              {Object.entries(selectedMember.socials).map(
                ([platform, link], index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-blue-600 hover:bg-blue-700 transition"
                  >
                    {platform === "facebook" && <FaFacebookF />}
                    {platform === "linkedin" && <FaLinkedinIn />}
                    {platform === "github" && <FaGithub />}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactUs;
