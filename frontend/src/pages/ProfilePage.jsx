import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Camera,
  Mail,
  User,
  Calendar,
  Shield,
  X,
  Check,
  Edit2,
} from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuth();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setSelectedImg(reader.result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = { ...formData };
    if (selectedImg) updateData.profilePic = selectedImg;
    await updateProfile(updateData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImg(null);
    setFormData({
      fullName: authUser?.fullName || "",
      email: authUser?.email || "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="relative mb-16">
          <div className="h-48 rounded-2xl animated-gradient shadow-lg"></div>
          <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            <div className="relative">
              <div className="size-32 rounded-2xl overflow-hidden ring-4 ring-base-100 shadow-xl">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute -right-2 -bottom-2 size-10 bg-primary hover:bg-primary-focus 
                           rounded-xl cursor-pointer flex items-center justify-center shadow-lg
                           transition-all duration-200"
                >
                  <Camera className="size-5 text-primary-content" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              )}
            </div>
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-base-content">
                {authUser?.fullName}
              </h1>
              <p className="text-base-content/60">
                @{authUser?.email?.split("@")[0]}
              </p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute bottom-4 right-8 btn btn-primary btn-sm gap-2"
            >
              <Edit2 className="size-4" /> Edit Profile
            </button>
          )}
        </div>

        <div className="mt-24 grid gap-8">
          <div className="bg-base-100 rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <User className="size-5" /> Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1.5">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="input input-bordered w-full"
                          disabled={isUpdatingProfile}
                        />
                      ) : (
                        <p className="text-lg">{authUser?.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">
                        Email Address
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-base-content/40" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input input-bordered w-full pl-11"
                            disabled={
                              isUpdatingProfile || authUser?.isGoogleAccount
                            }
                          />
                        </div>
                      ) : (
                        <p className="text-lg">{authUser?.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="size-5" /> Account Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1.5">
                        Account Type
                      </label>
                      <p className="text-lg flex items-center gap-2">
                        <span className="badge badge-primary">
                          {authUser?.isGoogleAccount
                            ? "Google Account"
                            : "Email Account"}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1.5">
                        Member Since
                      </label>
                      <p className="text-lg flex items-center gap-2">
                        <Calendar className="size-5" />
                        {new Date(authUser?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-ghost gap-2"
                    disabled={isUpdatingProfile}
                  >
                    <X className="size-4" /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary gap-2"
                    disabled={isUpdatingProfile}
                  >
                    <Check className="size-4" />
                    {isUpdatingProfile ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
