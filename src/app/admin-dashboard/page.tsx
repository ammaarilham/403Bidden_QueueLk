import SuccessRedirectPage from "@/components/shared/SuccessRedirectPage";
import React from "react";

const page = () => {
  return (
    <div>
      <SuccessRedirectPage
        title="Inquiry sent successfully!"
        message="You will receive an SMS with the details..."
        showButton={true}
        buttonText="Go to Dashboard"
        buttonHref="/dashboard"
      />
    </div>
  );
};

export default page;
