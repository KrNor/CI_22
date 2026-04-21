import { render } from "vitest-browser-react";
import { expect, test } from "vitest";
import { PhoneBook } from "./PhoneBook.jsx";

test("counter button increments the count", async () => {
  const screen = await render(<PhoneBook count={1} />);

  await screen.getByRole("button", { name: "Increment" }).click();

  await expect.element(screen.getByText("Count is 2")).toBeVisible();
});
