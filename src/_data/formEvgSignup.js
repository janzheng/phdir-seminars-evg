import * as yup from "yup";

export const formData = {
  id: "evg-newsletter-1",
  name: "Sign up for the Evergreen Newsletter",
  description: "",
  settings: {
    submitText: "Sign up",
    submittingText: "Signing up...",
    successText: `You’re signed up for the Evergreen Newsletter!`,
  },
  styles: {
    submitButtonClasses: "_button __action-outline _ease _margin-bottom-none-i _margin-right-none-i",
    successBox: "_margin-none-i",
  
    submittingButtonClasses: "_button __action-outline _ease _margin-bottom-none-i _margin-right-none-i",
    pageFormClasses: "_grid-2"
  },
  formAction: 'https://www.list.cornell.edu/subscribe/subscribe.tml',
  submitHandler: (data)=> {
    // console.log('[formtest submit.handler] Submitting with data:', data)
  },
  fields: [
    {
      name: "email",
      label: `__Email *__`,
      placeholder: `betty.kutter@evergreen.edu`,
      fieldType: "Input",
      type: "email",
      styles: {
        formletClasses: "",
        fieldClasses: "_width-full"
      }
    },
    {
      name: "name",
      label: `__Your Name *__`,
      placeholder: `Betty Kutter`,
      fieldType: "Input",
      type: "text",
      styles: {
        formletClasses: "",
        fieldClasses: "_width-full"
      }
    },
  ],
  yup: {
    initialValues: {
      email: undefined,
      institution: undefined,
    },
    validators: {
      email: yup
        .string()
        .email("Please use a valid email")
        .required("Email required"),
      name: yup
        .string()
        .required("Name required"),
    }
  }
};
