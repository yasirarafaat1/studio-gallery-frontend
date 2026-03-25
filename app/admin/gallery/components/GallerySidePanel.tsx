"use client";
import { CloudUpload, Loader2, Save, UserMinus, UserPlus, X } from "lucide-react";

type PanelType = "edit" | "assign" | "upload" | null;

type Props = {
  panel: PanelType;
  onClose: () => void;
  editTitle: string;
  editDescription: string;
  assignEmails: string;
  assignedEmails: string[];
  removingEmail: string | null;
  saving: boolean;
  uploading: boolean;
  assigning: boolean;
  actionMessage?: string | null;
  files: File[];
  inputKey: number;
  onChangeTitle: (value: string) => void;
  onChangeDescription: (value: string) => void;
  onChangeAssignEmails: (value: string) => void;
  onSaveGallery: () => void;
  onAssignEmails: () => void;
  onRemoveEmail: (email: string) => void;
  onUploadFiles: (files: File[]) => void;
  setFiles: (files: File[]) => void;
};

export default function GallerySidePanel({
  panel,
  onClose,
  editTitle,
  editDescription,
  assignEmails,
  assignedEmails,
  removingEmail,
  saving,
  uploading,
  assigning,
  actionMessage,
  files,
  inputKey,
  onChangeTitle,
  onChangeDescription,
  onChangeAssignEmails,
  onSaveGallery,
  onAssignEmails,
  onRemoveEmail,
  onUploadFiles,
  setFiles,
}: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 ${
          panel ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-30 flex h-full w-full max-w-md flex-col gap-5 border-l border-white/10 bg-[#121212] p-6 shadow-2xl transition-transform duration-300 sm:w-[420px] ${
          panel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Panel</p>
            <h4 className="text-xl font-semibold text-white">
              {panel === "edit" ? "Edit gallery" : panel === "assign" ? "Assign access" : "Upload files"}
            </h4>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-full border border-white/15 p-2 text-white/70"
            aria-label="Close"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {panel === "edit" ? (
          <div className="grid gap-3">
            <input
              value={editTitle}
              onChange={(event) => onChangeTitle(event.target.value)}
              placeholder="Gallery title"
              className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/30"
              onKeyDown={(event) => {
                if (event.key === "Enter") onSaveGallery();
              }}
            />
            <input
              value={editDescription}
              onChange={(event) => onChangeDescription(event.target.value)}
              placeholder="Description (optional)"
              className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/30"
              onKeyDown={(event) => {
                if (event.key === "Enter") onSaveGallery();
              }}
            />
            <button
              onClick={onSaveGallery}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-2xl cursor-pointer bg-white px-4 py-2 text-xs font-semibold text-black transition disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Save"
              title="Save"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
            </button>
            {actionMessage ? <p className="text-xs text-emerald-200">{actionMessage}</p> : null}
          </div>
        ) : null}

        {panel === "upload" ? (
          <div className="grid gap-3">
            <input
              key={inputKey}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(event) => setFiles(Array.from(event.target.files || []))}
              className="text-xs text-[var(--muted)] file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-semibold file:text-black"
            />
            <button
              onClick={() => onUploadFiles(files)}
              disabled={files.length === 0 || uploading}
              className="flex items-center justify-center gap-2 rounded-2xl cursor-pointer border border-white/20 px-4 py-2 text-xs font-semibold text-white/90 transition disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Upload"
              title="Upload"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />} Upload
            </button>
            {actionMessage ? <p className="text-xs text-emerald-200">{actionMessage}</p> : null}
          </div>
        ) : null}

        {panel === "assign" ? (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)]">
                Assigned emails ({assignedEmails.length})
              </p>
              {assignedEmails.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {assignedEmails.map((email) => (
                    <span
                      key={email}
                      className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
                    >
                      {email}
                      <button
                        onClick={() => onRemoveEmail(email)}
                        disabled={removingEmail === email}
                        className="cursor-pointer rounded-full border border-white/10 p-1 text-white/70 disabled:opacity-60"
                        aria-label={`Remove ${email}`}
                        title="Remove"
                      >
                        {removingEmail === email ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <UserMinus className="h-3 w-3" />
                        )}
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--muted)]">No emails assigned yet.</p>
              )}
            </div>
            <input
              value={assignEmails}
              onChange={(event) => onChangeAssignEmails(event.target.value)}
              placeholder="client1@mail.com"
              className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none focus:border-white/30"
              onKeyDown={(event) => {
                if (event.key === "Enter") onAssignEmails();
              }}
            />
            <button
              onClick={onAssignEmails}
              disabled={!assignEmails.trim() || assigning}
              className="flex items-center gap-2 justify-center rounded-2xl border border-white/20 px-4 py-2 text-xs font-semibold text-white/90 transition disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Assign"
              title="Assign"
            >
              {assigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Assign
            </button>
            {actionMessage ? <p className="text-xs text-emerald-200">{actionMessage}</p> : null}
          </div>
        ) : null}
      </aside>
    </>
  );
}

