"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api } from "~/trpc/react";
import { safeHttpUrl } from "~/lib/url";

type Status = "pending" | "in_progress" | "resolved" | "rejected";

const statusOptions: Status[] = [
  "pending",
  "in_progress",
  "resolved",
  "rejected",
];

const statusStyles: Record<Status, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const cap = (s: string) => s.replace("_", " ");

const ComplaintDetail = ({
  complaintId,
  isAdmin,
}: {
  complaintId: number;
  isAdmin: boolean;
}) => {
  const utils = api.useUtils();

  const { data: complaint, isLoading } = api.complaint.getById.useQuery({
    id: complaintId,
  });
  const { data: events } = api.complaint.getEvents.useQuery({ complaintId });
  const { data: comments } = api.comment.list.useQuery({ complaintId });

  const [body, setBody] = useState("");
  const [note, setNote] = useState("");

  const refresh = () => {
    void utils.complaint.getById.invalidate({ id: complaintId });
    void utils.complaint.getEvents.invalidate({ complaintId });
    void utils.comment.list.invalidate({ complaintId });
  };

  const addComment = api.comment.create.useMutation({
    onSuccess: () => {
      setBody("");
      refresh();
    },
  });

  const updateStatus = api.complaint.updateStatus.useMutation({
    onSuccess: () => {
      setNote("");
      refresh();
    },
  });

  if (isLoading) {
    return <div className="p-6 text-lg">Loading...</div>;
  }

  if (!complaint) {
    return (
      <div className="p-6">
        <p className="text-lg">Complaint not found.</p>
        <Link href="/" className="text-blue-500 underline">
          Go back
        </Link>
      </div>
    );
  }

  const backHref = isAdmin ? "/admin" : "/student/dashboard";

  return (
    <div className="mx-auto min-h-screen max-w-3xl p-4">
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-1 text-blue-500 hover:underline"
      >
        <ArrowLeft size={18} /> Back to dashboard
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{complaint.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              #{complaint.id} · {cap(complaint.category)} · priority{" "}
              {complaint.priority}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm capitalize ${statusStyles[complaint.status]}`}
          >
            {cap(complaint.status)}
          </span>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-gray-800">
          {complaint.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <span>
            Filed by{" "}
            <strong>{complaint.filer?.email ?? complaint.filedBy}</strong>
            {complaint.filer?.roll_no ? ` (${complaint.filer.roll_no})` : ""}
          </span>
          <span>{new Date(complaint.filedAt).toLocaleString()}</span>
          {safeHttpUrl(complaint.mediaUrl) && (
            <a
              href={safeHttpUrl(complaint.mediaUrl)!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View attachment
            </a>
          )}
        </div>

        {/* Admin status control */}
        {isAdmin && (
          <div className="mt-5 border-t border-gray-100 pt-4">
            <label className="text-sm font-medium text-gray-700">
              Update status
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note / reason (shared with the student)"
              rows={2}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  disabled={updateStatus.isPending || complaint.status === s}
                  onClick={() =>
                    updateStatus.mutate({
                      id: complaint.id,
                      status: s,
                      note: note || undefined,
                    })
                  }
                  className={`rounded-md px-3 py-1 text-sm capitalize disabled:opacity-40 ${statusStyles[s]}`}
                >
                  {cap(s)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="mt-6">
        <h2 className="mb-2 text-lg font-semibold">Timeline</h2>
        <ol className="space-y-2 border-l-2 border-gray-200 pl-4">
          {events?.length ? (
            events.map((e) => (
              <li key={e.id} className="text-sm">
                <span className="font-medium">
                  {e.actor?.email ?? "someone"}
                </span>{" "}
                {e.type === "created" && "filed this complaint"}
                {e.type === "status_changed" &&
                  `changed status ${e.fromStatus ? `from ${cap(e.fromStatus)} ` : ""}to ${e.toStatus ? cap(e.toStatus) : ""}`}
                {e.type === "commented" && "commented"}
                <span className="text-gray-400">
                  {" "}
                  · {new Date(e.createdAt).toLocaleString()}
                </span>
                {e.note && (
                  <p className="mt-1 rounded bg-gray-50 p-2 text-gray-700">
                    {e.note}
                  </p>
                )}
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-400">No activity yet.</li>
          )}
        </ol>
      </div>

      {/* Comment thread */}
      <div className="mt-6">
        <h2 className="mb-2 text-lg font-semibold">Discussion</h2>
        <div className="space-y-3">
          {comments?.length ? (
            comments.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-gray-200 p-3"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{c.author?.email}</span>
                  {c.author?.role === "admin" && (
                    <span className="rounded bg-blue-100 px-1.5 text-xs text-blue-700">
                      admin
                    </span>
                  )}
                  <span className="text-gray-400">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-gray-800">
                  {c.body}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No comments yet.</p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (body.trim()) {
              addComment.mutate({ complaintId, body: body.trim() });
            }
          }}
          className="mt-4"
        >
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a reply..."
            rows={3}
            className="block w-full rounded-md border border-gray-300 p-2 text-sm"
          />
          <button
            type="submit"
            disabled={addComment.isPending || !body.trim()}
            className="mt-2 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {addComment.isPending ? "Posting..." : "Post reply"}
          </button>
          {addComment.isError && (
            <p className="mt-1 text-sm text-red-500">
              Failed to post. Please try again.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ComplaintDetail;
