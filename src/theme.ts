import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#f9f7e3" },
          100: { value: "#eee9b8" },
          200: { value: "#e2db8c" },
          300: { value: "#d6cd5f" },
          400: { value: "#cbc03c" },
          500: { value: "#b8ad2a" },
          600: { value: "#9c9420" },
          700: { value: "#7a7318" },
          800: { value: "#57530f" },
          900: { value: "#353207" },
        },
      },
      fonts: {
        heading: { value: `'Inter', system-ui, sans-serif` },
        body: { value: `'Inter', system-ui, sans-serif` },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "{colors.gray.900}" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.50}" },
          emphasized: { value: "{colors.brand.600}" },
          focusRing: { value: "{colors.brand.500}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);