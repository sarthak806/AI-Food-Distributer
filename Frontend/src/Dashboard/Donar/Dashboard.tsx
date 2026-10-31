import {
  Plus,
  Heart,
  Clock3,
  Check,
  Sprout,
  Leaf,
  PackageCheck,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type DonationStage = {
  label: string;
  count: number;
  icon: typeof Plus;
};

type Donation = {
  id: string;
  foodName: string;
  status: string;
  quantity?: number;
  createdAt?: string;
};

type ApiDonation = {
  _id: string;
  foodType: string;
  status: string;
  quantity?: number;
  createdAt?: string;
};

type DonorDashboardProps = {
  totalDonations?: number;
  listedCount?: number;
  matchedCount?: number;
  pickupCount?: number;
  deliveredCount?: number;
  recentDonations?: Donation[];
  onViewAll?: () => void;
};

export default function DonorDashboard({
  totalDonations = 0,
  listedCount = 0,
  matchedCount = 0,
  pickupCount = 0,
  deliveredCount = 0,
  recentDonations = [],
  onViewAll,
}: DonorDashboardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<{
    total: number;
    listed: number;
    matched: number;
    pickup: number;
    delivered: number;
    recent: Donation[];
  } | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get<ApiDonation[]>(
          `${import.meta.env.VITE_Backend_URL}/api/donations/my-donations`,
          { withCredentials: true },
        );
        const donations = response.data || [];

        setDashboardData({
          total: donations.length,
          listed: donations.length,
          matched: donations.filter(
            (donation) =>
              donation.status === "accepted" ||
              donation.status === "delivered",
          ).length,
          pickup: donations.filter(
            (donation) => donation.status === "accepted",
          ).length,
          delivered: donations.filter(
            (donation) => donation.status === "delivered",
          ).length,
          recent: donations.slice(0, 4).map((donation) => ({
            id: donation._id,
            foodName: donation.foodType,
            status: donation.status,
            quantity: donation.quantity,
            createdAt: donation.createdAt,
          })),
        });
      } catch (error) {
        console.error("Error fetching donor dashboard:", error);
        setDashboardData({
          total: 0,
          listed: 0,
          matched: 0,
          pickup: 0,
          delivered: 0,
          recent: [],
        });
      }
    };

    fetchDonations();
  }, []);

  const data = dashboardData || {
    total: totalDonations,
    listed: listedCount,
    matched: matchedCount,
    pickup: pickupCount,
    delivered: deliveredCount,
    recent: recentDonations,
  };
  const handleViewAll = onViewAll || (() => navigate("/user/Donar/mydonations"));

  const stages: DonationStage[] = [
    {
      label: "Listed",
      count: data.listed,
      icon: Plus,
    },
    {
      label: "Matched",
      count: data.matched,
      icon: Heart,
    },
    {
      label: "Pickup",
      count: data.pickup,
      icon: Clock3,
    },
    {
      label: "Delivered",
      count: data.delivered,
      icon: Check,
    },
  ];

  return (
    <main className="donor-dashboard">
      <section className="dashboard-hero dashboard-card">
        <p className="section-eyebrow">Donation dashboard</p>
        <div className="dashboard-hero-content">
          <div>
            <h1 className="font-serif dashboard-hero-title">
              Welcome back, {user?.name?.split(" ")[0] || "there"}.
            </h1>
            <p className="dashboard-hero-description">
              Turn your surplus into a meal for someone in your community.
              Every donation helps move food where it is needed most.
            </p>
          </div>
          <button
            type="button"
            className="dashboard-hero-action"
            onClick={() => navigate("/user/Donar/donationForm")}
          >
            {data.total > 0 ? "Create donation" : "Make your first donation"}
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <section
        className="donor-summary-grid"
        aria-label="Donation summary"
      >
        <SummaryCard
          label="Active donations"
          value={data.listed - data.delivered}
          detail="Waiting for progress"
          icon={<PackageCheck />}
        />
        <SummaryCard
          label="Pending pickup"
          value={data.pickup}
          detail="Matched with an NGO"
          icon={<Clock3 />}
        />
        <SummaryCard
          label="Completed donations"
          value={data.delivered}
          detail="Successfully delivered"
          icon={<Check />}
        />
        <SummaryCard
          label="Food redistributed"
          value={data.delivered}
          detail="Donations reaching people"
          icon={<Heart />}
        />
      </section>

      {/* =================================
          DONATION JOURNEY
      ================================== */}
      <section
        className="journey-card dashboard-card"
        aria-labelledby="journey-heading"
      >
        <header className="journey-header">
          <div className="journey-heading-group">
            <p className="section-eyebrow">
              Your donation journey
            </p>

            <h1
              id="journey-heading"
              className="font-serif journey-title"
            >
              Every contribution moves food forward.
            </h1>
          </div>

          <p className="total-donations">
            {data.total} total donations
          </p>
        </header>

        <div
          className="donation-journey"
          aria-label="Donation progress"
        >
          {stages.map((stage) => {
            const Icon = stage.icon;

            return (
              <div
                className="journey-stage"
                key={stage.label}
              >
                <span
                  className="journey-icon"
                  aria-hidden="true"
                >
                  <Icon size={24} strokeWidth={2} />
                </span>

                <span className="journey-stage-label">
                  {stage.label}
                </span>

                <span className="journey-stage-count">
                  {stage.count}{" "}
                  {stage.count === 1 ? "donation" : "donations"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================
          LOWER DASHBOARD CARDS
      ================================== */}
      <div className="donor-dashboard-grid">
        {/* Recent Donations */}
        <section
          className="recent-card dashboard-card"
          aria-labelledby="recent-heading"
        >
          <header className="dashboard-section-header">
            <div>
              <p className="section-eyebrow">
                Recent activity
              </p>

              <h2
                id="recent-heading"
                className="font-serif dashboard-section-title"
              >
                Recent donations
              </h2>
            </div>

            <button
              type="button"
              className="view-all-button"
              onClick={handleViewAll}
            >
              View all
              <ArrowRight size={16} />
            </button>
          </header>

          {data.recent.length === 0 ? (
            <div className="recent-empty-state">
              <Sprout
                className="empty-state-icon"
                size={38}
                strokeWidth={2}
                aria-hidden="true"
              />

              <p>
                Your recent donations will appear here.
              </p>
            </div>
          ) : (
            <div className="recent-donations-list">
              {data.recent.slice(0, 4).map((donation) => (
                <article
                  className="recent-donation-item"
                  key={donation.id}
                >
                  <div className="recent-donation-icon">
                    <Sprout size={22} />
                  </div>

                  <div className="recent-donation-details">
                    <h3>{donation.foodName}</h3>

                    {donation.quantity != null && (
                      <p>
                        Quantity: {donation.quantity}
                      </p>
                    )}

                    {donation.createdAt && (
                      <p>
                        {new Date(
                          donation.createdAt
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <span className="donation-status">
                    {donation.status}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Donation Activity */}
        <section
          className="impact-card dashboard-card"
          aria-labelledby="impact-heading"
        >
          <header className="impact-header">
            <p className="section-eyebrow">
              Your impact
            </p>

            <h2
              id="impact-heading"
              className="font-serif dashboard-section-title"
            >
              Donation activity
            </h2>

            <p className="impact-description">
              Donations created over time
            </p>
          </header>

          <div
            className="activity-chart"
            role="img"
            aria-label={
              data.total > 0
                ? `You have created ${data.total} donations.`
                : "No donation activity yet."
            }
          >
            {            data.total > 0 ? (
              <>
                <div className="activity-bars" aria-hidden="true">
                  {[
                    30, 55, 42, 78, 48, 65, 28,
                  ].map((height, index) => (
                    <span
                      className="activity-bar"
                      key={index}
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  ))}
                </div>

                <p className="activity-message">
                  <Leaf size={18} aria-hidden="true" />
                  Your donations are making a difference.
                </p>
              </>
            ) : (
              <>
                <div
                  className="activity-bars activity-bars-empty"
                  aria-hidden="true"
                >
                  {[35, 65, 48, 82, 50, 70, 30].map(
                    (height, index) => (
                      <span
                        className="activity-bar"
                        key={index}
                        style={{
                          height: `${height}%`,
                        }}
                      />
                    )
                  )}
                </div>

                <p className="activity-message">
                  <Leaf size={18} aria-hidden="true" />
                  No activity yet
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: number;
  detail: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="summary-card">
      <div className="summary-card-header">
        <p>{label}</p>
        <span aria-hidden="true">{icon}</span>
      </div>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}