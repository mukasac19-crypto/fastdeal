"use client";

import Image from "next/image";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET = "vehicle-photos";

export function ImageUploader({
  vehicleId,
  images,
  onChange
}: {
  vehicleId: string | null;
  images: string[];
  onChange: (next: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }

    setError(null);
    setUploading(true);

    const folder = vehicleId ?? "draft";
    const newUrls: string[] = [];

    try {
      for (const file of files) {
        const cleanName = file.name
          .toLowerCase()
          .replace(/[^a-z0-9.-]+/g, "-")
          .replace(/-+/g, "-");
        const path = `${folder}/${Date.now()}-${cleanName}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, {
            cacheControl: "31536000",
            upsert: false,
            contentType: file.type
          });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        newUrls.push(data.publicUrl);
      }

      onChange([...images, ...newUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleFileInput(event: ChangeEvent<HTMLInputElement>) {
    const list = event.target.files;
    if (!list) return;
    uploadFiles(Array.from(list));
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    uploadFiles(files);
  }

  async function removeImage(url: string) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const next = images.filter((value) => value !== url);
    onChange(next);

    const path = extractStoragePath(url);
    if (path) {
      await supabase.storage.from(BUCKET).remove([path]);
    }
  }

  function moveImage(from: number, to: number) {
    if (from === to || to < 0 || to >= images.length) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved!);
    onChange(next);
  }

  function makeHero(index: number) {
    moveImage(index, 0);
  }

  return (
    <div className="image-uploader">
      <div
        className={`image-dropzone ${dragOver ? "is-over" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileInput}
        />
        <strong>{uploading ? "Uploading…" : "Drop photos or click to upload"}</strong>
        <small>JPG, PNG, WebP. First photo becomes the hero.</small>
      </div>

      {error ? <p className="image-uploader-error">{error}</p> : null}

      {images.length > 0 ? (
        <ul className="image-grid">
          {images.map((url, index) => (
            <li
              key={url + index}
              className={`image-tile ${dragIndex === index ? "is-dragging" : ""}`}
              draggable
              onDragStart={() => setDragIndex(index)}
              onDragEnd={() => setDragIndex(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (dragIndex !== null) moveImage(dragIndex, index);
                setDragIndex(null);
              }}
            >
              <div className="image-tile-media">
                <Image
                  src={url}
                  alt=""
                  fill
                  sizes="160px"
                  unoptimized={!url.includes("supabase.co")}
                />
                {index === 0 ? (
                  <span className="image-tile-hero">Hero</span>
                ) : null}
              </div>
              <div className="image-tile-actions">
                {index > 0 ? (
                  <button type="button" onClick={() => makeHero(index)}>
                    Make hero
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => moveImage(index, index - 1)}
                  disabled={index === 0}
                  aria-label="Move left"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(index, index + 1)}
                  disabled={index === images.length - 1}
                  aria-label="Move right"
                >
                  →
                </button>
                <button
                  type="button"
                  className="image-tile-delete"
                  onClick={() => removeImage(url)}
                  aria-label="Delete photo"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function extractStoragePath(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return url.slice(index + marker.length);
}
