"use client";

import { User, IdCard, Mail, Phone, Building, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CustomerUser {
  id: number;
  username: string;
  full_name: string;
  official_title: string;
  employee_id: string;
  email: string;
  mobile_number: string;
  alternative_contact?: string;
  registered_institution: string | number;
  institution_name?: string;
  role?: number;
}

const Page = () => {
  const [users, setUsers] = useState<CustomerUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/fetch_customer_records")
      .then((res) => res.json())
      .then((data) => setUsers(data.users || []))
      .catch((err) => {
        console.error("Error fetching users:", err);
        toast.error("Failed to load customer records");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground">Loading customer records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center gap-10 py-20 pt-24">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6">
          <h3>View Customer List</h3>
          <small className="text-muted-foreground mt-2">
            Customer users currently registered in the system
          </small>
        </div>

        {users.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            No customer users found.
          </p>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <div key={user.id}>
                <div className="flex items-center justify-between">
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <h4 className="">
                          {user.full_name} ({user.username})
                        </h4>
                      </div>
                      <small className="text-muted-foreground flex items-center gap-1">
                        <IdCard className="size-4" />
                        {user.official_title}
                      </small>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      {user.email && (
                        <div className="border-input rounded-lg border p-3">
                          <h5 className="font-medium">Email</h5>
                          <small className="text-muted-foreground">
                            {user.email}
                          </small>
                        </div>
                      )}

                      {user.mobile_number && (
                        <div className="border-input rounded-lg border p-3">
                          <h5 className="font-medium">Mobile</h5>
                          <small className="text-muted-foreground">
                            {user.mobile_number}
                          </small>
                        </div>
                      )}

                      {user.alternative_contact && (
                        <div className="border-input rounded-lg border p-3">
                          <h5 className="font-medium">Alternative Contact</h5>
                          <small className="text-muted-foreground">
                            {user.alternative_contact}
                          </small>
                        </div>
                      )}

                      {user.employee_id && (
                        <div className="border-input rounded-lg border p-3">
                          <h5 className="font-medium">Employee ID</h5>
                          <small className="text-muted-foreground">
                            {user.employee_id}
                          </small>
                        </div>
                      )}

                      {(user.institution_name ||
                        user.registered_institution) && (
                        <div className="border-input rounded-lg border p-3">
                          <h5 className="font-medium">Institution</h5>
                          <small className="text-muted-foreground">
                            {user.institution_name ||
                              user.registered_institution}
                          </small>
                        </div>
                      )}

                      {user.role && (
                        <div className="border-input rounded-lg border p-3">
                          <h5 className="font-medium">Role</h5>
                          <small className="text-muted-foreground">
                            {user.role === 1
                              ? "Admin"
                              : user.role === 2
                                ? "Customer"
                                : "Unknown"}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {index !== users.length - 1 && <hr className="my-5" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
