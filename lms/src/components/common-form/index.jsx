import React from "react";
import { Button } from "../ui/button";
import FormControls from "./form-controls";
import { Loader } from "lucide-react";

const CommonForm = ({
  handleSubmit,
  buttonText,
  formControls = [],
  formData,
  setFormData,
  isButtonDisabled = false,
  loading = false,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {/* Render all the form controls */}

      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button disabled={isButtonDisabled} type="submit" className="w-full mt-5">
        {loading ? <Loader /> : <>{buttonText || "Submit"}</>}
      </Button>
    </form>
  );
};

export default CommonForm;
