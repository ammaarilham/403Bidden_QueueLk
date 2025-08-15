"use client";

import React, { useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import Swal from "sweetalert2";

const DocumentsPage = () => {
  const [user, setUser] = useState<{
    username: string;
    full_name: string;
    nic_document?: string;
    birth_certificate_document?: string;
    driving_license_document?: string;
    other_document1?: string;
    other_document2?: string;
    other_document3?: string;
  } | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch((err) => {
        console.error("Error fetching user:", err);
        Swal.fire({
          icon: "error",
          title: "Failed to load documents",
          text: "Please try again later.",
        });
      });
  }, []);

  if (!user) return <p className="mt-20 text-center">Loading documents...</p>;

  const docs = [
    { label: "NIC", file: user.nic_document },
    { label: "Birth Certificate", file: user.birth_certificate_document },
    { label: "Driving License", file: user.driving_license_document },
    { label: "Other Document 1", file: user.other_document1 },
    { label: "Other Document 2", file: user.other_document2 },
    { label: "Other Document 3", file: user.other_document3 },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-20">
      <h2 className="mb-8 text-2xl font-bold text-gray-900">
        {user.full_name}'s Documents
      </h2>

      <div className="w-full max-w-xl space-y-4">
        {docs.map(
          (doc, index) =>
            doc.file && (
              <a
                key={index}
                href={`/assets/images/other_documents/${doc.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md transition hover:bg-gray-100"
              >
                <span className="font-medium text-gray-800">{doc.label}</span>
                <FiEye className="text-xl text-gray-600" />
              </a>
            )
        )}

        {docs.every((d) => !d.file) && (
          <p className="text-center text-gray-500">No documents uploaded.</p>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
