import * as yup from "yup";

export const formtest = {
  id: "state-of-phage-2020",
  name: "State of Phage 2020",
  settings: {
    submitText: "Press this big button!"
  },
  basics: {
    name: "Tell us about yourself",
    description: "Give us info about yourself",
    fields: [
      {
        name: "email",
        label: `Your official email address`,
        description: `This e-mail address will appear as your presenter e-mail address in the abstract.`,
        placeholder: `jane.doe@cmu.edu`,
        initial: "some@email.com",
        fieldType: "Input",
        type: "email",
        styles: {
          formletClasses: "_margin-bottom-2",
          inputClasses: "_width-full"
        }
      },
      {
        name: "textArea",
        label: `Some big text area (optional)`,
        placeholder: `Enter some text`,
        rows: 2,
        fieldType: "Textarea",
        styles: {
          formletClasses: "_margin-bottom-2",
          inputClasses: "_width-full"
        }
      },
      {
        name: "testCheck",
        label: `woof woof`,
        description: `__meow meow??__`,
        fieldType: "Checkbox",
        styles: {
          formletClasses: "_margin-bottom-2",
          inputClasses: "_width-full"
        }
      },
      {
        name: "bestFood",
        label: `Best Food...!`,
        description: "what food do ya like",
        fieldType: "Radiogroup",
        styles: {
          formletClasses: "_margin-bottom-2",
          inputClasses: "_width-full"
        },
        options: [
          {
            value: "tacos",
            label: "I really like tacos!"
          },
          {
            value: "burgers",
            label: "mmm burgers. steamed hams."
          }
        ]
      },
      {
        name: "bestDrinks",
        label: `Best Drinks!!!`,
        description: "what drinks do ya like??",
        fieldType: "Checkboxgroup",
        styles: {
          formletClasses: "_margin-bottom-2",
          inputClasses: "_width-full"
        },
        options: [
          {
            value: "gin",
            label: "Gin gin gin gin!"
          },
          {
            value: "tequila",
            label: "tequila tequila tequila tequila tequila"
          }
        ]
      },
      {
        name: "desserts",
        label: `Best Desserts!!!!!!?!?!`,
        description: "oh yeah and desserts!!!!!",
        fieldType: "Select",
        styles: {
          formletClasses: "_margin-bottom-2",
          inputClasses: "_width-full"
        },
        options: [
          { value: "chocolate", label: "Chocolate", group: "Sweet" },
          { value: "pizza", label: "Pizza", group: "Savory" },
          { value: "cake", label: "Cake", group: "Sweet" },
          { value: "chips", label: "Chips", group: "Savory" },
          { value: "ice-cream", label: "Ice Cream", group: "Sweet" }
        ],
        selectOptions: {
          isCreatable: true,
          placeholder: "Choose a dessert 😋",
          isMulti: true
        }
      },
      {
        fieldType: "SelectRadio",
        id: 'toppings',
        name: 'toppings',
        label: 'Add some toppings!',
        description: 'Spice it up w/ toppings',
        emptystate: 'Choose a topping from above, then choose how much of that topping you\'d like!',
        radio: [
          'Tiny bit', 'Loads!', 'Tubs and tubs and tubs!!!' 
        ],
        selectOptions: {
          placeholder: 'Choose a topping to add 😍',
        },
        options: [
          {value: 'choco-frosting', label: 'Chocolate frosting'},
          {value: 'candy', label: 'Candy!'},
          {value: 'peanutbutter', label: 'Peanut butter flakes'},
          {value: 'nuts', label: 'Nuts nuts nuts'},
        ],
        subformlet: {
          fields: [
            {
              name: "toppingSize",
              // label: `How much of this topping would you like?`,
              // description: `Just a little or bucket fulls??`,
              fieldType: "Radiogroup",
              options: [
                {
                  value: "a_litte",
                  label: "Just a little...",
                },
                {
                  value: "lots",
                  label: "A bit more!",
                },
                {
                  value: "buckets",
                  label: "Lots and lots!!!",
                },
              ],
              styles: {
                formletClasses: "_margin-bottom-none-i __inline",
                inputClasses: "_width-full",
              },
            },
          ],
          yup: {
            initialValues: {
              toppingSize: "a_litte",
            },
            validators: {
              toppingSize: yup.string(),
            },
          },
        },
        styles: {
          inputClasses: '_width-full',
        },
      },
      {
        fieldType: "CheckInput",
        id: 'cheese',
        name: 'cheese',
        label: 'Choose yer cheeses',
        description: '🧀🧀🧀',
        showOtherCheckbox: true, // if true, uses an "Other" checkbox to open the area, otherwise open by default
        otherLabel: 'What other cheeses do you have?! (write your own)',
        options: [
          {
            value: 'american',
            label: 'American cheese'
          },
          {
            value: 'swiss',
            label: 'Swiss cheese'
          },
          {
            value: 'swedish',
            label: 'Swedish cheese'
          },
          {
            value: 'swamp',
            label: 'Swamp cheese'
          },
          {
            value: 'detroit',
            label: 'Detroit cheese'
          }
        ],
        subformlet: {
          fields: [
            {
              name: "moreCheese",
              // label: `Any other cheeses?`,
              // description: `What other cheeses?!`,
              placeholder: 'Tell us about all your other cheeses!!',
              fieldType: "Textarea",
              styles: {
                formletClasses: "_margin-bottom-none-i __inline",
                inputClasses: "_width-full",
              },
            },
          ],
          yup: {
            initialValues: {
              moreCheese: undefined,
            },
            validators: {
              moreCheese: yup.string(),
            },
          },
        },
        styles: {
          inputClasses: '_width-full',
        },
      }
    ]
  },
  yup: {
    initialValues: {
      email: "some@email.com",
      textArea: "Some value once told me",
      testCheck: true,
      bestFood: "burgers",
      bestDrinks: ["gin"],
      desserts: ["chocolate"],
      toppings: [],
      cheese: [],
    },
    validators: {
      email: yup
        .string()
        .email("use a real email!")
        .required("email required!"),
      textArea: yup.string().required("hey, write something here."),
      testCheck: yup.boolean(),
      bestFood: yup.string(),
      bestDrinks: yup.array(),
      desserts: yup.array(),
      toppings: yup.array(),
      cheese: yup.array(),
    }
  }
};
