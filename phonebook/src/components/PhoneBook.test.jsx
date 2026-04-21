import { render } from "vitest-browser-react";
import { describe, it, expect } from "vitest";
import PhoneBook from "./PhoneBook.jsx";

describe("PhoneBook", () => {
  it("renders input", async () => {
    const screen = await render(<PhoneBook value="Alex" onChange={() => {}} />);

    const text_box = await screen.getByRole("textbox");

    expect(text_box).toHaveValue("Alex");
  });
});
