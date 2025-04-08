import { AppData } from "$lib/types/AppData";

export const AppList: AppData[] = [
  {
    code: "qr",
    title: "QR Code",
    description: "Customize your own QR Code with Svelte-put/qr.",
    image: "",
    isAvailable: true,
    link: "https://svelte-put.vnphanquang.com/docs/qr",
    trialLink: "/qr-code"
  },
  {
    code: "ph",
    title: "Title",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    image: "",
    isAvailable: false,
    link: "#",
    trialLink: "#"
  }
]