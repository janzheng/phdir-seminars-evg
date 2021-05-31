import * as yup from "yup";

export const formData = {
  id: "evg-signup-1",
  name: "## Sign Up For Evergreen",
  description: "",
  settings: {
    submitText: "Buy your ticket",
    submittingText: "Buying your ticket...",
    successText: `
    \n\n ## Welcome to Evergreen 2021!
    \n\n We are excited to have you onboard. A confirmation email has been sent to {{email}}.
    \n\n If you have any questions, please don't hesitate to reach out to the team at evergreen@phage.directory
    \n\n ~ Evergreen 2021 Team`,
  },
  styles: {
    submitButtonClasses: "_button __action-outline _ease _margin-bottom-none-i _margin-right-none-i  __massive",
    successBox: "_margin-none-i",

    submittingButtonClasses: "_button __action-outline _ease _margin-bottom-none-i  __massive",
  },
  submitHandler: (data)=> {
    console.log('[formtest submit.handler] Submitting with data:', data)
  },
  fields: [
    {
      name: "name",
      label: `__First and Last Name__ *`,
      placeholder: `Betty Kutter`,
      fieldType: "Input",
      type: "text",
      styles: {
        formletClasses: "_margin-top-2 _margin-bottom-2",
        fieldClasses: "_width-full"
      }
    },
    {
      name: "email",
      label: `__Email address__ *`,
      placeholder: `betty.kutter@evergreen.edu`,
      fieldType: "Input",
      type: "email",
      styles: {
        formletClasses: "_margin-top-2 _margin-bottom-2",
        fieldClasses: "_width-full"
      }
    },
    {
      name: "institution",
      label: `__Institution / Affiliation__ *`,
      placeholder: `e.g. Evergreen State College`,
      fieldType: "Input",
      type: "text",
      styles: {
        formletClasses: "_margin-top-2 _margin-bottom-2",
        fieldClasses: "_width-full"
      }
    },
    // {
    //   name: "affiliation",
    //   label: `Organization or Affiliation`,
    //   placeholder: `e.g. University of Georgia`,
    //   fieldType: "Input",
    //   type: "text",
    //   styles: {
    //     formletClasses: "_margin-top-2 _margin-bottom-2",
    //     fieldClasses: "_width-full"
    //   }
    // },
    {
      name: "country",
      label: `__Country__ *`,
      placeholder: `e.g. United States`,
      fieldType: "Input",
      type: "text",
      styles: {
        formletClasses: "_margin-top-2 _margin-bottom-2",
        fieldClasses: "_width-full"
      }
    },
      {
        name: "position",
        label: `Career Position *`,
        fieldType: "Radiogroup",
        styles: {
          formletClasses: "_margin-bottom-2",
          fieldClasses: "_width-full",
          labelClasses: "__bold",
        },
        options: [
          {
            value: "Industry",
            label: "Industry"
          },
          {
            value: "Academic",
            label: "Academic Professional"
          },
          {
            value: "Student",
            label: "Student"
          }
        ]
      },
      {
        name: "tickettype",
        label: `Ticket Type *`,
        description: "Are you attending in-person or virtually?",
        fieldType: "Radiogroup",
        styles: {
          formletClasses: "_margin-bottom-2",
          fieldClasses: "_width-full",
          labelClasses: "__bold",
        },
        options: [
          {
            value: "Virtual",
            label: "Virtually"
          },
          {
            value: "In-Person",
            label: "In-Person"
          }
        ]
      },
      {
        name: "terms",
        label: ``,
        description: "By checking this box, you agree to our [terms & conditions](/terms)",
        fieldType: "Checkbox",
        styles: {
          formletClasses: "_margin-bottom-2 _md-pfix _padding-none",
          fieldClasses: "_width-full",
          labelClasses: "__bold",
          descriptionClasses: "_padding-none"
        }
      },
//     {
//       name: "attendance",
//       label: `__Apply to attend in-person?__`,
//       description: `Yes, I’m interested in attending Evergreen in-person. 

// We are still working out the details, and pricing, and we will require all guests to be fully vaccinated.`,
//       fieldType: "Checkbox",
//       styles: {
//         formletClasses: "_margin-bottom-2",
//         inputClasses: "_width-full"
//       }
//     },




    // {
    //   name: "abstract",
    //   label: `__Short Abstract__ (optional)`,
    //   placeholder: `(Optional) Add your abstract here. Please keep your abstract below 400 words.`,
    //   description: `If you don't have an abstract right now, don't worry! Sign up anyway. You're welcome to add your abstract any time before June.`,
    //   rows: 6,
    //   fieldType: "Textarea",
    //   styles: {
    //     formletClasses: "_margin-top-2 _margin-bottom-2",
    //     fieldClasses: "_width-full"
    //   }
    // },
    // {
    //   name: "authors",
    //   label: `__Abstract Authors__ (optional)`,
    //   placeholder: `Jan Zheng, Jessica Sacher`,
    //   description: `If you add an abstract, please list all authors with affiliations in a way you'd like them to be displayed in the abstract book. Please include each author's first and last name, institution, and affiliation country.`,
    //   fieldType: "Input",
    //   type: "text",
    //   styles: {
    //     formletClasses: "_margin-top-2 _margin-bottom-2",
    //     fieldClasses: "_width-full"
    //   }
    // },

  ],
  yup: {
    initialValues: {
      // abstract: undefined,
      // authors: undefined,
      name: undefined,
      institution: undefined,
      email: undefined,
      affiliation: undefined,
      country: undefined,
      // attendance: undefined,
      position: undefined,
      tickettype: undefined,
      terms: undefined,
    },
    validators: {
      email: yup
        .string()
        .email("Please use a valid email")
        .required("Email required"),
      institution: yup
        .string()
        .required("Institution required"),
      country: yup
        .string()
        .required("Institution Country"),
      // affiliation: yup
      //   .string()
      //   .required("Organization or Affiliation required"),
      name: yup
        .string()
        .required("Name required"),
      position: yup
        .string()
        .required("Position required"),
      tickettype: yup
        .string()
        .required("Ticket type required"),
      terms: yup
        .boolean()
        .required("Please read and agree to the terms and conditions before finalizing your Evergreen registration.")

      // attendance: yup.boolean(),s
      // abstract: yup
      //   .string(),
      // authors: yup
      //   .string(),
    }
  }
};
