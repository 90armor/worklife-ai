// Centralized user-facing UI string constants.
// These are the English source strings; translated versions live in messages/en.json and messages/ja.json.
// SettingsModal uses next-intl's useTranslations() hook at runtime — these constants serve as
// a typed reference and can be used in contexts where the i18n hook is unavailable.

export const MESSAGES = {
  profile: {
    loadError: "Could not load profile. Please try again.",
    saveError: "Failed to save profile. Please try again.",
    saveSuccess: "Profile saved.",
    saving: "Saving…",
    save: "Save",
  },
  account: {
    loadError: "Could not load account details.",
    deleteDescription:
      "Delete your account and associated data from the WorkLife AI platform. You can restore your account using the same email and password.",
    deleteConfirmTitle: "Delete your account?",
    deleteButton: "Delete",
    deleteConfirmButton: "Yes, delete my account",
    deletingButton: "Deleting…",
    deleteError: "Failed to delete account. Please try again.",
    signOut: "Sign out",
    signingOut: "Signing out…",
    updateEmail: "Update",
    setPassword: "Set password",
    savingPassword: "Saving…",
    setPasswordError: "Failed to set password. Please try again.",
    passwordAlreadySet: "Password is already set.",
    disconnectGoogle: "Disconnect",
    disconnecting: "Disconnecting…",
    connectGoogle: "Connect",
    disconnectGoogleError: "Failed to disconnect. Please try again.",
    disconnectGoogleNeedPassword: "Set a password before disconnecting Google.",
  },
} as const;
