import { test, describe, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";

import PartyCreator from "../../src/sfc/PartyCreator.vue";

describe("<Party Creator />", () => {
  test("Must assign all points to proceed", async () => {
    render(PartyCreator);

    expect(screen.queryByText("Go forth!")).not.toBeTruthy();
    const input = screen.getByLabelText("brawn");

    await fireEvent.update(input, "9");

    expect(screen.queryByText("Go forth!")).toBeTruthy();
  });
});
