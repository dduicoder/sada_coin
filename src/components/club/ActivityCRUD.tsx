"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Activity } from "@/../types";
import { ActivityManagement } from "./ActivityManagement";
import { PaymentProcessor } from "./PaymentProcessor";

interface ActivityCRUDProps {
  player?: {
    name: string;
    hash: string;
  };
}

export const ActivityCRUD: React.FC<ActivityCRUDProps> = ({ player }) => {
  const { data: session, status } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );

  useEffect(() => {
    if (session?.user?.id) {
      fetchActivities();
    }
  }, [session?.user?.id]);

  const fetchActivities = async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(
        `/api/activities?club_id=${session.user.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setActivities(data);
      } else {
        console.error("Failed to fetch activities");
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleActivitySelect = (activity: Activity) => {
    setSelectedActivity(activity);
  };

  const handlePaymentComplete = () => {
    setSelectedActivity(null);
  };

  if (status !== "authenticated" || !session?.user) {
    return <div>접근이 허용되지 않았습니다.</div>;
  }

  if (session.user.type !== "club") {
    return <div>동아리만 접근할 수 있습니다.</div>;
  }

  return (
    <div className="space-y-6">
      <ActivityManagement
        activities={activities}
        selectedActivity={selectedActivity}
        onActivitySelect={handleActivitySelect}
        onActivitiesUpdate={fetchActivities}
      />

      {player && (
        <PaymentProcessor
          player={player}
          selectedActivity={selectedActivity}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};
