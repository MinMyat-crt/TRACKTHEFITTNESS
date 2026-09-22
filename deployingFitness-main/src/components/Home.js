import React, { useState, useEffect } from "react";
import FrontendLogger from "./FrontendLogger";
import History from "./History";
import Charts from "./Charts";
import { authenticatedFetch } from "../utils/userProfileUtils";
import "./Home.css";

export default function Home({ onComplete, onLogout, onGoBack, userProfile: userProfileProp, loading }) {
  const [active, setActive] = useState("features");
  const [userProfile, setUserProfile] = useState(userProfileProp || { username: "", weight: null, height: null });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (userProfileProp) setUserProfile(userProfileProp);
  }, [userProfileProp]);

  useEffect(() => {
    if (userProfile.weight && userProfile.height) {
      const bmi = (userProfile.weight / (userProfile.height / 100) ** 2).toFixed(2);
      setUserProfile((prev) => ({ ...prev, bmi }));
    }
  }, [userProfile.weight, userProfile.height]);

  // Fetch logs only when app-level loading is finished and we have a username
  useEffect(() => {
    const fetchLogs = async () => {
      if (loading) return; // wait until app initialization finishes
      if (!userProfile || !userProfile.username) {
        console.warn("Username is missing. Skipping logs fetch until user is available.");
        return;
      }

      try {
        const response = await authenticatedFetch(`/logs/${userProfile.username}`);
        if (response && response.ok) {
          const data = await response.json();
          setLogs(Array.isArray(data.data) ? data.data : []); // Ensure data is an array
        } else {
          console.error("Failed to fetch logs from the database.");
        }
      } catch (error) {
        console.error("Error fetching logs from the database:", error);
      }
    };

    fetchLogs();
  }, [loading, userProfile && userProfile.username]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-brand-mark">FT</span>
          <span>Fit-Track</span>
        </div>
        <nav className="app-nav" aria-label="Main navigation">
          <button
            className={`app-nav-button ${active === "features" ? "is-active" : ""}`}
            onClick={() => setActive("features")}
          >
            Features
          </button>
          <button
            className={`app-nav-button ${active === "history" ? "is-active" : ""}`}
            onClick={() => setActive("history")}
          >
            History
          </button>
          <button
            className={`app-nav-button ${active === "charts" ? "is-active" : ""}`}
            onClick={() => setActive("charts")}
          >
            Charts
          </button>
          <button
            className={`app-nav-button ${active === "profile" ? "is-active" : ""}`}
            onClick={() => setActive("profile")}
          >
            Profile
          </button>
        </nav>
      </header>

      <main className="app-main">
        {active === "features" && (
          <div className="dashboard-grid">
            {/* Left: Profile */}
            <aside className="dashboard-sidebar">
              <div className="profile-card">
                <div>
                  <p
                    style={{
                      margin: "6px 0",
                      paddingLeft: 30,
                      lineHeight: 1.8,
                    }}
                  >
                    <strong>Username:</strong>{" "}
                    {userProfile.username || "User"}
                  </p>
                  <p
                    style={{
                      margin: "6px 0",
                      paddingLeft: 30,
                      lineHeight: 1.8,
                    }}
                  >
                    <strong>Weight:</strong>{" "}
                    {userProfile.weight ? `${userProfile.weight} kg` : "N/A"}
                  </p>
                  <p
                    style={{
                      margin: "6px 0",
                      paddingLeft: 30,
                      lineHeight: 1.8,
                    }}
                  >
                    <strong>Height:</strong>{" "}
                    {userProfile.height ? `${userProfile.height} cm` : "N/A"}
                  </p>
                  <p
                    style={{
                      margin: "6px 0",
                      paddingLeft: 30,
                      lineHeight: 1.8,
                    }}
                  >
                    <strong>BMI:</strong> {userProfile.bmi ?? "N/A"}
                  </p>
                </div>
              </div>
            </aside>

            {/* Center: Logger */}
            <section className="logger-column">
              <div className="logger-column-inner">
                <FrontendLogger
                  onComplete={onComplete}
                  onLogout={onLogout}
                  onGoBack={onGoBack}
                  userProfile={userProfile}
                  loading={loading}
                />
              </div>
            </section>

            {/* Right: Activity */}
            <aside className="activity-sidebar">
              <div className="activity-card">
                <h3 className="section-title">
                  User Activity
                </h3>
                <div
                  style={{ maxHeight: 520, overflowY: "auto", paddingRight: 6 }}
                >
                  {(() => {
                    try {
                      if (!logs || logs.length === 0)
                        return (
                          <p
                            style={{
                              color: "var(--muted-text)",
                              lineHeight: 1.8,
                            }}
                          >
                            No activity yet.
                          </p>
                        );
                      return (
                        <ul
                          style={{ listStyle: "none", padding: 0, margin: 0 }}
                        >
                          {logs
                            .slice()
                            .reverse()
                            .map((log, index) => (
                              <li
                                key={index}
                                style={{
                                  padding: "14px 10px",
                                  borderBottom: "1px solid var(--border)",
                                  lineHeight: 1.6,
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: "var(--muted-text)",
                                    marginBottom: 6,
                                  }}
                                >
                                  {log.timestamp || "Unknown timestamp"}
                                </div>
                                <div
                                  style={{ fontSize: 13, color: "var(--text)" }}
                                >
                                  {log.type === "exercise"
                                    ? `${log.exercise || "Unknown exercise"} for ${log.exerciseDuration || "Unknown duration"} mins`
                                    : log.type === "meal"
                                    ? `${log.meal || "Unknown meal"} at ${log.mealTime || "Unknown time"}`
                                    : log.value || "Unknown activity"}
                                </div>
                              </li>
                            ))}
                        </ul>
                      );
                    } catch (err) {
                      return (
                        <p
                          style={{
                            color: "var(--muted-text)",
                            lineHeight: 1.8,
                          }}
                        >
                          No activity yet.
                        </p>
                      );
                    }
                  })()}
                </div>
              </div>
            </aside>
          </div>
        )}

        {active === "history" && <History username={userProfile.username} />}
        {active === "charts" && <Charts />}
        {active === "profile" && (
          <div className="profile-page">
            <h2 className="page-title">
              Profile
            </h2>
            <div className="profile-layout">
              <div className="profile-card profile-summary">
                <p style={{ margin: "6px 0" }}>
                  <strong>Username:</strong> {userProfile.username || "User"}
                </p>
                <p style={{ margin: "6px 0" }}>
                  <strong>Latest BMI:</strong>{" "}
                  {(() => {
                    try {
                      if (userProfile && userProfile.bmi)
                        return userProfile.bmi;
                      const raw = localStorage.getItem("ft_log_history");
                      const arr = raw ? JSON.parse(raw) : [];
                      for (let i = arr.length - 1; i >= 0; i--)
                        if (arr[i].type === "bmi")
                          return String(arr[i].value).replace("BMI: ", "");
                    } catch (e) {}
                    return "N/A";
                  })()}
                </p>
                <p style={{ margin: "6px 0" }}>
                  <strong>Number of records:</strong>{" "}
                  {(() => {
                    try {
                      const raw = localStorage.getItem("ft_log_history");
                      const arr = raw ? JSON.parse(raw) : [];
                      return arr.length;
                    } catch (e) {
                      return 0;
                    }
                  })()}
                </p>
                <div style={{ marginTop: 12 }}>
                  <button
                    onClick={() => {
                      if (typeof onLogout === "function") onLogout();
                    }}
                    aria-label="Log Out"
                    style={{
                      background: "var(--danger, #ef4444)",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                      zIndex: 20,
                      fontWeight: 600,
                      display: "inline-block",
                    }}
                  >
                    Log Out
                  </button>
                </div>
              </div>

              <div className="profile-note">
                <p>
                  Use the Features → Profile area to edit your profile
                  (weight/height) and record BMI entries.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
