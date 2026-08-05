import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

function renderWithTheme() {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ThemeToggle />
    </ThemeProvider>
  );
}

describe("ThemeToggle", () => {
  it("renders a button to switch to dark mode initially", async () => {
    renderWithTheme();

    const button = await screen.findByRole("button", {
      name: /cambiar a modo oscuro/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("switches to dark mode and back", async () => {
    const user = userEvent.setup();
    renderWithTheme();

    const toggleToDark = await screen.findByRole("button", {
      name: /cambiar a modo oscuro/i,
    });
    await user.click(toggleToDark);

    const toggleToLight = await screen.findByRole("button", {
      name: /cambiar a modo claro/i,
    });
    expect(toggleToLight).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    await user.click(toggleToLight);

    const toggleToDarkAgain = await screen.findByRole("button", {
      name: /cambiar a modo oscuro/i,
    });
    expect(toggleToDarkAgain).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
