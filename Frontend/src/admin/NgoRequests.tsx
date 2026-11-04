import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Check, Loader2, RefreshCw, X } from "lucide-react";

type NgoRequest = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  registrationNumber?: string;
  createdAt?: string;
};

const apiUrl = `${import.meta.env.VITE_Backend_URL}/api/ngos`;

export default function NgoRequests() {
  const [requests, setRequests] = useState<NgoRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get<{ ngos: NgoRequest[] }>(`${apiUrl}/pending`);
      setRequests(response.data.ngos || []);
    } catch (requestError) {
      console.error("Unable to load NGO requests:", requestError);
      setError("Unable to load NGO requests. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const approveRequest = async (id: string) => {
    try {
      setWorkingId(id);
      await axios.get(`${apiUrl}/approve/${id}`);
      setRequests((current) => current.filter((request) => request._id !== id));
    } catch (requestError) {
      console.error("Unable to approve NGO request:", requestError);
      setError("The NGO could not be approved. Please try again.");
    } finally {
      setWorkingId(null);
    }
  };

  const rejectRequest = async (id: string) => {
    try {
      setWorkingId(id);
      await axios.delete(`${apiUrl}/reject/${id}`, {
        data: { rejectionReason: reason.trim() || undefined },
      });
      setRequests((current) => current.filter((request) => request._id !== id));
      setRejectingId(null);
      setReason("");
    } catch (requestError) {
      console.error("Unable to reject NGO request:", requestError);
      setError("The NGO could not be rejected. Please try again.");
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#17633b]">Admin workspace</p>
          <h1 className="mt-2 font-serif text-4xl font-bold">NGO requests</h1>
          <p className="mt-3 max-w-2xl text-[#536258]">Review new NGO applications and decide whether they can access the platform.</p>
        </div>
        <button type="button" onClick={() => void loadRequests()} disabled={loading} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#c9d9c9] bg-white px-4 text-sm font-bold text-[#17633b] hover:bg-[#eef6eb] disabled:opacity-60">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && <div role="alert" className="mt-6 rounded-xl border border-[#f1c7b9] bg-[#fff7f2] px-4 py-3 text-sm text-[#8d4a36]">{error}</div>}

      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-[#dce5dd] bg-white p-10 text-center text-[#536258]"><Loader2 className="mx-auto animate-spin" size={24} /></div>
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#a9c8a9] bg-white p-10 text-center"><Check className="mx-auto text-[#4d8857]" size={30} /><h2 className="mt-3 font-serif text-2xl font-bold">No pending requests</h2><p className="mt-2 text-sm text-[#536258]">New NGO applications will appear here.</p></div>
        ) : (
          requests.map((request) => (
            <article key={request._id} className="rounded-2xl border border-[#dce5dd] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3"><h2 className="font-serif text-2xl font-bold text-[#14231d]">{request.name}</h2><span className="rounded-full bg-[#fff1df] px-3 py-1 text-xs font-bold text-[#a7672b]">Pending review</span></div>
                  <div className="mt-4 grid gap-x-8 gap-y-2 text-sm text-[#536258] sm:grid-cols-2">
                    <p><span className="font-bold text-[#31443a]">Email:</span> {request.email}</p>
                    {request.phone && <p><span className="font-bold text-[#31443a]">Phone:</span> {request.phone}</p>}
                    {request.location && <p><span className="font-bold text-[#31443a]">Location:</span> {request.location}</p>}
                    {request.registrationNumber && <p><span className="font-bold text-[#31443a]">Registration:</span> {request.registrationNumber}</p>}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button type="button" disabled={workingId === request._id} onClick={() => void approveRequest(request._id)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#17633b] px-4 text-sm font-bold text-white hover:bg-[#0f4e2d] disabled:opacity-60"><Check size={16} /> Approve request</button>
                  <button type="button" disabled={workingId === request._id} onClick={() => { setRejectingId(request._id); setReason(""); }} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#e1b5a7] px-4 text-sm font-bold text-[#a14d39] hover:bg-[#fff7f2] disabled:opacity-60"><X size={16} /> Reject request</button>
                </div>
              </div>
              {rejectingId === request._id && (
                <div className="mt-5 rounded-xl border border-[#f1d2c8] bg-[#fffaf7] p-4">
                  <label htmlFor={`rejection-reason-${request._id}`} className="text-sm font-bold text-[#6e3d31]">Reason for rejection <span className="font-normal text-[#8d6a60]">(optional)</span></label>
                  <textarea id={`rejection-reason-${request._id}`} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Add a note for the NGO, or leave this blank..." rows={3} className="mt-2 w-full resize-y rounded-xl border border-[#e1c8c0] bg-white p-3 text-sm outline-none focus:border-[#a14d39]" />
                  <div className="mt-3 flex justify-end gap-2">
                    <button type="button" onClick={() => setRejectingId(null)} className="rounded-xl border border-[#d7d1ce] px-4 py-2 text-sm font-bold text-[#536258]">Cancel</button>
                    <button type="button" disabled={workingId === request._id} onClick={() => void rejectRequest(request._id)} className="rounded-xl bg-[#a14d39] px-4 py-2 text-sm font-bold text-white disabled:opacity-60">{workingId === request._id ? "Rejecting..." : "Confirm rejection"}</button>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
