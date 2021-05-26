import * as yup from "yup";

export const formData = {
  id: "instill-los",
  name: "## Instill Letter of Support",
  description: "",
  settings: {
    submitText: "Send Letter of Support",
    successText: `
    \n\n ### Thanks for your support!
    \n\n It really means a lot to us that you have taken time out of your day to write a letter of support for our grant. 
    \n\n We really appreciate it! 
    \n\n ~ Jan & Jessica, Phage Directory`,
  },
  submitHandler: (data)=> {
    console.log('[formtest submit.handler] Submitting with data:', data)
  },
  fields: [
    {
      name: "comments",
      label: `Letter of Support`,
      placeholder: `Please type your letter of support here, or email it to us at instill@phage.directory`,
      rows: 6,
      fieldType: "Textarea",
      styles: {
        formletClasses: "_margin-bottom-2",
        fieldClasses: "_width-full"
      }
    },
    {
      name: "name",
      label: `Name`,
      fieldType: "Input",
      type: "text",
      styles: {
        formletClasses: "_margin-bottom-2",
        fieldClasses: "_width-full"
      }
    },
    {
      name: "email",
      label: `Email`,
      placeholder: `jane.doe@cmu.edu`,
      fieldType: "Input",
      type: "email",
      styles: {
        formletClasses: "_margin-bottom-2",
        fieldClasses: "_width-full"
      }
    },
    {
      name: "position",
      label: `Position and Institution`,
      placeholder: `e.g. PhD student at University of Georgia, US`,
      fieldType: "Input",
      type: "text",
      styles: {
        formletClasses: "_margin-bottom-2",
        fieldClasses: "_width-full"
      }
    },
  ],
  yup: {
    initialValues: {
      comments: undefined,
      name: undefined,
      position: undefined,
      email: undefined,
    },
    validators: {
      email: yup
        .string()
        .email("Please use a valid email")
        .required("Email required!"),
      position: yup
        .string()
        .required("Institution / Position required"),
      comments: yup
        .string()
        .required("Letter of Support required"),
      name: yup
        .string()
        .required("Name required"),
    }
  }
};
