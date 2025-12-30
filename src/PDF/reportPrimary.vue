<script setup>
import { ref } from "vue";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "@/helper/pdfmake/kh_fonts";

// Set up the fonts
pdfMake.vfs = pdfFonts;
pdfMake.fonts = {
  moul: {
    normal: "Khmer OS Muol Light Regular.ttf", // Must match exactly the key in vfs
    bold: "Khmer OS Muol Light Regular.ttf",
    italics: "Khmer OS Muol Light Regular.ttf",
    bolditalics: "Khmer OS Muol Light Regular.ttf",
  },
  // Add other font definitions as needed
};

const pdfPrint = () => {
  let dd = {
    pageSize: { width: 600, height: 600 },
    content: [
      {
        stack: [
          {
            text: "ហេលូ",
            alignment: "center",
            font: "moul", // Using the font family name defined above
          },
        ],
      },
    ],
  };
  pdfMake.createPdf(dd).open();
};
</script>

<template>
  <v-btn @click="pdfPrint" flat prepend-icon="mdi-printer"> Prints </v-btn>
</template>
