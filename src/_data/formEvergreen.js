
import * as yup from "yup";

export const formData = {
  id: "evg-signup-1",
  name: "## Sign Up For Evergreen",
  description: "",
  settings: {
    submitText: "Register for Evergreen",
    submittingText: "Registering for Evergreen...",
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
      label: `__First and Last Name *__`,
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
      label: `__Email *__`,
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
      label: `__Institution / Affiliation *__`,
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
      label: `__Country *__`,
      placeholder: `e.g. United States`,
      fieldType: "Input",
      type: "text",
      styles: {
        formletClasses: "_margin-top-2 _margin-bottom-2",
        fieldClasses: "_width-full"
      }
    },
    {
      name: "interest",
      label: `__Primary Research Interest *__`,
      fieldType: "Radiogroup",
      styles: {
        formletClasses: "_margin-bottom-2",
        fieldClasses: "_width-full",
        labelClasses: "__bold",
      },
      options: [
        {
          value: "Structure and Molecular mechanisms",
          label: "Structure and Molecular mechanisms"
        },
        {
          value: "Phage-based biotech",
          label: "Phage-based biotech"
        },
        {
          value: "Temperate Phage",
          label: "Temperate Phage",
        },
        {
          value: "Genomics",
          label: "Genomics",
        },
        {
          value: "Agriculture and Food Safety",
          label: "Agriculture and Food Safety",
        },
        {
          value: "Ecology and Evolution",
          label: "Ecology and Evolution",
        },
        {
          value: "Phage Therapy",
          label: "Phage Therapy",
        }
      ]
    },
    {
      name: "position",
      label: `__Career Position *__`,
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
          label: "Student \n\n Only available to currently enrolled undergraduate and graduate students, and retirees",
        }
      ]
    },
    {
      name: "tickettype",
      label: `__Registration Type *__`,
      description: "Are you attending virtually or in-person?",
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
          label: "In-Person \n\n To attend in-person, you must read, agree, and adhere <br>to our <a target='_blank' href='/terms#covid-19-travel-policy'>COVID-19 Travel Policy</a>"
        }
      ]
    },
    {
      name: "diet",
      label: `__Dietary Restrictions__`,
      description: "For those attending in-person, do you have any dietary restrictions?",
      placeholder: `ex: Peanuts`,
      fieldType: "Input",
      type: "text",
      styles: {
        formletClasses: "_margin-top-2 _margin-bottom-2",
        fieldClasses: "_width-full"
      }
    },
    {
      name: "visa",
      label: `__Visa Support Letter__`,
      description: "For those attending in-person and are traveling from outside the U.S., will you need a visa support letter?",
      fieldType: "Checkbox",
      styles: {
        formletClasses: "_margin-bottom-2 _md-pfix _padding-none",
        fieldClasses: "_width-full",
        labelClasses: "_padding-none",
        descriptionClasses: "_padding-none"
      },
    },
    {
      name: "terms",
      label: `Read and agree to our travel and data policies *`,
      description: "By checking this box, you have read and agreed to our <a target='_blank' href='/terms'>COVID-19 Travel Policy, and Data Privacy Policy</a>",
      fieldType: "Checkbox",
      styles: {
        formletClasses: "_margin-bottom-2 _md-pfix _padding-none",
        fieldClasses: "_width-full",
        labelClasses: "__bold",
        descriptionClasses: "_padding-none"
      }
    },
  ],
  yup: {
    initialValues: {
      // abstract: undefined,
      // authors: undefined,
      name: undefined,
      institution: undefined,
      email: undefined,
      // affiliation: undefined,
      country: undefined,
      // attendance: undefined,
      position: undefined,
      tickettype: undefined,
      diet: null,
      interest: undefined,
      visa: null,
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
        .required("Registration type required"),
      diet: yup
        .string()
        .notRequired()
        .nullable(),
      interest: yup
        .string()
        .required("Please choose an area of interest"),
      visa: yup
        .boolean()
        .notRequired()
        .nullable(),
      terms: yup
        .boolean()
        .notOneOf([false], "You must read and agree to the terms and conditions before finalizing your Evergreen registration.") // force to be true
        .required("Please read and agree to the terms and conditions before finalizing your Evergreen registration.")

      // attendance: yup.boolean(),s
      // abstract: yup
      //   .string(),
      // authors: yup
      //   .string(),
    }
  }
};
