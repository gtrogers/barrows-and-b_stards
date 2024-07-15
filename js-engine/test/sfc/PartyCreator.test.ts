import { test, describe, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";

import PartyCreator from "../../src/sfc/PartyCreator.vue";

async function setInput(label: string, val: string): Promise<void> {
  const input = screen.getByLabelText(label);
  await fireEvent.update(input, val);
}

describe("<Party Creator />", () => {
  test("Must assign all points to proceed", async () => {
    render(PartyCreator);

    expect(screen.queryByText("Go forth!")).not.toBeTruthy();


    await setInput("brawn", "3");
    await setInput("brains", "3");
    await setInput("presence", "3");

    await setInput("alch", "3");
    await setInput("discipline", "3");
    await setInput("cunn", "3");
    await setInput("will", "3");

    expect(screen.queryByText("Go forth!")).toBeTruthy();
  });
});
