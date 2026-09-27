"use client";

import { useState } from "react";
import data from "./data";
import RhythmTapper from "./RhythmTapper";
import ProfilePage from "./ProfilePage";

// ============================================================
// LOCKED — do not change
// This component must accept isOpen and onClose props.
// The modal must display all required fields from MemberData.
// ============================================================

export default function Modal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return <OpenModal onClose={onClose} />;
}

function OpenModal({ onClose }: { onClose: () => void }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const closeProfile = () => {
    onClose();
  };

  return isUnlocked ? (
    <ProfilePage member={data} onClose={closeProfile} />
  ) : (
    <RhythmTapper
      onSuccess={() => setIsUnlocked(true)}
      onSkip={() => setIsUnlocked(true)}
      onClose={closeProfile}
    />
  );
}
