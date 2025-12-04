import React, { useState, useEffect } from "react";
import api from "@/API/Config";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";
import useTokenStore from "@/store/user";
import Urls from "@/API/URL";



const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useTokenStore.getState();
  const userId = user?.userId ?? 1;
  const role = user?.role ?? "admin".toLowerCase();
  const EditProfileEdpoint = Urls.EditProfile + role;

  // 🔹 Load Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(EditProfileEdpoint);
        const data = response.data;

        setFormData({
          name: data.user?.name || "",
          about: data.about || "",
          roleTitle: data.user?.roleTitle || "",
          department: data.department || "",
          roleLevel: data.roleLevel || "",
          phone: data.phone || "",
          address: data.address || "",
          gender: data.gender || "",
          university: data.university || "",
          country: data.country || "",
          linkedIn: data.socialLinks?.linkedIn || "",
          gitHub: data.socialLinks?.github || "",
          facebook: data.socialLinks?.facebook || "",
          twitter: data.socialLinks?.twitter || "",
          youTube: data.socialLinks?.github || "",
          specialization: data.specialization || "",
          educationLevel: data.educationLevel || "",
          major: data.major || "",
          gpa: data.gpa || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    if (userId && role) fetchProfile();
  }, [userId, role]);

  // 🔹 Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => setAvatar(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) form.append(key, value);
    });
    if (avatar) form.append("avatar", avatar);

    try {
      const response = await api.put(EditProfileEdpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message || "Profile updated successfully!");
      navigate(
        `/${
          role === "admin"
            ? "AdminLayout/AdminProfile"
            : role === "student"
            ? "StudentLayout/StuProfile"
            : "InstructorLayout/InstrProfile"
        }`
      );
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Role-Specific Fields
  const renderRoleSpecificFields = () => {
    switch (role) {
      case "student":
        return (
          <>
            <Input
              name="university"
              placeholder="University"
              value={formData.university || ""}
              onChange={handleChange}
            />
            <Input
              name="educationLevel"
              placeholder="Education Level"
              value={formData.educationLevel || ""}
              onChange={handleChange}
            />
            <Input
              name="major"
              placeholder="Major"
              value={formData.major || ""}
              onChange={handleChange}
            />
            <Input
              name="gpa"
              placeholder="GPA"
              value={formData.gpa || ""}
              onChange={handleChange}
            />
            <Input
              name="department"
              placeholder="Department"
              value={formData.department || ""}
              onChange={handleChange}
            />
          </>
        );
      case "instructor":
        return (
          <>
            <Input
              name="specialization"
              placeholder="Specialization"
              value={formData.specialization || ""}
              onChange={handleChange}
            />
            <Input
              name="country"
              placeholder="Country"
              value={formData.country || ""}
              onChange={handleChange}
            />
          </>
        );
      case "admin":
        return (
          <>
            <Input
              name="department"
              placeholder="Department"
              value={formData.department || ""}
              onChange={handleChange}
            />
            <Input
              name="roleLevel"
              placeholder="Role Level"
              value={formData.roleLevel || ""}
              onChange={handleChange}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="custom-container py-10 animate-fade-in-up">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-surface shadow-lg rounded-2xl p-8 md:p-10 border border-border max-w-3xl mx-auto card-hover">
        <LandingHeading
          header={`Edit ${
            role?.charAt(0).toUpperCase() + role?.slice(1)
          } Profile`}
        />

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              name="name"
              placeholder="Full Name"
              value={formData.name || ""}
              onChange={handleChange}
            />
            <Input
              name="roleTitle"
              placeholder="Role Title"
              value={formData.roleTitle || ""}
              onChange={handleChange}
            />
          </div>

          <Textarea
            name="about"
            placeholder="About..."
            value={formData.about || ""}
            onChange={handleChange}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <Input
              name="phone"
              placeholder="Phone"
              value={formData.phone || ""}
              onChange={handleChange}
            />
            <Input
              name="address"
              placeholder="Address"
              value={formData.address || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {renderRoleSpecificFields()}
          </div>

          <div className="pt-4">
            <h3 className="font-semibold text-primary mb-2">Social Links</h3>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                name="facebook"
                placeholder="Facebook"
                value={formData.facebook || ""}
                onChange={handleChange}
              />
              <Input
                name="twitter"
                placeholder="Twitter"
                value={formData.twitter || ""}
                onChange={handleChange}
              />
              <Input
                name="linkedIn"
                placeholder="LinkedIn"
                value={formData.linkedIn || ""}
                onChange={handleChange}
              />
              <Input
                name="gitHub"
                placeholder="GitHub / YouTube"
                value={formData.gitHub || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="pt-4">
            <label className="block font-medium mb-2 text-primary">
              Profile Image
            </label>
            <Input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary btn-hover text-lg py-2 mt-4"
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
