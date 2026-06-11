import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import PageSpinner from "../components/shared/PageSpinner";
import ProfileHero from "../components/profile/ProfileHero";
import SecurityCard from "../components/profile/SecurityCard";
import PasswordModal from "../components/profile/PasswordModal";
import ProfileInfoCard from "../components/profile/ProfileInfoCard";
import type { User, UpdateProfileRequest, UpdatePasswordRequest, GetCurrentUserResponse, UpdateProfileResponse } from "../types/api.types";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profileForm, setProfileForm] = useState<UpdateProfileRequest>({ name: "", email: "" });

  useEffect(() => {
    axiosInstance.get<GetCurrentUserResponse>("/user/me")
      .then((res) => {
        setUser(res.data.user);
        setProfileForm({ name: res.data.user.name, email: res.data.user.email });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSave = async () => {
    setProfileError(""); setProfileSuccess(""); setProfileLoading(true);
    try {
      const res = await axiosInstance.put<UpdateProfileResponse>("/user/profile", profileForm);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setProfileSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setProfileError((err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to update profile");
    } finally { setProfileLoading(false); }
  };

  const handlePasswordSave = async (form: UpdatePasswordRequest) => {
    await axiosInstance.put("/user/password", form);
  };

  if (loading) return <PageSpinner />;
  if (!user) return null;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <ProfileHero user={user} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileInfoCard
          user={user}
          editing={editing}
          form={profileForm}
          loading={profileLoading}
          error={profileError}
          success={profileSuccess}
          onEdit={() => setEditing(true)}
          onCancel={() => { setEditing(false); setProfileError(""); setProfileSuccess(""); }}
          onSave={handleProfileSave}
          onChange={setProfileForm}
        />
        <SecurityCard onChangePassword={() => setShowPasswordModal(true)} />
      </div>

      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSave={handlePasswordSave}
        />
      )}
    </div>
  );
};

export default Profile;
