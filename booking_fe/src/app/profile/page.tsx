'use client';
import Header from "@/components/organisms/header/Header";
import Detail from "@/components/organisms/profile/Detail";
import BookingList from "@/components/organisms/profile/BookingList";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user: string | null = localStorage.getItem("userData");
      if (!user) {
        router.push("/");
      }
    }
  }, [router]);

  return (
    <>
      <Header color="#D90D1E" />
      <div className="untree_co-section">
        <div className="container mt-4">
          <div className="row">
            <div className="col-lg-12">
              <nav>
                <div className="nav nav-tabs mb-3 poppins-semibold" id="nav-tab" role="tablist">
                  <a
                    className="nav-link active"
                    id="nav-profile-tab"
                    data-toggle="tab"
                    href="#nav-profile"
                    role="tab"
                    aria-controls="nav-profile"
                    aria-selected="false"
                  >
                    Profile
                  </a>
                  <a
                    className="nav-link"
                    id="nav-booking-tab"
                    data-toggle="tab"
                    href="#nav-booking"
                    role="tab"
                    aria-controls="nav-booking"
                    aria-selected="true"
                  >
                    Booking
                  </a>
                </div>
              </nav>
              <div className="tab-content p-3 border bg-light" id="nav-tabContent">
                <div className="tab-pane fade show" id="nav-booking" role="tabpanel" aria-labelledby="nav-booking-tab">
                  <BookingList />
                </div>
                <div
                  className="tab-pane fade show active"
                  id="nav-profile"
                  role="tabpanel"
                  aria-labelledby="nav-profile-tab"
                >
                  <Detail />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
